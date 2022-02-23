CREATE TABLE "users" (
  "id" integer,
  "username" text,
  "email" text,
  "password" text
);

CREATE TABLE "posts" (
  "id" integer,
  "description" text,
  "title" text,
  "created" text,
  "userId" integer,
  "vote" integer
);

CREATE TABLE "comments" (
  "id" integer,
  "text" text,
  "postId" integer,
  "userId" integer
);

CREATE TABLE "subreddits" (
  "id" integer,
  "name" text
);

CREATE TABLE "usersubreddits" (
  "id" integer,
  "userId" integer,
  "subredditId" integer
);

ALTER TABLE "comments" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("postId") REFERENCES "posts" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "usersubreddits" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "usersubreddits" ADD FOREIGN KEY ("subredditId") REFERENCES "subreddits" ("id");
