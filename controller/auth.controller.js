const asyncHandler = require('express-async-handler')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Admin = require('../model/Admin')
const { generateOTP } = require('../utils/otp')
const { sendEmail } = require('../utils/email')
const { differenceInSeconds } = require('date-fns')
const jwt = require('jsonwebtoken')
const Patient = require('../model/Patient')
const Doctor = require('../model/Doctor')
const cloud = require("../utils/cloudinary")
const { upload } = require("../utils/upload")
const { checkEmpty } = require("../utils/checkEmpty")


// admin registration
exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, mobile } = req.body
    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(mobile)) {
        return res.status(400).json({ message: "all fields required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "invalid email" })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "invalid mobile" })
    }
    await Admin.create({ name, email, mobile })
    res.json({ message: "admin register success" })

})

// admin login
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { userName } = req.body

    const result = await Admin.findOne({ $or: [{ email: userName }, { mobile: userName }] })
    if (!result) {
        return res.status(400).json({ message: "invalid credentials" })
    }
    // send OTP
    const otp = generateOTP()
    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: Date.now() })
    // await sendSMS({ number: result.mobile, message: `your otp is ${otp}` })
    await sendEmail({
        message: `<h1>Your OTP is ${otp}</h1>`,
        subject: "verify otp to login",
        to: result.email
    })
    res.json({ message: "otp send" })
})

// admin verification
exports.verifyAdminOTP = asyncHandler(async (req, res) => {
    const { otp, userName } = req.body  // 1234

    const result = await Admin.findOne({ $or: [{ email: userName }, { mobile: userName }] })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials" })
    }
    if (result.otp !== otp) {
        return res.status(401).json({ message: "invalid otp" })
    }
    if (differenceInSeconds(Date.now(), result.otpSendOn) > process.env.OTP_EXPIRE) {
        await Admin.findByIdAndUpdate(result._id, { otp: null })
        return res.status(401).json({ message: "otp expire" })
    }

    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("admin-dbs", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "login success",
        result: {
            name: result.name,
            email: result.email
        }
    })
})

// admin logout
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin-dbs")
    res.json({ message: "logout success" })
})

// patient registration
exports.registerPatient = asyncHandler(async (req, res) => {
    const isFound = await Patient.findOne({ email: req.body.email })//object
    if (isFound) {
        return res.status(401).json({ message: "email already exist,please use another email" })
    }
    const x = await bcrypt.hash(req.body.password, 10)
    await Patient.create({ ...req.body, password: x })
    res.status(201).json({ message: "register patient success" })

})
exports.loginPatient = asyncHandler(async (req, res) => {

    const { userName, password } = req.body

    const result = await Patient.findOne({ $or: [{ email: userName }, { mobile: userName }] })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials email" })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials password" })

    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET)
    res.cookie("patient-dbs", token, {
        maxAge: 10000 * 60 * 60 * 24,
        httpOnly: true,
    })
    res.json({
        message: "patient login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            city: result.city,
            address: result.address,
        }
    })

    // res.json({ message: "user login success" })
})
exports.logoutPatient = asyncHandler(async (req, res) => {
    res.clearCookie("patient-dbs")
    res.json({ message: "patient logout success" })
})

// Doctor registration
exports.registerDoctor = asyncHandler(async (req, res) => {

    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "multer error" })
            }
            // const { name, email, specialization, phone, address, profileImage, schedule } = req.body
            const { name, email, specialization, phone, address, schedule } = req.body
            const { isError, error } = checkEmpty({ name, email, specialization, phone, address, schedule })
            if (isError) {
                return res.status(400).json({ message: "all fileds required", error })
            }
            const result = await Doctor.findOne({ email })
            if (result) {
                return res.status(409).json({ message: "email already registered" })
            }
            const password = name.slice(0, 2) + email.slice(0, 2)
            const hash = await bcrypt.hash(password, 10)
            // if (!req.files || req.files.length === 0) {
            //     return res.status(400).json({ message: "image is require" })
            // }

            let image = ""
            if (req.file) {
                const { secure_url } = await cloud.uploader.upload(req.file.path)
                image = secure_url
            }

            const x = JSON.parse(req.body.schedule)

            const DoctorCreate = await Doctor.create({ ...req.body, schedule: x, profileImage: image, password: hash })
            res.json({ message: "doctor register success", DoctorCreate })
        })
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }
})

// Doctor Login
exports.loginDoctor = asyncHandler(async (req, res) => {

    const { userName, password } = req.body

    const result = await Doctor.findOne({ $or: [{ email: userName }, { phone: userName }] })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials email" })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials password" })

    }
    if (!result.isActive) {
        return res.status(401).json({ message: "account block by admin" })
    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET)
    res.cookie("doctor-dbs", token, {
        maxAge: 10000 * 60 * 60 * 24,
        httpOnly: true,
    })
    res.json({
        message: "Doctor login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            phone: result.mobile,
            specialization: result.city,
            address: result.address,
        }
    })

})

// Doctor Logout
exports.logoutDoctor = asyncHandler(async (req, res) => {
    res.clearCookie("doctor-dbs")
    res.json({ message: "Doctor logout success" })
})
