const { response } = require('express');
const User = require('../models/UserModel');

const checkManager = async ( req, res = response, next ) => {

    const { uid } = req;

    try {
        const user = await User.findById( uid );

        if( user.role !== 'manager' ) {
            return res.status( 401 ).json( {
                ok: false,
                msg: 'No tiene los permisos necesarios para realizar esta acción'
            });
        }
    } catch (error) {
        return res.status(500).json( {
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
    
    next();
};

module.exports = {
    checkManager,
}