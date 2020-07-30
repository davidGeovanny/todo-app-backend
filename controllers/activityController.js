const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const Project = require('../models/ProjectModel');
const Activity = require('../models/ActivityModel');
const Note = require('../models/NoteModel');
const Message = require('../models/MessageModel');

const getActivities = async ( req, res = response ) => {

    const activities = await Activity.find();

    res.json( {
        ok: true,
        activities
    });
};

const getActivitiesByProject = async ( req, res = response ) => {

    const projectId = req.params.project;

    const activities = await getAllActivitiesByProject( projectId );
    let activitiesFilled = [];
    console.log(activities[0]);

    for (let index = 0; index < activities.length; index++) {
        const activity = activities[index];

        const notes = await Note.find({ activity: activity.id });
        let notesToJSON = [];

        const messages = await Message.find({ activity: activity.id }).populate('user', 'name');
        let messagesToJSON = [];

        for (let index = 0; index < notes.length; index++) {
            const note = notes[index];
            
            notesToJSON = [...notesToJSON, await note.toJSON()];
        }

        for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            
            messagesToJSON = [...messagesToJSON, await message.toJSON()];
        }

        const activityObject = {
            ...activity.toJSON(),
            notes: notesToJSON,
            messages: messagesToJSON,
        };

        activitiesFilled = [...activitiesFilled, activityObject];
    }


    res.json( {
        ok: true,
        activities: activitiesFilled,
    });
};

const getAllActivitiesByProject = async project => await Activity.find({ project });

const createActivity = async ( req, res = response ) => {

    try {
        const { project: projectId } = req.body;

        if( !ObjectId.isValid( projectId ) ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El proyecto al que pertenece la actividad no existe'
            });
        }

        const project = await Project.findById( projectId );

        if( !project ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El proyecto al que pertenece la actividad no existe'
            });
        }

        const activity = new Activity( req.body );

        activity.done = false;
        activity.created_at = new Date();
        activity.updated_at = new Date();

        const activitySaved = await activity.save();

        res.json( {
            ok: true,
            activity: activitySaved
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const updateActivity = async ( req, res = response ) => {

    const activityId = req.params.id;

    try {

        const activity = await Activity.findById( activityId );
        
        if( !activity ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad especificada no existe'
            });
        }

        const newActivity = {
            ...req.body,
            updated_at: new Date(),
        };

        const activityUpdated = await Activity.findByIdAndUpdate( activityId, newActivity, { new: true } );

        res.json( {
            ok: true,
            activity: activityUpdated,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const deleteActivity = async ( req, res = response ) => {

    const activityId = req.params.id;

    try {
        const activity = await Activity.findById( activityId );
    
        if( !activity ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad especificada no existe'
            });
        }

        const activityDeleted = await Activity.findByIdAndDelete( activityId );

        res.json( {
            ok: true,
            activity: activityDeleted
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }

};

module.exports = {
    getActivities,
    getActivitiesByProject,
    createActivity,
    updateActivity,
    deleteActivity,

    getAllActivitiesByProject,
};