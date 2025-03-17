const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profileImage: { type: String, default: "" },
    // appointmentBoooked: { type: String, enum: ["male", "female", "not to prefer"], default: 'not to prefer' },
    appointmentBoooked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        // required: true
    },
    schedule: [
        {
            day: {
                type: String,
                required: true,
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    // slotBooked: { type: Object, default: {} },
    // appointments: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Appointment'
    //     }
    // ],
    // // ratings: {
    // //     type: Number, default: 0
    // // },
    // // reviews: [
    // //     {
    // //         patientId: {
    // //             type: mongoose.Schema.Types.ObjectId,
    // //             ref: 'Patient'
    // //         },
    // //         comment: String,
    // //         rating: Number,
    // //         date: {
    // //             type: Date,
    // //             default: Date.now
    // //         }
    // //     }
    // // ],
    // payments: [
    //     {
    //         transactionId: String,
    //         amount: Number,
    //         date: {
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ],
    isApproved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Accepted", "Declined"]
    },
    isActive: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model('Doctor', doctorSchema);