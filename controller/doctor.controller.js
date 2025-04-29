const asyncHandler = require("express-async-handler")
const Appointment = require("../model/Appointment")
const redisClient = require("../redisClient");

const CACHE_EXPIRY = 60 * 5; // 5 minutes

exports.showAppointmentsToDoctors = asyncHandler(async (req, res) => {
    const doctorId = req.loggedInUser;
    const cacheKey = `doctor:${doctorId}:appointments`;

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json({
                message: "Appointment fetch success (from cache)",
                result: JSON.parse(cached),
            });
        }

        const result = await Appointment.find({ doctorId })
            .populate("patientId", "name email address mobile");

        if (!result.length) {
            return res.status(404).json({ message: "No appointments found for this doctor" });
        }

        await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(result));
        return res.json({ message: "Appointment fetch success", result });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});

// exports.showAppointmentsToDoctors = asyncHandler(async (req, res) => {
//     try {
//         const result = await Appointment.find({ doctorId: req.loggedInUser }).populate('patientId', 'name email address mobile')
//         if (!result.length) {
//             return res.status(404).json({ message: "No appointments found for this doctor" });
//         }
//         return res.json({ message: "appointment fetch success", result })
//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }
// })
exports.AcceptAppointment = asyncHandler(async (req, res) => {
    // console.log(req.params.id);

    try {
        const result = await Appointment.findByIdAndUpdate(req.params.aid, { status: "Accepted" }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Invalidate doctor's cache
        await redisClient.del(`doctor:${result.doctorId}:appointments`);

        return res.json({ message: "Appointment accepted successfully", result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    // console.log(req.body)
    const result = await Appointment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })

    if (result) {
        await redisClient.del(`doctor:${result.doctorId}:appointments`);
    }
    res.status(200).json({ message: "Appointment Status Update Successfully" })
})
exports.DeclineAppointment = asyncHandler(async (req, res) => {
    try {
        const result = await Appointment.findByIdAndUpdate(req.params.aid, { status: "Declined" }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        // Invalidate doctor's cache
        await redisClient.del(`doctor:${result.doctorId}:appointments`);

        return res.json({ message: "Appointment declined successfully", result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
