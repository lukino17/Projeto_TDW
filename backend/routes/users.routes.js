const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * ADMIN associa um staff a uma oficina
 */
router.put(
    "/:id/atribuir-oficina",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const { oficinaId } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ erro: "Utilizador não encontrado" });
        }

        if (user.role !== "staff") {
            return res.status(400).json({ erro: "Utilizador não é staff" });
        }

        user.oficina = oficinaId;
        await user.save();

        res.json({ mensagem: "Staff associado à oficina com sucesso" });
    }
);

module.exports = router;
