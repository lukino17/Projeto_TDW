const mongoose = require("mongoose");

const notificacaoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    lida: {
        type: Boolean,
        default: false
    },
    criadaEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notificacao", notificacaoSchema);
