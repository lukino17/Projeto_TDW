const mongoose = require('mongoose');

const MarcacaoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    veiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veiculo',
        required: true
    },
    oficina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oficina',
        required: true
    },
    servico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico',
        required: true
    },
    dataHora: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ["agendada", "confirmada", "cancelada", "concluida"],
        default: "agendada"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Marcacao', MarcacaoSchema);
