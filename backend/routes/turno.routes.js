const express = require("express");
const router = express.Router();

const Turno = require("../models/Turno");
const User = require("../models/User");
const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");



router.get(
    "/",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const turnos = await Turno.find().populate("oficina");
        res.json(turnos);
    }
);

/**
 * STAFF cria turno para a sua oficina
 */
router.post(
    "/",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const { oficina, data, horaInicio, horaFim, vagasTotais } = req.body;

            if (!oficina || !data || !horaInicio || !horaFim || !vagasTotais) {
                return res.status(400).json({ erro: "Campos obrigatórios em falta" });
            }

            const turno = new Turno({
                oficina,
                data,
                horaInicio,
                horaFim,
                vagasTotais,
                vagasOcupadas: 0
            });

            await turno.save();

            res.status(201).json(turno);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


/**
 * STAFF vê turnos da sua oficina
 */
router.get(
    "/oficina",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const staff = await User.findById(req.user.id);

            if (!staff || !staff.oficina) {
                return res.status(400).json({ erro: "Staff sem oficina associada" });
            }

            const turnos = await Turno.find({
                oficina: staff.oficina
            }).sort({ data: 1, horaInicio: 1 });

            res.json(turnos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

/**
 * CLIENTE vê turnos disponíveis de uma oficina
 */
// CLIENTE vê turnos disponíveis
router.get(
    "/disponiveis/:oficinaId",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const { oficinaId } = req.params;

            const turnos = await Turno.find({
                oficina: oficinaId,
                $expr: { $lt: ["$vagasOcupadas", "$vagasTotais"] }
            }).sort({ data: 1, horaInicio: 1 });

            res.json(turnos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);



module.exports = router;
