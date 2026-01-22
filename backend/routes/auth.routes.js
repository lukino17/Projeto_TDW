const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTAR UTILIZADOR
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
    try {
        const { nome, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ erro: "Email já registado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            nome,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            mensagem: "Utilizador criado com sucesso",
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

/**
 * LOGIN
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ erro: "Email ou password incorretos" });
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            return res.status(400).json({ erro: "Email ou password incorretos" });
        }

        // 🔑 GERAR TOKEN
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;
