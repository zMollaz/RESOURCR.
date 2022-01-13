const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // router.post("/", (req, res) => {
  //   let user_id = req.session.user_id

  //   const { newTitle, newUrl, newDescription, newImageUrl, newTopic } =
  //     postData;
  //   db.query(
  //     `INSERT INTO posts (title, description, url_src, img_src, user_id, topic_id)
  //       VALUES ($1, $2, $3, $4, $5, $6);`,
  //     [newTitle, newDescription, newUrl, newImageUrl, userID, newTopic]
  //   ).then((result) => {
  //     res.json({message: "Your post has been created !!"})
  //   });
  // });

  router.post("/:id", (req, res) => {
    let user_id = req.params.id;
    if (user_id === 1) {
      req.session.user_id = 1
    }

    if (user_id === 2) {
      req.session.user_id = 2
    }
  });

  //Get user data
  router.get("/modal", (req, res) => {
    db.query(
      `SELECT * FROM users
      WHERE users.id = $1;`, [req.session.user_id]
      //
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

  //first step create drop down menu
  //for each user create a button
  //each button will go to a post route
  //example: user 1 button "action" would be "/users/change/1"
  //example: user 2 button "action" would be "/users/change/2"
  //inside users.js there will be post route called "change/:id == router.get("change/:id", (req, res) => {"
  //inside the post route we will check for req.params.id
  //example: if req.params.id === 1 {req.session.user_id = 1}
  //example: if req.params.id === 2 {req.session.user_id = 2}


  return router;
}
