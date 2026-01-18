const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "SEGREDO_SUPER_SECRETO");
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        res.status(401).json({ erro: "Token inválido" });
    }
};
