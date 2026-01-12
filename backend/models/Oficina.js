const mongoose = require('mongoose');

const OficinaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    localizacao: {
        type: String,
        required: true
    },
    contacto: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Oficina', OficinaSchema);
