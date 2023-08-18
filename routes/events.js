/*  
    Events Route
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJwt } = require('../middlewares/validarJwt')
const { validarCampos } = require('../middlewares/validarCampos');
const { isDate } = require('../helpers/isDate');


// todas tienen que pasar por la validación del token
//Obtener eventos
router.use(validarJwt);

router.get('/', getEvento)

//crear eventos
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Se debe tener una fecha de inicio').custom(isDate),
        check('end', 'Se debe tener una fecha finalización').custom(isDate),
        validarCampos
    ],
     crearEvento)

//Actualizar eventos
router.put('/:id', actualizarEvento)

//Borrar Evento
router.delete('/:id', eliminarEvento)

module.exports = router;