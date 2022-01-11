/*
 * All routes for posts are defined here
 * Since this file is loaded in server.js into /posts,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
    comments.* as comments
    FROM posts
    JOIN ratings ON posts.id = ratings.post_id
    JOIN likes ON posts.id = likes.post_id
    JOIN comments ON posts.id = comments.post_id
    GROUP BY posts.id,comments.id;`)
      .then(data => {
        const posts = data.rows;
        console.log(posts);
        res.json({ posts });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};









