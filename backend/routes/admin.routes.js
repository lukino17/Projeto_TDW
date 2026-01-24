const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Marcacao = require("../models/Marcacao");
const Servico = require("../models/Servico");

const verificarToken = require("../middlewares/verificarToken");
const verificarRole = require("../middlewares/verificarRole");

/**
 * RESUMO DO DASHBOARD (cards)
 */
router.get(
    "/resumo",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const clientes = await User.countDocuments({ role: "cliente" });
            const staff = await User.countDocuments({ role: "staff" });
            const servicos = await Servico.countDocuments();

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const marcacoesHoje = await Marcacao.countDocuments({
                data: { $gte: hoje }
            });

            res.json({
                clientes,
                staff,
                servicos,
                marcacoesHoje
            });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

/**
 * MARCAÇÕES RECENTES
 */
router.get(
    "/marcacoes-recentes",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const marcacoes = await Marcacao.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("cliente", "nome")
                .populate("servico", "nome")
                .populate("oficina", "nome");


            res.json(marcacoes);
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);


router.get("/utilizadores", verificarToken, verificarRole(["admin"]), async (req, res) => {
    const users = await User.find().select("nome email role ativo");
    res.json(users);
});

router.put("/utilizadores/:id/role", verificarToken, verificarRole(["admin"]), async (req, res) => {
    const { role } = req.body;

    if (!["cliente", "staff", "admin"].includes(role)) {
        return res.status(400).json({ erro: "Role inválido" });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
    );

    res.json(user);
});



router.get("/servicos", verificarToken, verificarRole(["admin"]), async (req, res) => {
    const servicos = await Servico.find().populate("oficina");
    res.json(servicos);
});



router.post(
    "/servicos",
    verificarToken,
    verificarRole(["admin"]),
    async (req, res) => {
        try {
            const {
                nome,
                preco,
                descricaoPublica,
                duracao,
                oficina
            } = req.body;

            const servico = new Servico({
                nome,
                preco,
                descricaoPublica,
                duracao,
                oficina
            });

            await servico.save();

            res.status(201).json(servico);
        } catch (error) {
            console.error(error);
            res.status(400).json({ erro: error.message });
        }
    }
);



router.delete("/servicos/:id", verificarToken, verificarRole(["admin"]), async (req, res) => {
    await Servico.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});


module.exports = router;
