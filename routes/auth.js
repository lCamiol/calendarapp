/*
    Rutas de usuario / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarJwt } = require('../middlewares/validarJwt')

const { crearUsuario, loginUsuario, revalidarTokken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');



router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de tener minimo 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);

router.post('/',
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de tener minimo 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario);

router.get('/renew', validarJwt, revalidarTokken);

module.exports = router;