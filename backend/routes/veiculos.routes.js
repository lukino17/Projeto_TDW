const express = require("express");
const router = express.Router();
const Veiculo = require("../models/Veiculo");
const auth = require("../middlewares/auth");
const verificarRole = require("../middlewares/verificarRole");

router.post(
    "/",
    auth,
    verificarRole(["cliente"]),
    async (req, res) => {
        const veiculo = await Veiculo.create({
            ...req.body,
            cliente: req.user._id
        });

        res.status(201).json(veiculo);
    }
);

module.exports = router;
