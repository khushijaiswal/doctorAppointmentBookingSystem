const asyncHandler = require("express-async-handler")
const Doctor = require("../model/Doctor")
const Patient = require("../model/Patient")
const Appointment = require("../model/Appointment")


exports.fetchDoctors = asyncHandler(async (req, res) => {
    try {
        const result = await Doctor.find({ isActive: true }).select("-password")
        res.json({ message: "Doctor fetch success", result })
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }

})

exports.fetchDoctorsById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const result = await Doctor.findById(id).select("-password")

        if (!result) {
            return res.status(404).json({ message: "No doctor found" });
        }
        res.json({ message: "Doctor fetch success", result })
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }

})

// exports.BookAppointment = asyncHandler(async (req, res) => {
//     const result = await Appointment.create({ ...req.body, patientId: req.loggedInUser })
//     // await Appointment.create({ ...req.body, patientId: req.loggedInUser, doctorId: req.body.doctorId })
//     return res.json({ message: "Appointment booked successfully", result })
// })


exports.BookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.loggedInUser; // Assuming the logged-in user is a patient

    // Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({ doctorId, date, timeSlot });

    if (existingAppointment) {
        return res.status(400).json({ message: "Slot not available. Please choose another time." });
    }

    // If slot is available, book the appointment
    const newAppointment = await Appointment.create({ doctorId, patientId, date, timeSlot });

    return res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
});


exports.cancelAppointment = asyncHandler(async (req, res) => {
    console.log(req.params);

    const result = await Appointment.findByIdAndUpdate(req.params.aid, { isDeleted: true })
    return res.json({ message: "appointment deleted successfully", result })
})

exports.fetchAppointments = asyncHandler(async (req, res) => {
    const result = await Appointment.find({ patientId: req.loggedInUser, isDeleted: false, status: { $in: ["Pending", "Accepted"] } })
        .populate('doctorId', 'name email address phone specialization')
    return res.json({ message: "Appointments fetched successfully", result })
})

exports.fetchHistoryAppointments = asyncHandler(async (req, res) => {
    const result = await Appointment.find({ patientId: req.loggedInUser, isDeleted: false, status: "Completed" })
        .populate('doctorId', 'name email address phone specialization')
    return res.json({ message: "History Appointments fetched successfully", result })
})