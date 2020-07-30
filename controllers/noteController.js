const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const Project = require('../models/ProjectModel');
const Activity = require('../models/ActivityModel');
const Note = require('../models/NoteModel');
const { getAllActivitiesByProject } = require('./activityController');
const { isActivityDone, isProjectDone } = require('../helpers/checkDone');

const createNote = async ( req, res = response ) => {

    try {
        const { activity: activityId } = req.body;

        if( !ObjectId.isValid( activityId ) ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad al que pertenece la nota no existe'
            });
        }

        const activity = await Activity.findById( activityId );

        if( !activity ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad al que pertenece la nota no existe'
            });
        }

        const note = new Note( req.body );

        note.done = false;
        note.created_at = new Date();
        note.updated_at = new Date();

        const noteSaved = await note.save();
        
        if( activity.done ) {
            const newActivity = {
                done: false,
                updated_at: new Date(),
            };
    
            const activityUpdated = await Activity.findByIdAndUpdate( noteSaved.activity, newActivity );

            const project = await Project.findById( activityUpdated.project );

            if( project.done ) {
                const newProject = {
                    done: false,
                    updated_at: new Date(),
                };
    
                await Project.findByIdAndUpdate( activityUpdated.project, newProject );
            }
        }

        res.json( {
            ok: true,
            note: noteSaved,
            activityDone: false,
            projectDone: false,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const updateNote = async ( req, res = response ) => {

    const noteId = req.params.id;

    try {
        const note = await Note.findById( noteId );
    
        if( !note ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La nota especificada no existe'
            });
        }

        const { done } = req.body;

        const newNote = {
            done,
            updated_at: new Date(),
        };

        const noteUpdated = await Note.findByIdAndUpdate( noteId, newNote, { new: true } );

        let activityDone = false;
        let projectDone = false;

        if( done ) {
            const notes = await getNotesByActivity( note.activity );
    
            if( isActivityDone( notes ) ) {
                activityDone = true;
    
                const newActivity = {
                    done: true,
                    updated_at: new Date(),
                };
        
                const activityUpdated = await Activity.findByIdAndUpdate( note.activity, newActivity );
    
                const activities = await getAllActivitiesByProject( activityUpdated.project );
    
                if( isProjectDone( activities ) ) {
                    projectDone = true;
    
                    const newProject = {
                        done: true,
                        updated_at: new Date(),
                    };
    
                    await Project.findByIdAndUpdate( activityUpdated.project, newProject );
                }
            }
        } else {
            const noDone = {
                done: false,
                updated_at: new Date(),
            };

            const activityUpdated = await Activity.findByIdAndUpdate( note.activity, noDone );

            await Project.findByIdAndUpdate( activityUpdated.project, noDone );
        }

        res.json( {
            ok: true,
            note: noteUpdated,
            activityDone,
            projectDone,
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const deleteNote = async ( req, res = response ) => {

    const noteId = req.params.id;

    try {
        const note = await Note.findById( noteId );
    
        if( !note ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La nota especificada no existe'
            });
        }

        const noteDeleted = await Note.findByIdAndDelete( noteId );

        res.json( {
            ok: true,
            note: noteDeleted
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const getNotesByActivity = async ( activity ) => await Note.find( { activity } );

module.exports = {
    createNote,
    updateNote,
    deleteNote,

    getNotesByActivity,
};