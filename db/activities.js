const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: [activities] } = await client.query(`
      SELECT id
      FROM activities
      WHERE id=$1;
    `, []);

    return activities;
  } catch (error) {
    console.error(error);
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activities] } = await client.query(`
      SELECT id
      FROM activities
      WHERE id=$1;
    `, [id]);

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
