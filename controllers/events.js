
const { response } = require('express');
const Evento = require('../models/eventoModel');

const getEvento = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });
}
const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body)

    try {
        evento.user = req.uid
        const eventoGuerdado = await evento.save();

        res.status(201).json({
            ok: true,
            msg: 'Evento ha sido guardado',
            evento: eventoGuerdado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error, hablar con el administrado...'
        })
    }
}
const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
             return res.status(404).json({
                ok: false,
                msg: 'Evento no existente con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para editar este evento'

            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, hablar con el administrador...'
        });
    }
}

const eliminarEvento = async (req, res = response) => { 
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existente con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para eliminar este evento'

            })
        }

        await Evento.findByIdAndDelete(eventoId)

        res.json({
            ok: true,
            msg: 'El evento ha sido eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, hablar con el administrador...'
        });
    }
}


module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento

}