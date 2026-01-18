const express = require("express");
const router = express.Router();

const Marcacao = require("../models/Marcacao");
const User = require("../models/User");

const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");


// ===============================
// CLIENTE cria marcação
// ===============================
router.post(
    "/",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const marcacao = await Marcacao.create({
                ...req.body,
                cliente: req.user.id
            });

            res.status(201).json(marcacao);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


// ===============================
// CLIENTE vê as suas marcações
// ===============================
router.get(
    "/cliente",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const marcacoes = await Marcacao.find({
                cliente: req.user.id
            }).populate("oficina servico veiculo");

            res.json(marcacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


// ===============================
// STAFF vê marcações da sua oficina
// ===============================
router.get(
    "/oficina",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const staff = await User.findById(req.user.id);

            if (!staff.oficina) {
                return res
                    .status(400)
                    .json({ erro: "Staff sem oficina associada" });
            }

            const marcacoes = await Marcacao.find({
                oficina: staff.oficina
            })
                .populate("cliente", "nome email")
                .populate("veiculo")
                .populate("servico");

            res.json(marcacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


// ===============================
// ADMIN (ou STAFF) vê marcações de uma oficina específica
// ===============================
router.get(
    "/oficina/:id",
    verificarToken,
    verificarRole(["admin", "staff"]),
    async (req, res) => {
        try {
            const marcacoes = await Marcacao.find({
                oficina: req.params.id
            }).populate("cliente veiculo servico");

            res.json(marcacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

module.exports = router;
