const express = require("express");
const router = express.Router();

const Marcacao = require("../models/Marcacao");
const User = require("../models/User");
const Turno = require("../models/Turno");
const Notificacao = require("../models/Notificacao");

const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * CLIENTE cria marcação
 */
router.post(
    "/",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        try {
            const { veiculo, oficina, servico, turno } = req.body;

            if (!veiculo || !oficina || !servico || !turno) {
                return res.status(400).json({ erro: "Campos obrigatórios em falta" });
            }

            const turnoDB = await Turno.findById(turno);

            if (!turnoDB) {
                return res.status(404).json({ erro: "Turno não encontrado" });
            }

            // validar se o turno pertence à oficina
            if (String(turnoDB.oficina) !== String(oficina)) {
                return res.status(400).json({ erro: "Turno não pertence à oficina" });
            }

            if (turnoDB.vagasOcupadas >= turnoDB.vagasTotais) {
                return res.status(400).json({ erro: "Sem vagas neste turno" });
            }

            // criar marcação
            const marcacao = new Marcacao({
                cliente: req.user.id,
                veiculo,
                oficina,
                servico,
                turno
            });

            await marcacao.save();

            // ocupar vaga
            turnoDB.vagasOcupadas += 1;
            await turnoDB.save();

            res.status(201).json(marcacao);

        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);


/**
 * CLIENTE vê as suas marcações
 */
router.get(
    "/cliente",
    verificarToken,
    verificarRole(["cliente"]),
    async (req, res) => {
        const marcacoes = await Marcacao.find({ cliente: req.user.id })
            .populate("cliente", "nome email")
            .populate("veiculo")
            .populate("servico")
            .populate("turno")

        res.json(marcacoes);
    }
);

/**
 * STAFF vê marcações da sua oficina
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

            const marcacoes = await Marcacao.find({
                oficina: staff.oficina
            })
                .populate("cliente", "nome email")
                .populate("veiculo")
                .populate("servico")
                .populate("turno");

            res.json(marcacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

/**
 * STAFF atualiza estado da marcação
 */
router.put(
    "/:id/estado",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const { estado } = req.body;

            const estadosValidos = [
                "agendada",
                "em_progresso",
                "concluida",
                "cancelada"
            ];

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ erro: "Estado inválido" });
            }

            const staff = await User.findById(req.user.id);

            if (!staff.oficina) {
                return res.status(400).json({ erro: "Staff sem oficina associada" });
            }

            const marcacao = await Marcacao.findOne({
                _id: req.params.id,
                oficina: staff.oficina
            });

            if (!marcacao) {
                return res.status(404).json({ erro: "Marcação não encontrada" });
            }

            // se for cancelada, libertar vaga
            if (estado === "cancelada" && marcacao.estado !== "cancelada") {
                const turno = await Turno.findById(marcacao.turno);
                if (turno && turno.vagasOcupadas > 0) {
                    turno.vagasOcupadas -= 1;
                    await turno.save();
                }
            }

            marcacao.estado = estado;
            await marcacao.save();

            await Notificacao.create({
                user: marcacao.cliente,
                titulo: "Estado da marcação atualizado",
                mensagem: `A sua marcação foi ${estado.replace("_", " ")}.`
            });

            res.json(marcacao);

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);

/**
 * ADMIN vê todas as marcações
 */
router.get(
    "/admin",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const marcacoes = await Marcacao.find()
            .populate("cliente", "nome email")
            .populate("oficina", "nome")
            .populate("servico", "nome")
            .populate("veiculo")
            .populate("turno");

        res.json(marcacoes);
    }
);

module.exports = router;
