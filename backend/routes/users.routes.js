const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * ADMIN associa um staff a uma oficina
 */
// routes/users.routes.js
router.put(
    "/atribuir-oficina",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const { staffId, oficinaId } = req.body;

        const user = await User.findById(staffId);
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


// ADMIN - ver staff de uma oficina
    router.get(
        "/staff/oficina/:id",
        verificarToken,
        verificarRole(["admin"]),
        async (req, res) => {
            const staff = await User.find({
                role: "staff",
                oficina: req.params.id
            }).select("nome email");

            res.json(staff);
        }
    );


router.get(
    "/staffs/livres",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const staffs = await User.find({
            role: "staff",
            oficina: { $exists: false }
        }).select("nome email");

        res.json(staffs);
    }
);



module.exports = router;
