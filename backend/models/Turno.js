const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
    oficina: { type: mongoose.Schema.Types.ObjectId, ref: "Oficina", required: true },
    data: { type: Date, required: true },
    horaInicio: { type: String, required: true },
    horaFim: { type: String, required: true },
    vagasTotais: { type: Number, required: true },
    vagasOcupadas: { type: Number, default: 0 }
});

module.exports = mongoose.model("Turno", turnoSchema);
