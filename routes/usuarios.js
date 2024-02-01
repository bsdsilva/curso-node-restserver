const { Router } = require('express');
const { usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete} = require('../controllers/usuarios');
const { check } = require('express-validator');

/*const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');*/
const { 
    validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRol
} = require('../middlewares');

const { esRoleValido, 
    emailExist,
    existeUsuarioPorId } = require('../helpers/db-validators');



const router = Router();

router.get('/', usuariosGet );

router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser más de 6 letras').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(emailExist),
    //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
] , usuariosPost );

router.put('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut );

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;