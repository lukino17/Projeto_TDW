const express = require("express");
const router = express.Router();

const Marcacao = require("../models/Marcacao");
const User = require("../models/User");
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
            const marcacao = await Marcacao.create({
                ...req.body,
                cliente: req.user.id
            });

            res.status(201).json(marcacao);
        } catch (error) {
            res.status(400).json({ erro: error.message });
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
            .populate("oficina servico veiculo");

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
                .populate("servico");

            res.json(marcacoes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


// STAFF vê marcações da sua oficina
router.get(
    "/staff",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        try {
            const staff = await User.findById(req.user.id);

            if (!staff.oficina) {
                return res.status(400).json({ erro: "Staff sem oficina associada" });
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

// STAFF atualiza estado da marcação
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

            marcacao.estado = estado;
            await marcacao.save();

            res.json(marcacao);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
);


/**
 * STAFF confirma marcação
 */
router.put(
    "/:id/confirmar",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        const staff = await User.findById(req.user.id);

        const marcacao = await Marcacao.findById(req.params.id);

        if (!marcacao) {
            return res.status(404).json({ erro: "Marcação não encontrada" });
        }

        if (String(marcacao.oficina) !== String(staff.oficina)) {
            return res.status(403).json({ erro: "Sem permissão" });
        }

        marcacao.estado = "confirmada";
        await marcacao.save();

        res.json(marcacao);
    }
);

/**
 * STAFF conclui marcação
 */
router.put(
    "/:id/concluir",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        const staff = await User.findById(req.user.id);
        const marcacao = await Marcacao.findById(req.params.id);

        if (!marcacao) {
            return res.status(404).json({ erro: "Marcação não encontrada" });
        }

        if (String(marcacao.oficina) !== String(staff.oficina)) {
            return res.status(403).json({ erro: "Sem permissão" });
        }

        marcacao.estado = "concluida";
        await marcacao.save();

        res.json(marcacao);
    }
);

/**
 * STAFF cancela marcação
 */
router.put(
    "/:id/cancelar",
    verificarToken,
    verificarRole(["staff"]),
    async (req, res) => {
        const staff = await User.findById(req.user.id);
        const marcacao = await Marcacao.findById(req.params.id);

        if (!marcacao) {
            return res.status(404).json({ erro: "Marcação não encontrada" });
        }

        if (String(marcacao.oficina) !== String(staff.oficina)) {
            return res.status(403).json({ erro: "Sem permissão" });
        }

        marcacao.estado = "cancelada";
        await marcacao.save();

        res.json(marcacao);
    }
);


// ADMIN - todas as marcações
router.get(
    "/admin",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        const marcacoes = await Marcacao.find()
            .populate("cliente", "nome email")
            .populate("oficina", "nome")
            .populate("servico", "nome")
            .populate("veiculo");

        res.json(marcacoes);
    }
);


module.exports = router;
