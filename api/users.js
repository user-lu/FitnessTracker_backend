/* eslint-disable no-useless-catch */
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;
const router = express.Router();

const { getUserByUsername, createUser } = require("../db");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getUserByUsername(username);

    if (_user) {
      res.status(401);
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "PasswordTooShort",
        message: "Password Too Short!",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      if (!user) {
        req.status(400);
        next({
          name: "UserCreationError",
          message: "Bad Request",
        });
      } else {
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
      }
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const matchingPasswords = await bcrypt.compare(password, hashedPassword);
    if (matchingPasswords) {
      const token = jwt.sign(user, JWT_SECRET);
      res.send({ user, message: "you're logged in!", token: `${token}` });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  return;
});

// GET /api/users/me
router.get('/me', async(req, res, next) =>{
  try {
    res.send(res.user)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

// GET /api/users/:username/routines

module.exports = router;
