const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { validarJWT } = require('../helpers/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

// Crear usuario
router.post( '/new',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria o de tamaño mínimo de 6').isLength({ min: 6 }),
    check('name', 'El nombre de usuario es obligatorio o de tamaño mínimo de 6').not().isEmpty(),
    validarCampos
] , crearUsuario);

// Login usuario
router.post( '/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria o de tamaño mínimo de 6').isLength({ min: 6 }),
    validarCampos
] , loginUsuario);

// Token Validation and revalidation
router.get( '/renew', validarJWT, renovarToken);


module.exports = router;