const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const userId = req.headers["user-id"];

        if (!userId) {
            return res.status(401).json({ erro: "Utilizador não autenticado" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ erro: "Utilizador inválido" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = auth;
