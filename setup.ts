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
  },
  {
    username: 'Ela',
    email: 'ela@email.com',
    password: 'ela89'
  },
  {
    username: 'Dori',
    email: 'dori@email.com',
    password: 'dori1234'
  }
]

const subreddits = [
  {
    name: 'r/pokemon',
    description: 'r/pokemon is an unofficial Pokémon fan community. This is the place for most things Pokémon on Reddit—TV shows, video games, toys, trading cards, you name it!',
    background: 'https://preview.redd.it/ns3p1r0k62l81.png?width=640&crop=smart&auto=webp&s=8734776c59caffb2b9b44bbb4bb056a92950f5dd'
  },
  {
    name: 'r/albania',
    description: 'Ask, find, and simply explore things about Albania and Albanians in this subreddit!',
    background: 'https://preview.redd.it/4idhwgr760l81.jpg?width=640&crop=smart&auto=webp&s=c98a2eac8c1a57de6ca60ab1a94109a14f3a080a'
  },
  {
    name: 'r/wholesomememes',
    description: 'Welcome to the wholesome side of the internet! This community is for those searching for a way to capture virtue on the internet.',
    background: 'https://preview.redd.it/7skp21bg86l81.jpg?width=640&crop=smart&auto=webp&s=e89d0f36f516d1e0a2abd9eb49c329547f3d1a0d'
  },
  {
    name: 'r/worldnews',
    description: 'A place for major news from around the world, excluding US-internal news.',
    background: 'https://i1.sndcdn.com/avatars-000510316587-b56ccf-original.jpg'
  }
]


const usersubreddits = [
  {
    userId: 1,
    subredditId: 1
  },
  {
    userId: 1,
    subredditId: 3
  },
  {
    userId: 2,
    subredditId: 1
  },
  {
    userId: 2,
    subredditId: 4
  },
  {
    userId: 3,
    subredditId: 3
  },
  {
    userId: 4,
    subredditId: 4
  },
  {
    userId: 4,
    subredditId: 2
  }
]


const posts = [
  {
    description: 'https://i.redd.it/4idhwgr760l81.jpg',
    title: '578 vite të Besëlidhjes së Lezhes',
    created: '02/03/2022',
    userId: 4,
    subredditId: 2,
  },
  {
    description: 'https://preview.redd.it/2de3uniwh0l81.jpg?width=640&crop=smart&auto=webp&s=908d23d00eda71bca5613793041da433b0dbd396',
    title: `my hobby is to make patches.... I just couldn't resist :3`,
    created: '01/03/2022',
    userId: 1,
    subredditId: 1,
  },
  {
    description: 'https://preview.redd.it/i5ut0ji150l81.png?width=960&crop=smart&auto=webp&s=6bc19ef8b6da58350a28c56d5d1f2236176b2df9',
    title: 'Which one are you picking? 🌿🔥💦',
    created: '22/02/2022',
    userId: 2,
    subredditId: 1,
  },
  {
    description: 'https://i.redd.it/ip0tx9xph1l81.jpg',
    title: 'Our alliance is strong (our progress so far)',
    created: '03/03/2022',
    userId: 3,
    subredditId: 3,
  },
  {
    description: 'Reports are doing the rounds that both Finland and Sweden have received notice from the Russian Government to provide them with Security Guarantees.',
    title: 'Reports that Finland and Sweden have received notices from Russia re not joining NATO',
    created: '01/03/2022',
    userId: 2,
    subredditId: 4
  },
  {
    description: '“I would like to point out that it is in the heads of Western politicians that the idea of a nuclear war is spinning constantly, and not in the heads of Russians,” Lavrov says in an interview with Russian and foreign media.',
    title: 'Russian foreign minister accuses West of considering "nuclear war"',
    created: '28/03/2022',
    userId: 4,
    subredditId: 4
  }
]

const comments = [
  {
    text: 'comment1',
    postId: 1,
    userId: 2
  },
  {
    text: 'comment2',
    postId: 2,
    userId: 3
  }
]

const postUpvotes = [
  {
    postId: 1,
    userId: 2
  },
  {
    postId: 2,
    userId: 3
  },
  {
    postId: 4,
    userId: 3
  },
  {
    postId: 4,
    userId: 4
  },
  {
    postId: 1,
    userId: 4
  }
]

const postDownvotes = [
  {
    postId: 1,
    userId: 1
  },
  {
    postId: 2,
    userId: 4
  },
  {
    postId: 3,
    userId: 3
  },
  {
    postId: 2,
    userId: 2
  }
]

db.exec(`
DROP TABLE IF EXISTS usersubreddits;
DROP TABLE IF EXISTS postUpvotes;
DROP TABLE IF EXISTS postDownvotes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subreddits;






CREATE TABLE users (
    "id" integer  PRIMARY KEY,
    "username" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "password" text NOT NULL
  );
  
  CREATE TABLE posts (
    "id" integer PRIMARY KEY,
    "description" text,
    "title" text,
    "created" text,
    "userId" integer,
    "subredditId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id")
    FOREIGN KEY ("subredditId") REFERENCES "subreddits" ("id")
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
    "name" text,
    "description" text,
    "background" text
  );
  
  CREATE TABLE usersubreddits (
    "id" integer PRIMARY KEY,
    "userId" integer,
    "subredditId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    FOREIGN KEY ("subredditId") REFERENCES "subreddits" ("id")
  );

  CREATE TABLE postUpvotes (
    "id" integer PRIMARY KEY,
    "postId" integer,
    "userId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    FOREIGN KEY ("postId") REFERENCES "posts" ("id")
  );

  CREATE TABLE postDownvotes (
    "id" integer PRIMARY KEY,
    "postId" integer,
    "userId" integer,
    FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    FOREIGN KEY ("postId") REFERENCES "posts" ("id")
  );
`)

const createUser = db.prepare(`
INSERT INTO users(username,email,password) VALUES (?,?,?);
`)

const createSubreddit = db.prepare(`
INSERT INTO subreddits(name,description,background) VALUES (?,?,?);
`)

const createUserSubreddit = db.prepare(`
INSERT INTO usersubreddits(userId,subredditId) VALUES (?,?);
`)

const createPost = db.prepare(`
INSERT INTO posts(description,title,created,userId,subredditId) VALUES (?,?,?,?,?);
`)

const createComment = db.prepare(`
INSERT INTO comments(text,userId,postId) VALUES (?,?,?);
`)

const createUpvote = db.prepare(`
INSERT INTO postUpvotes(userId,postId) VALUES (?,?);
`)

const createDownvote = db.prepare(`
INSERT INTO postDownvotes(userId,postId) VALUES (?,?);
`)
for (const user of users) {
  createUser.run(user.username, user.email, user.password)
}

for (const subreddit of subreddits) {
  createSubreddit.run(subreddit.name, subreddit.description, subreddit.background)
}

for (const usersubreddit of usersubreddits) {
  createUserSubreddit.run(usersubreddit.userId, usersubreddit.subredditId)
}

for (const post of posts) {
  createPost.run(post.description, post.title, post.created, post.userId, post.subredditId)
}

for (const comment of comments) {
  createComment.run(comment.text, comment.userId, comment.postId)
}

for (const upvote of postUpvotes) {
  createUpvote.run(upvote.userId, upvote.postId)
}

for (const downvote of postDownvotes) {
  createDownvote.run(downvote.userId, downvote.postId)
}