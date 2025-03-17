const { BookAppointment, fetchDoctors, cancelAppointment, fetchAppointments, fetchDoctorsById } = require("../controller/patient.controller")

const router = require("express").Router()
router

    .get("/fetchAllDotors-patient", fetchDoctors)
    .get("/fetchDoctorById/:id", fetchDoctorsById)
    .post("/bookAppointment-patient", BookAppointment)
    .put("/cancelAppointment-patient/:aid", cancelAppointment)
    .get("/fetchAppointment-patient", fetchAppointments)


module.exports = router