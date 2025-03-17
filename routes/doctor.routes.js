const { DeclineAppointment, AcceptAppointment, showAppointmentsToDoctors } = require("../controller/doctor.controller")

const router = require("express").Router()
router
    .get("/showAppointment-doctor", showAppointmentsToDoctors)
    .put("/declineAppointment-doctor/:aid", DeclineAppointment)
    .put("/acceptAppointment-doctor/:aid", AcceptAppointment)
module.exports = router