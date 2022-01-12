const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    let user_id = req.session.user_id

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
}
