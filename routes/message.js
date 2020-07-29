const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { createMessage, deleteMessage } = require('../controllers/messageController');

/** Agregar un middleware a todas las rutas que hay debajo */
router.use( jwtValidator );

router.post(
    '/', 
    [ 
        check('text', 'El contenido del mensaje es obligatorio').not().isEmpty(),
        check('activity', 'La actividad al que pertenece la nota es obligatoria').not().isEmpty(),
        fieldsValidator,
    ], 
    createMessage
);

router.delete(
    '/:id', 
    [ 
        fieldsValidator,
    ], 
    deleteMessage
);

module.exports = router;