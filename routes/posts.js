/*
 * All routes for posts are defined here
 * Since this file is loaded in server.js into /posts,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

//now able to use search function with lowercase
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(
      `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
    comments.* as comments
    FROM posts
    JOIN ratings ON posts.id = ratings.post_id
    JOIN likes ON posts.id = likes.post_id
    JOIN comments ON posts.id = comments.post_id
    GROUP BY posts.id,comments.id;`
    )
      .then((data) => {
        const posts = data.rows;
        console.log(posts);
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //search function

  router.post("/search/", (req, res) => {
    let topic = req.body.topic.toLowerCase();
    topic = capitalizeFirstLetter(topic);
    db.query(`SELECT * FROM topics WHERE topic = $1;`, [topic]).then(
      (result) => {
        const topicObj = result.rows[0];

        db.query(
          `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
        comments.* as comments
        FROM posts
        JOIN ratings ON posts.id = ratings.post_id
        JOIN likes ON posts.id = likes.post_id
        JOIN comments ON posts.id = comments.post_id
        WHERE posts.topic_id = $1
        GROUP BY posts.id,comments.id;`,
          [topicObj.id]
        )
          .then((data) => {
            const posts = data.rows;
            res.json({ posts });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      }
    );
  });

  //Add post function
  router.post("/:id/", (req, res) => {
    let postData = req.body;
    // let userID = req.session.user_id;  use after creating login route
    let userID = 1;
    const { newTitle, newUrl, newDescription, newImageUrl, newTopic } =
      postData;
    db.query(
      `INSERT INTO posts (title, description, url_src, img_src, user_id, topic_id)
        VALUES ($1, $2, $3, $4, $5, $6);`,
      [newTitle, newDescription, newUrl, newImageUrl, userID, newTopic]
    ).then((result) => {
      res.json({message: "Your post has been created !!"})
    });
  });

  return router;
};

