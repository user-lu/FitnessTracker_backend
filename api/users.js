/* eslint-disable no-useless-catch */
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;
const router = express.Router();

const { requireUser } = require("./utils");
const {
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");

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
      res.send({ user, message: "you're logged in!", token: token });
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
});

// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    throw error;
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;

  try {
    
    const user = await getUserByUsername(username);
    if (!user) {
      next({
        name: "NoUserFound",
        message: "User does not exist",
      });
    }
    if (req.user && user.id === req.user.id) {
      const getUserRoutines = await getAllRoutinesByUser({ username });
      res.send(getUserRoutines);
    }
      const publicRoutines = await getPublicRoutinesByUser({ username });
      res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
