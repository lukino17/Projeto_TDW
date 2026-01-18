module.exports = function verificarRole(rolesPermitidos) {
    return function (req, res, next) {
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({
                erro: "Sem permissões"
            });
        }
        next();
    };
};
