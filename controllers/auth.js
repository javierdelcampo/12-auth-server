const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../helpers/jws')


const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;
    const Usuario = require('../models/Usuario');
    

    try {
        
        // Verificar que no exite un correo igual
        const usuario = await Usuario.findOne({ email: email });

        if ( usuario ) {
            return res.status(400).json ({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            })

        }

        // Crear usuario con modelo
        const dbUser = new Usuario( req.body );
        
        // Cifrar la contraseña (hashear)
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt);

        // Generar el JWT
        const token = await generaJWT(dbUser.id, name, email);
        console.log(token);

        // Crear el usuario de DB
        await dbUser.save();

        // Generar respuesta de éxito
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            email: dbUser.email,
            name,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en crear usuario. Hable con el paparoma'
        });
    }



};

const loginUsuario = async (req, res = response ) => {

    const { email, password } = req.body;

    const Usuario = require('../models/Usuario');

    console.log('loginUsuario');

    try {

        const dbUser = await Usuario.findOne({ email: email });
                    
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no válidas. USER'
            })
        }

        // confirmar si PWD es igual
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no válidas. PWD'
            })
        }

        // Generar JWT
        const token = await generaJWT(dbUser.id, dbUser.name, dbUser.email);
        console.log(token);


        // Respuesta
        return res.json ( {
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error de login. Hable con sanpeo'
        })
        
    }



};

const renovarToken = async (req, res = response) => {

    const { uid, name, email } = req;

    const token = await generaJWT(uid, name, email);
    
    console.log('renovarToken');
    return res.json({
        ok: true,
        uid,
        name,
        email,
        token
    });

};


module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}