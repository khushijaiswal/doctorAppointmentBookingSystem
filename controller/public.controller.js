const Doctor = require("../model/Doctor")
const asyncHandler = require("express-async-handler")
const redisClient = require("../redisClient")
const CACHE_EXPIRY = 60 * 5; // 5 minutes

exports.fetchDoctorsPublic = asyncHandler(async (req, res) => {
    const cacheKey = "public:doctors";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.json({ message: "Doctor fetch success (from cache)", result: JSON.parse(cached) });
    }
    try {
        const result = await Doctor.find({ isActive: true }).select("-password")
        res.json({ message: "Doctor fetch success", result })
        await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(result));
    } catch (error) {
        console.log(error)
        return res.json({ succes: false, message: error.message })
    }

})
