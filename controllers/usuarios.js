const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    
   // const {nombre = 'No name',apellido, page=1, limit=10} = req.query;
   /*res.json({
        nombre,
        apellido,
        page, 
        limit
    });*/

   const {limite = 5, desde = 0 } = req.query;
   const query = {estado:true}
   /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query);
    */

    //De esta forma la ejecución es más rápida porque se ejecutan las dos promesas de forma simultanea
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    /*//Verificar si el correo existe //Se comento aqui pq se optimizo colocandolo como una validacion personalizada y llamandolo desde el routes
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        });
    }*/

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password, salt);

    //Guardar la BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, ...resto } = req.body;

    if(password){
         //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    //const usuarioAutenticado = req.usuario;

    res.json({
        usuario /*, usuarioAutenticado*/
    });
}

module.exports = {
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete
}