const { response } = require('express');
const Project = require('../models/ProjectModel');

const getProjects = async ( req, res = response ) => {

    const projects = await Project.find();

    res.json( {
        ok: true,
        projects,
    });
};

const createProject = async ( req, res = response ) => {

    const project = new Project( req.body );

    try {
        project.done = false;
        project.created_at = new Date();
        project.updated_at = new Date();

        const projectSaved = await project.save();

        res.json( {
            ok: true,
            event: projectSaved
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const updateProject = async ( req, res = response ) => {

    const projectId = req.params.id;

    try {

        const project = await Project.findById( projectId );
        
        if( !project ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El proyecto especificado no existe'
            });
        }

        const newProject = {
            ...req.body,
            updated_at: new Date(),
        };

        const projectUpdated = await Project.findByIdAndUpdate( projectId, newProject, { new: true } );

        res.json( {
            ok: true,
            project: projectUpdated,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const deleteProject = async ( req, res = response ) => {

    const projectId = req.params.id;

    try {
        const project = await Project.findById( projectId );
    
        if( !project ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El proyecto especificado no existe'
            });
        }

        const projectDeleted = await Project.findByIdAndDelete( projectId );

        res.json( {
            ok: true,
            project: projectDeleted
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
    getProjects,
    createProject,
    updateProject,
    deleteProject,
};