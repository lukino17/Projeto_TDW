const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    duracao: {
        type: Number, // minutos
        required: true
    },
    descricaoPublica: {
        type: String,
        required: true
    },
    descricaoPrivada: {
        type: String
    },
    oficina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oficina',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Servico', ServicoSchema);
