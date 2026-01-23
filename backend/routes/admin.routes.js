const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Marcacao = require("../models/Marcacao");
const Servico = require("../models/Servico");

const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * RESUMO DO DASHBOARD (cards)
 */
router.get(
    "/resumo",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const clientes = await User.countDocuments({ role: "cliente" });
            const staff = await User.countDocuments({ role: "staff" });
            const servicos = await Servico.countDocuments();

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const marcacoesHoje = await Marcacao.countDocuments({
                data: { $gte: hoje }
            });

            res.json({
                clientes,
                staff,
                servicos,
                marcacoesHoje
            });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

/**
 * MARCAÇÕES RECENTES
 */
router.get(
    "/marcacoes-recentes",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const marcacoes = await Marcacao.find()
                .populate("cliente", "nome")
                .populate("oficina", "nome")
                .sort({ createdAt: -1 })
                .limit(5);

            res.json(marcacoes);
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

module.exports = router;
