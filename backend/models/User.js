const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'cliente'],
        default: 'cliente'
    },
    oficina:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oficina',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
