const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { checkManager } = require('../middlewares/checkManager');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

/** Agregar un middleware a todas las rutas que hay debajo */
router.use( jwtValidator );

router.get(
    '/',
    [

    ],
    getProjects
);

router.post(
    '/', 
    [ 
        check('title', 'El nombre del proyecto es obligatorio').not().isEmpty(),
        check('description', 'La descripción del proyecto es obligatoria').not().isEmpty(),
        check('area', 'El área al que pertenece el proyecto es obligatoria').not().isEmpty(),
        fieldsValidator,
        checkManager,
    ], 
    createProject
);

router.put(
    '/:id', 
    [ 
        check('title', 'El nombre del proyecto es obligatorio').not().isEmpty(),
        check('description', 'La descripción del proyecto es obligatoria').not().isEmpty(),
        check('area', 'El área al que pertenece el proyecto es obligatoria').not().isEmpty(),
        fieldsValidator,
        checkManager,
    ], 
    updateProject
);

router.delete(
    '/:id', 
    [ 
        fieldsValidator,
        checkManager,
    ], 
    deleteProject
);

module.exports = router;