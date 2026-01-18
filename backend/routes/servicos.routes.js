const express = require("express");
const router = express.Router();

const Servico = require("../models/Servico");
const auth = require("../middlewares/auth");
const verificarRole = require("../middlewares/verificarRole");

router.post(
    "/:oficinaId",
    auth,
    verificarRole(["admin", "staff"]),
    async (req, res) => {
        const { oficinaId } = req.params;

        const servico = await Servico.create({
            ...req.body,
            oficina: oficinaId
        });

        res.status(201).json(servico);
    }
);

router.get("/:oficinaId", async (req, res) => {
    const servicos = await Servico.find({ oficina: req.params.oficinaId });
    res.json(servicos);
});

module.exports = router;
