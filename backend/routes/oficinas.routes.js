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
/**
 * ADMIN associa um staff a uma oficina
 */
router.put(
    "/:oficinaId/associar-staff/:staffId",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const { oficinaId, staffId } = req.params;

            const oficina = await Oficina.findById(oficinaId);
            if (!oficina) {
                return res.status(404).json({ erro: "Oficina não encontrada" });
            }

            const staff = await User.findById(staffId);
            if (!staff || staff.role !== "staff") {
                return res.status(400).json({ erro: "Utilizador não é staff" });
            }

            staff.oficina = oficinaId;
            await staff.save();

            res.json({
                mensagem: "Staff associado à oficina com sucesso",
                staff
            });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


// 🔓 LISTAR OFICINAS — TODOS
router.get('/', async (req, res) => {
    const oficinas = await Oficina.find();
    res.json(oficinas);
});

module.exports = router;
