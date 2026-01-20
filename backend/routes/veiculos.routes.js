const express = require("express");
const router = express.Router();

const Veiculo = require("../models/Veiculo");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

// CLIENTE cria veículo
router.post(
    "/",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const { marca, modelo, matricula, ano } = req.body;

            const veiculo = await Veiculo.create({
                marca,
                modelo,
                matricula,
                ano,
                cliente: req.user.id // ⚠️ IMPORTANTE
            });

            res.status(201).json(veiculo);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

// CLIENTE vê os seus veículos
router.get(
    "/",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        const veiculos = await Veiculo.find({ cliente: req.user.id });
        res.json(veiculos);
    }
);

module.exports = router;
