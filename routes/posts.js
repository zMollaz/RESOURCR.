/*
 * All routes for posts are defined here
 * Since this file is loaded in server.js into /posts,
 *   these routes are mounted onto /posts
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
      `SELECT posts.*, (SELECT avg(rating) FROM ratings
      WHERE post_id = posts.id) as average_rating, (SELECT count(*) FROM likes
      WHERE post_id = posts.id) as total_likes
        FROM posts
        GROUP BY posts.id;`
    )
      .then((data) => {
        console.log(data);
        const posts = data.rows;
        console.log(posts);
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(
      `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
      comments.* as comments
      FROM posts
      LEFT OUTER JOIN ratings ON posts.id = ratings.post_id
      LEFT OUTER JOIN likes ON posts.id = likes.post_id
      LEFT OUTER JOIN comments ON posts.id = comments.post_id
      WHERE posts.id = $1
      GROUP BY posts.id,comments.id;`,
      [req.params.id]
    )
      .then((data) => {
        console.log(data);
        const post = data.rows[0];
        console.log(post);
        res.json({ post });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Search function
  router.post("/search/", (req, res) => {
    let topic = req.body.topic.toLowerCase();
    topic = capitalizeFirstLetter(topic);
    db.query(`SELECT * FROM topics WHERE topic = $1;`, [topic]).then(
      (result) => {
        const topicObj = result.rows[0];

        db.query(
          `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
        comments.comment
        FROM posts
        LEFT OUTER JOIN ratings ON posts.id = ratings.post_id
        LEFT OUTER JOIN likes ON posts.id = likes.post_id
        LEFT OUTER JOIN comments ON posts.id = comments.post_id
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
  router.post("/", (req, res) => {
    let postData = req.body;
    let userId = req.session.user_id;
    const { newTitle, newUrl, newDescription, newImageUrl, newTopic } =
      postData;

    db.query(
      `INSERT INTO posts (title, description, url_src, img_src, user_id, topic_id)
        VALUES ($1, $2, $3, $4, $5, $6);`,
      [newTitle, newDescription, newUrl, newImageUrl, userId, newTopic]
    )
      .then((result) => {
        res.json({ message: "Your post has been created !!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Adding a comment
  router.post("/comment/:id", (req, res) => {
    const { id, post } = req.body;
    let userId = req.session.user_id;
    console.log(id);
    db.query(
      `INSERT INTO comments
      (user_id, post_id, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [userId, id, post]
    )
      .then((data) => {
        const posts = data.rows;
        console.log(id, post);
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Adding a like

  router.post("/:id/like", (req, res) => {
    let userId = req.session.user_id;
    db.query(
      `INSERT INTO likes
      (user_id, post_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [userId, req.params.id]
    )
      .then((data) => {
        const posts = data.rows;
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Adding rating
  router.post("/:id/rating", (req, res) => {
    const { rating } = req.body;
    let userId = req.session.user_id;
    console.log(userId, req.params.id, rating);
    db.query(
      `INSERT INTO ratings
      (user_id, post_id, rating)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [userId, req.params.id, rating]
    )
      .then((data) => {
        const posts = data.rows;
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
