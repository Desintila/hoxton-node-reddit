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

const login = db.prepare(`SELECT * FROM users WHERE email=? `)

const createComment = db.prepare(`INSERT INTO comments(text,userId,postId) VALUES (?,?,?); `)
const getCommentById = db.prepare(`SELECT * FROM comments WHERE id=?;`)
const getAllPosts = db.prepare(`SELECT * FROM posts `)

const getUpvotesByPostId = db.prepare(`SELECT  * FROM postUpvotes WHERE postId=?;`)
const getDownvotesByPostId = db.prepare(`SELECT  * FROM postDownvotes WHERE postId=?;`)

const createUpvote = db.prepare(`INSERT INTO postUpvotes(userId,postId) VALUES (?,?); `)
const getUpvoteById = db.prepare(`SELECT * FROM postUpvotes WHERE id=?;`)
const createDownvote = db.prepare(`INSERT INTO postDownvotes(userId,postId) VALUES (?,?); `)
const getDownvoteById = db.prepare(`SELECT * FROM postDownvotes WHERE id=?;`)

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
        const upvotes = getUpvotesByPostId.all(post.id)
        post.upvotes = upvotes
        const downvotes = getDownvotesByPostId.all(post.id)
        post.downvotes = downvotes
        res.send(post)
    }

    else {
        res.status(404).send({ error: 'Post not found' })
    }
})

app.get('/posts', (req, res) => {

    const allposts = getAllPosts.all()
    for (const post of allposts) {
        const user = getUserById.get(post.userId)
        post.user = user
        const subreddit = getSubredditById.get(post.subredditId)
        post.subreddit = subreddit
        const comments = getCommentsByPostId.all(post.id)
        post.comments = comments
        const upvotes = getUpvotesByPostId.all(post.id)
        post.upvotes = upvotes
        const downvotes = getDownvotesByPostId.all(post.id)
        post.downvotes = downvotes
    }
    res.send(allposts)

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


app.post('/login', (req, res) => {
    const { email, password } = req.body
    const info = login.get(email)

    if (info) {
        if (password === info.password) {
            res.send(info)
        }
        else {
            res.status(400).send({ error: 'Incorrect password' })
        }
    }
    else {
        res.status(404).send({ error: 'Email does not exists' })
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


app.post('/comments', (req, res) => {
    const { text, userId, postId } = req.body

    let errors = []
    if (typeof text !== 'string') errors.push('Text missing or not a string')
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof postId !== 'number') errors.push('PostId missing or not a number')


    if (errors.length === 0) {
        const result = createComment.run(text, userId, postId)
        const newComment = getCommentById.run(result.lastInsertRowid)
        res.send(newComment)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.post('/upvotes', (req, res) => {
    const { userId, postId } = req.body

    let errors = []
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof postId !== 'number') errors.push('PostId missing or not a number')


    if (errors.length === 0) {
        const result = createUpvote.run(userId, postId)
        const newUpvote = getUpvoteById.run(result.lastInsertRowid)
        res.send(newUpvote)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.post('/downvotes', (req, res) => {
    const { userId, postId } = req.body

    let errors = []
    if (typeof userId !== 'number') errors.push('UserId missing or not a number')
    if (typeof postId !== 'number') errors.push('PostId missing or not a number')


    if (errors.length === 0) {
        const result = createDownvote.run(userId, postId)
        const newDownvote = getDownvoteById.run(result.lastInsertRowid)
        res.send(newDownvote)
    }
    else {
        res.status(400).send({ error: errors })
    }
})


app.listen(3001)