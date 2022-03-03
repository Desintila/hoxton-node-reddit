import Database from "better-sqlite3";
import cors from "cors";
import express from "express";


const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log
})


const getPostById = db.prepare(`SELECT * FROM posts WHERE id=?;`)

const getUserById = db.prepare(`SELECT * FROM users WHERE id=?;`)

const getSubredditById = db.prepare(`SELECT * FROM subreddits WHERE id=?;`)

const getCommentsByPostId = db.prepare(`SELECT  * FROM comments WHERE postId=?;`)

const createPost = db.prepare(`INSERT INTO posts(description,title,created,userId,subredditId) VALUES(?,?,?,?,?);`)

const getAllSubreddits = db.prepare(`SELECT * FROM subreddits`)

const createSubreddit = db.prepare(`INSERT INTO subreddits(name,description,background) VALUES (?,?,?);`)

const createUser = db.prepare(`INSERT INTO users(username,email,password) VALUES (?,?,?);`)
const getAllUsers = db.prepare(`SELECT * FROM users`)

app.get('/posts/:id', (req, res) => {
    const id = req.params.id

    const post = getPostById.get(id)

    if (post) {
        const user = getUserById.get(post.userId)
        post.user = user
        const subreddit = getSubredditById.get(post.subredditId)
        post.subreddit = subreddit
        const comments = getCommentsByPostId.all(post.id)
        post.comments = comments
        res.send(post)
    }

    else {
        res.status(404).send({ error: 'Post not found' })
    }
})

app.post('/posts', (req, res) => {
    const { description, title, created, userId, subredditId } = req.body

    let errors = []

    if (typeof description !== 'string') errors.push('Description missing or not a string')
    if (typeof title !== 'string') errors.push('Title missing or not a string')
    if (typeof created !== 'string') errors.push('Created Date missing or not a string')
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof subredditId !== 'number') errors.push('SubredditId missing or not a number')

    if (errors.length === 0) {
        const result = createPost.run(description, title, created, userId, subredditId)

        const newPost = getPostById.run(result.lastInsertRowid)

        res.send(newPost)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.post('/users', (req, res) => {
    const { username, email, password } = req.body

    let errors = []

    if (typeof username !== 'string') errors.push('Username missing or not a string')
    if (typeof email !== 'string') errors.push('Email missing or not a string')
    if (typeof password !== 'string') errors.push('Password missing or not a string')


    if (errors.length === 0) {
        const result = createUser.run(username, email, password)

        const newUser = getUserById.run(result.lastInsertRowid)
        res.send(newUser)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.get('/users', (req, res) => {
    const allUsers = getAllUsers.all()
    res.send(allUsers)
})

app.get('/subreddits', (req, res) => {
    const allSubreddits = getAllSubreddits.all()

    res.send(allSubreddits)
})

app.get('/subreddits/:id', (req, res) => {
    const id = req.params.id

    const subreddit = getSubredditById.get(id)
    if (subreddit) {
        res.send(subreddit)
    }
    else {
        res.status(404).send({ error: 'Subreddit  Not Found' })
    }
})


app.post('/subreddits', (req, res) => {
    const { name, description, background } = req.body

    let errors = []

    if (typeof name !== 'string') errors.push('Name missing or not a string')
    if (typeof description !== 'string') errors.push('Description missing or not a string')
    if (typeof background !== 'string') errors.push('Background missing or not a string')


    if (errors.length === 0) {
        const result = createSubreddit.run(name, description, background)

        const newSubreddit = getSubredditById.run(result.lastInsertRowid)

        res.send(newSubreddit)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.listen(3001)