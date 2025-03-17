const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 100

    },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "not to prefer"], default: 'not to prefer' },
    reviews: [
        {
            doctorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Doctor'
            },
            comment: String,
            rating: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isActive: { type: Boolean, default: true },

}, { timestamps: true })




module.exports = mongoose.model("Patient", patientSchema)