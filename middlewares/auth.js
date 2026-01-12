//utilização de modulo basic-auth, consultar npm para mais detalhes
const basicAuth = require('basic-auth');
//importação do model User – a definir
const User = require('../models/user');
module.exports = async (req, res, next) => {
    const credentials = basicAuth(req);
//validação de preenchimento das credenciais, com módulo basic-auth
    if (!credentials || !credentials.name || !credentials.pass) {
        return res.status(401).json({ erro: 'Credenciais ausentes ou inválidas' });
    }
//procura na BD do utilizador para verificação e só permite continuar CASO autentique com sucesso
    try {
        const user = await User.findOne({ username: credentials.name });
        if (!user || user.password !== credentials.pass) {
            return res.status(401).json({ erro: 'Autenticação falhou' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao verificar credenciais' });
    }}
