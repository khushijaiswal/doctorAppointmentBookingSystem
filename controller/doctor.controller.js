const asyncHandler = require("express-async-handler")
const Appointment = require("../model/Appointment")


exports.showAppointmentsToDoctors = asyncHandler(async (req, res) => {
    try {
        const result = await Appointment.find({ doctorId: req.loggedInUser }).populate('patientId', 'name email address mobile')
        if (!result.length) {
            return res.status(404).json({ message: "No appointments found for this doctor" });
        }
        return res.json({ message: "appointment fetch success", result })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
})
exports.AcceptAppointment = asyncHandler(async (req, res) => {
    console.log(req.params.id);

    try {
        const result = await Appointment.findByIdAndUpdate(req.params.aid, { status: "Accepted" }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.json({ message: "Appointment accepted successfully", result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    console.log(req.body)
    await Appointment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    res.status(200).json({ message: "Appointment Status Update Successfully" })
})
exports.DeclineAppointment = asyncHandler(async (req, res) => {
    try {
        const result = await Appointment.findByIdAndUpdate(req.params.aid, { status: "Declined" }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.json({ message: "Appointment declined successfully", result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
