const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('../models/ActivityModel');
const Message = require('../models/MessageModel');

const createMessage = async ( req, res = response ) => {

    try {
        const { activity: activityId } = req.body;

        if( !ObjectId.isValid( activityId ) ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad al que pertenece el mensaje no existe'
            });
        }

        const activity = await Activity.findById( activityId );

        if( !activity ) {
            return res.status(404).json( {
                ok: false,
                msg: 'La actividad al que pertenece el mensaje no existe'
            });
        }

        const message = new Message( req.body );

        message.user = req.uid;
        message.created_at = new Date();
        message.updated_at = new Date();

        const messageSaved = await message.save();

        res.json( {
            ok: true,
            message: messageSaved
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error',
        });
    }
};

const deleteMessage = async ( req, res = response ) => {

    const messageId = req.params.id;

    try {
        const message = await Message.findById( messageId );
    
        if( !message ) {
            return res.status(404).json( {
                ok: false,
                msg: 'El mensaje especificada no existe'
            });
        }

        const messageDeleted = await Message.findByIdAndDelete( messageId );

        res.json( {
            ok: true,
            message: messageDeleted
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
    createMessage,
    deleteMessage,
};