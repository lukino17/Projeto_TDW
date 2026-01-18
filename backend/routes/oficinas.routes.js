const express = require('express');
const router = express.Router();

const Oficina = require('../models/Oficina');
const verificarToken = require('../middlewares/verificarToken');
const verificarRole = require('../middlewares/verificarRole');

// 🔒 CRIAR OFICINA — SÓ ADMIN
router.post(
    '/',
    verificarToken,
    verificarRole(['admin']),
    async (req, res) => {
        const { nome, localizacao, contacto } = req.body;

        const oficina = await Oficina.create({
            nome,
            localizacao,
            contacto
        });

        res.status(201).json(oficina);
    }
);

// 🔓 LISTAR OFICINAS — TODOS
router.get('/', async (req, res) => {
    const oficinas = await Oficina.find();
    res.json(oficinas);
});

module.exports = router;
