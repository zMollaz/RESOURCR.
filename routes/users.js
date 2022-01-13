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
      SET name = "$1", email = "$2"; password = "$3"
      WHERE id = $4;`,
      [newName, newEmail, newPassword, userId]
    )
      .then((result) => {
        res.json({ message: "Your profile info has been updated !!" })
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

  //Get user data
  router.get("/", (req, res) => {
    db.query(
      `SELECT * FROM users
      WHERE users.id = $1;`, [req.session.user_id]
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
}
