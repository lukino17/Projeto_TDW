const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
    oficina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oficina",
        required: true
    },

    data: {
        type: Date,
        required: true
    },

    horaInicio: {
        type: String, // "09:00"
        required: true
    },

    horaFim: {
        type: String, // "13:00"
        required: true
    },

    vagasTotais: {
        type: Number,
        required: true,
        min: 1
    },

    vagasOcupadas: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Turno", turnoSchema);
