const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
    try {
      const {
        rows: [activities],
      } = await client.query(
        `
        INSERT INTO activities(name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING name, description
        `,
        [name, description]
      );
      console.log(activities, "<-- id, name and description");
      return activities;
    } catch (error) {
      console.error(error);
    }
  
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`
      SELECT *
      FROM activities
    `, []);
    console.log("this is all activities", activities)
    return activities;
  } catch (error) {
    console.error(error);
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activities] } = await client.query(`
      SELECT *
      FROM activities
      WHERE id=$1;
    `, [id]);
    console.log(activities)
    return activities;
  } catch (error) {
    console.error(error);
  }
}

async function getActivityByName(name) { }

async function attachActivitiesToRoutines(routines) { }

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
