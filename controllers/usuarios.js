const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
    
    const {nombre = 'No name',apellido, page=1, limit=10} = req.query;
    
    res.json({
        "msg":"get API - Controlador",
        nombre,
        apellido,
        page, 
        limit
    });
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        "msg":"post API - Controlador",
        nombre, edad
    });
}

const usuariosPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        "msg":"put API - Controlador",
        id
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        "msg":"delete API - Controlador"
    });
}

module.exports = {
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete
}