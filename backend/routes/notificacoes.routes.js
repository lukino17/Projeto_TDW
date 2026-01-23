const express = require("express");
const router = express.Router();

const Notificacao = require("../models/Notificacao");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * CLIENTE vê as suas notificações
 */
router.get(
    "/",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const notificacoes = await Notificacao.find({
                user: req.user.id
            }).sort({ criadaEm: -1 });

            res.json(notificacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

module.exports = router;
