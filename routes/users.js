const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //Update user data
  router.post("/", (req, res) => {
    let updatedUser = req.body;
    let userId = req.session.user_id;
    const { newName, newEmail, newPassword } = updatedUser;
    db.query(
      `UPDATE users
      SET name = $1, email = $2, password = $3
      WHERE id = $4;`,
      [newName, newEmail, newPassword, userId]
    )
      .then((result) => {
        res.json({ message: "Your profile info has been updated !!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Switch user
  router.post("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    res.json({ message: "updated the user" });
  });

  //Get user created posts
  router.get("/:id/posts", (req, res) => {
    db.query(
      `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
        comments.comment
        FROM posts
        FULL JOIN ratings ON posts.id = ratings.post_id
        FULL JOIN likes ON posts.id = likes.post_id
        FULL JOIN comments ON posts.id = comments.post_id
        FULL JOIN users ON users.id = posts.user_id
        WHERE posts.user_id = $1
        GROUP BY posts.id,comments.id;`,
      [req.session.user_id]
    )
      .then((data) => {
        console.log(data);
        const posts = data.rows;
        console.log(posts);
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get user liked posts
  router.get("/:id/likes", (req, res) => {
    db.query(
      `SELECT posts.*, avg(rating) as average_rating, count(likes.*) as total_likes,
      comments.comment
      FROM posts
      FULL JOIN ratings ON posts.id = ratings.post_id
      FULL JOIN likes ON posts.id = likes.post_id
      FULL JOIN comments ON posts.id = comments.post_id
      FULL JOIN users ON users.id = posts.user_id
      WHERE likes.user_id = $1
      GROUP BY posts.id,comments.id;`,
      [req.session.user_id]
    )
      .then((data) => {
        console.log(data);
        const posts = data.rows;
        console.log(posts);
        res.json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get user data
  router.get("/", (req, res) => {
    db.query(
      `SELECT * FROM users
      WHERE users.id = $1;`,
      [req.session.user_id]
    )
      .then((data) => {
        console.log(data);
        const user = data.rows[0];
        console.log(user);
        res.json({ user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
