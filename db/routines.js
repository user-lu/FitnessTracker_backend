const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `,
      [creatorId, isPublic, name, goal]
    );
    return routine;

  } catch (error) {
    console.error(error, "this is createRoutine");
  }

}

async function getRoutineById(id) { }

async function getRoutinesWithoutActivities() { }

async function getAllRoutines() { 
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id;
    `);

    return attachActivitiesToRoutines(rows)

  } catch (error) {
    console.error(error)
  }

}

async function getAllPublicRoutines() { 
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic"=true;
    `);

    return attachActivitiesToRoutines(rows)

  } catch (error) {
    console.error(error)
  }

}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
    `);

    return attachActivitiesToRoutines(rows)

  } catch (error) {
    console.error(error)
  }

 }

async function getPublicRoutinesByUser({ username }) { 
  try {
    const { rows: routine } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username=$1;
    `, [username]);

    return attachActivitiesToRoutines(routine)

  } catch (error) {
    console.error(error)
  }

}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = true;
    `);

    return attachActivitiesToRoutines(rows)

  } catch (error) {
    console.error(error)
  }

 }

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
