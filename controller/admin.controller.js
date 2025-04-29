const asyncHandler = require("express-async-handler")
const Doctor = require("../model/Doctor")
const Patient = require("../model/Patient")
const Appointment = require("../model/Appointment")
const redisClient = require("../redisClient")

const CACHE_EXPIRY = 60 * 5; // 5 minutes

exports.showDoctorsToAmin = asyncHandler(async (req, res) => {
    const cacheKey = "admin:doctors";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.json({ message: "Doctor fetch success (from cache)", result: JSON.parse(cached) });
    }

    const result = await Doctor.find({}).select("-password");
    await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(result));
    res.json({ message: "Doctor fetch success", result });
});

exports.showPatientsToAmin = asyncHandler(async (req, res) => {
    const cacheKey = "admin:patients";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.json({ message: "Patient fetch success (from cache)", result: JSON.parse(cached) });
    }

    const result = await Patient.find().select('-password -__v -createdAt -updatedAt');
    await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(result));
    return res.json({ message: "Patient fetch success", result });
});


exports.showAppointmentsToAdmin = asyncHandler(async (req, res) => {
    const cacheKey = "admin:appointments";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.json({ message: "Appointment fetch success (from cache)", result: JSON.parse(cached) });
    }

    const result = await Appointment.find()
        .populate('patientId', 'name email address mobile')
        .populate('doctorId', 'name email address phone specialization');

    await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(result));
    return res.json({ message: "Appointment fetch success", result });
});

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