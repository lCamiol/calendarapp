const { response } = require('express');
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya esta en uso'
            });
        }

        user = new User(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generar JWT
        const token = await generateJWT(user.id, user.name)


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hablar con el administrador'
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        //confirmar contraseñas

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(user.id, user.name)


        res.status(201).json({
            ok:true,
            uid: user.id,
            name:user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hablar con el administrador'
        })
    }

}
const revalidarTokken = async (req, res = response) => {

    const {uid, name} = req;

    const token = await generateJWT(uid, name)

    res.json({
        ok: true,
        uid, name,
        token
    })

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarTokken
}