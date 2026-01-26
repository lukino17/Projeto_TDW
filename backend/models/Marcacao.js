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
    estado: {
        type: String,
        enum: ["agendada", "confirmada", "cancelada", "concluida" , "em_progresso"],
        default: "agendada"
    },
    turno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turno",
        required: true
    }


}, {
    timestamps: true
});

module.exports = mongoose.model('Marcacao', MarcacaoSchema);
