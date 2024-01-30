const express = require('express');
var cors = require('cors');

const {dbConection}  = require('../database/config')

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y Parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){

        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto ", this.port);
        });
    }
}

module.exports = Server;