const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { getActivities, createActivity, updateActivity, deleteActivity, getActivitiesByProject } = require('../controllers/activityController');

/** Agregar un middleware a todas las rutas que hay debajo */
router.use( jwtValidator );

router.get(
    '/',
    [

    ],
    getActivities
);

router.get(
    '/:project',
    [

    ],
    getActivitiesByProject
);

router.post(
    '/', 
    [ 
        check('title', 'El nombre de la actividad es obligatoria').not().isEmpty(),
        check('description', 'La descripción de la actividad es obligatoria').not().isEmpty(),
        check('project', 'El proyecto al que pertenece la actividad es obligatoria').not().isEmpty(),
        fieldsValidator,
    ], 
    createActivity
);

router.put(
    '/:id', 
    [ 
        check('title', 'El nombre de la actividad es obligatoria').not().isEmpty(),
        check('description', 'La descripción de la actividad es obligatoria').not().isEmpty(),
        fieldsValidator,
    ], 
    updateActivity
);

router.delete(
    '/:id', 
    [ 
        fieldsValidator,
    ], 
    deleteActivity
);

module.exports = router;