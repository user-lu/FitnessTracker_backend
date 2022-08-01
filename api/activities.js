const express = require('express');
const { getAllActivities, createActivity } = require('../db');
const { ActivityExistsError } = require('../errors');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/activities/:activityId/routines


// GET /api/activities
router.get("/", async(req, res, next) =>{
    const allActivities = await getAllActivities()
    console.log(allActivities, "THIS IS ALLACTIVITIES")
    try {
        res.send(allActivities)
    } catch (error) {
        next(error)
    }
})

// POST /api/activities
router.post("/", requireUser, async(req, res, next) =>{
    const {name, description} =req.body
    const activityData = {}

    try {
        activityData.name = name
        activityData.description = description
        const newActivity= await createActivity(activityData)
        if (newActivity) {
            res.send(newActivity)
        }else{
            next({
                name: "Activity error",
                message: ActivityExistsError(name),
                error:" Activity exists error"
            })
        }
        
    } catch (error) {
        next(error)
    }
})


// PATCH /api/activities/:activityId

module.exports = router;
