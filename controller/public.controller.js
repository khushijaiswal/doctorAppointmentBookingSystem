const Doctor = require("../model/Doctor")
const asyncHandler = require("express-async-handler")

exports.fetchDoctorsPublic = asyncHandler(async (req, res) => {
    try {
        const result = await Doctor.find({}).select("-password")
        res.json({ message: "Doctor fetch success", result })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }

})