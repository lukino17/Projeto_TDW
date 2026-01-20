const express = require("express");
const router = express.Router();

const Servico = require("../models/Servico");

// cliente vê serviços de uma oficina
router.get("/oficina/:id", async (req, res) => {
    const servicos = await Servico.find({ oficina: req.params.id });
    res.json(servicos);
});

module.exports = router;
