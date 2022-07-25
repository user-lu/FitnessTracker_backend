const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  console.log(hashedPassword);

  try {
    const { rows: [user] } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username
      `,
      [username, hashedPassword]
    );
    console.log(user, "Hello");
    return user;
  } catch (error) {
    console.error(error);
  }

}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
  // isValid will be a boolean based on wether the password matches the hashed password
  const isValid = await bcrypt.compare(password, hashedPassword)
  console.log(isValid);

}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, active
      FROM users
      WHERE id=${userId}
    `);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
  }

}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT username
      FROM users
      WHERE username=$1;
    `, [userName]);

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
