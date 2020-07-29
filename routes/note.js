const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { createNote, deleteNote, updateNote } = require('../controllers/noteController');

/** Agregar un middleware a todas las rutas que hay debajo */
router.use( jwtValidator );

router.post(
    '/', 
    [ 
        check('text', 'El nombre de la actividad es obligatoria').not().isEmpty(),
        check('activity', 'La actividad al que pertenece la nota es obligatoria').not().isEmpty(),
        fieldsValidator,
    ], 
    createNote
);

router.put(
    '/:id', 
    [ 
        check('done', 'El valor de la nota debe ser verdadero o falso').isBoolean(),
        fieldsValidator,
    ], 
    updateNote
);

router.delete(
    '/:id', 
    [ 
        fieldsValidator,
    ], 
    deleteNote
);

module.exports = router;