/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const router = express.Router();

const { getUserByUsername, createUser } = require("../db");

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    console.log("this is a console log")
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
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
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
      console.log(token, "this is a token")
    res.send({
      message: "thank you for signing up",
      token,
      user
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
