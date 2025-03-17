const jwt = require("jsonwebtoken")
const Patient = require("../model/Patient")
const Doctor = require("../model/Doctor")

exports.adminprotected = async (req, res, next) => {
    const admin = req.cookies["admin-dbs"]
    if (!admin) {
        return res.status(401).json({ message: "no cookie found" })
    }

    jwt.verify(admin, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(401).json({ message: "invalid token" })
        }
        next()
    })

}

exports.patientProtected = async (req, res, next) => {
    const patient = req.cookies["patient-dbs"]
    // console.log(patient)
    if (!patient) {
        return res.status(401).json({ message: "no cookie found" })
    }

    jwt.verify(patient, process.env.JWT_SECRET, async (err, decode) => {  //decode mein wahi data ata jo humne auth.controller se bheja
        if (err) {
            return res.status(401).json({ message: "invalid token" })
        }

        const result = await Patient.findById(decode._id)
        if (!result) {
            // console.log("id", decode._id)
            return res.status(401).json({ message: "invalid patient id" })
        }
        if (!result.isActive) {
            return res.status(401).json({ message: "account block by admin" })
        }
        req.loggedInUser = decode._id
        // console.log("loggedIn user", req.loggedInUser);

        next()
    })

}
exports.doctorProtected = async (req, res, next) => {
    const doctor = req.cookies["doctor-dbs"]
    // console.log(doctor)
    if (!doctor) {
        return res.status(401).json({ message: "no cookie found" })
    }

    jwt.verify(doctor, process.env.JWT_SECRET, async (err, decode) => {  //decode mein wahi data ata jo humne auth.controller se bheja
        if (err) {
            return res.status(401).json({ message: "invalid token" })
        }

        const result = await Doctor.findById(decode._id)
        if (!result) {
            // console.log("id", decode._id)
            return res.status(401).json({ message: "invalid patient id" })
        }
        if (!result.isActive) {
            return res.status(401).json({ message: "account block by admin" })
        }
        req.loggedInUser = decode._id
        // console.log("loggedIn user", req.loggedInUser);

        next()
    })

}