const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = (req, res = response, next) => {
    
    const token = req.header('x-token');
    console.log(token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Error de token'
        });
    }

    try {
        
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED );
        console.log(uid, name);
        req.uid  = uid;
        req.name = name;

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Error de login. Token no válido'
        })
    }


    next();
}

module.exports = {
    validarJWT
}