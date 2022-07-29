/* eslint-disable no-useless-catch */
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env

const { getUserByUsername, createUser } = require("../db");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    console.log("this is a console log")
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
        res.status
      next({
        name: "UserExistsError",
        message: "A user by that username already exists.",
      });
    }

    const user = await createUser({
      username,
      password,
    });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
        user,
      message: "thank you for signing up",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
