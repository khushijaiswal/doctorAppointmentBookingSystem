const { fetchDoctorsPublic } = require("../controller/public.controller")

const router = require("express").Router()
router

    .get("/fetchAllDoctors-public", fetchDoctorsPublic)


module.exports = router