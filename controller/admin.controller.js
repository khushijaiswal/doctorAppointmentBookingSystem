const asyncHandler = require("express-async-handler")
const Doctor = require("../model/Doctor")
const Patient = require("../model/Patient")
const Appointment = require("../model/Appointment")



exports.showDoctorsToAmin = asyncHandler(async (req, res) => {
    try {
        const result = await Doctor.find({}).select("-password")
        res.json({ message: "Doctor fetch success", results: result })
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }

})
exports.showPatientsToAmin = asyncHandler(async (req, res) => {
    try {
        const result = await Patient.find().select('-password -__v -createdAt -updatedAt')
        return res.json({ message: "Patient fetch success", result })
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }

})

exports.showAppointmentsToAdmin = asyncHandler(async (req, res) => {
    const result = await Appointment.find()
        .populate('patientId', 'name email address mobile')
        .populate('doctorId', 'name email address phone specialization')
    return res.json({ message: "appointment fetch success", result })
})


exports.adminBlockUnblockDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndUpdate(req.params.did, { isActive: req.body.isActive })
        res.json({ message: "Doctor Account block success" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "something went wrong" })
    }
}

exports.adminBlockUnblockPatient = async (req, res) => {
    try {

        await Patient.findByIdAndUpdate(req.params.pid, { isActive: req.body.isActive })
        res.json({ message: "Patient Account block success" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "something went wrong" })
    }
}