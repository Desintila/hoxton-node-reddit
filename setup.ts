import Database from "better-sqlite3";

const db = new Database('./data.db', {
    verbose: console.log
})

const users = [
    {
        username: 'Desintila',
        email: 'desintila@email.com',
        password: '1234'
    },
    {
        username: 'Denis',
        email: 'denis@email.com',
        password: '123456'
    }
]

db.exec(`

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS subreddits;
DROP TABLE IF EXISTS usersubreddits;


CREATE TABLE users (
    "id" integer  PRIMARY KEY,
    "username" text,
    "email" text,
    "password" text
  );
  
  CREATE TABLE posts (
    "id" integer PRIMARY KEY,
    "description" text,
    "title" text,
    "created" text,
    "userId" integer,
    "vote" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id")
  );
  
  CREATE TABLE comments (
    "id" integer PRIMARY KEY,
    "text" text,
    "postId" integer,
    "userId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    FOREIGN KEY ("postId") REFERENCES "posts" ("id")
  );
  
  CREATE TABLE subreddits (
    "id" integer PRIMARY KEY,
    "name" text
  );
  
  CREATE TABLE usersubreddits (
    "id" integer PRIMARY KEY,
    "userId" integer,
    "subredditId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    FOREIGN KEY ("subredditId") REFERENCES "subreddits" ("id")
  );
`)

const createUser = db.prepare(`
INSERT INTO users(username,email,password) VALUES (?,?,?);
`)


for (const user of users) {
    createUser.run(user.username, user.email, user.password)
}