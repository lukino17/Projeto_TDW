const express = require("express");
const router = express.Router();

const Servico = require("../models/Servico");
const Oficina = require("../models/Oficina");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");
const User = require("../models/User");

/**
 * STAFF cria serviço para a sua oficina
 */
router.post(
    "/",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const { nome, preco, duracao, descricaoPublica, descricaoPrivada } = req.body;

            const staff = await User.findById(req.user.id);

            if (!staff.oficina) {
                return res.status(400).json({ erro: "Staff sem oficina associada" });
            }

            const servico = await Servico.create({
                nome,
                preco,
                duracao,
                descricaoPublica,
                descricaoPrivada,
                oficina: staff.oficina
            });

            res.status(201).json(servico);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

/**
 * STAFF vê serviços da sua oficina
 */
router.get(
    "/",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const staff = await User.findById(req.user.id);

            if (!staff.oficina) {
                return res.status(400).json({ erro: "Staff sem oficina associada" });
            }

            const servicos = await Servico.find({ oficina: staff.oficina });
            res.json(servicos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

module.exports = router;
