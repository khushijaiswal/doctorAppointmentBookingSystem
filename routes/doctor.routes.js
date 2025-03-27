const { DeclineAppointment, AcceptAppointment, showAppointmentsToDoctors, updateAppointmentStatus } = require("../controller/doctor.controller")

const router = require("express").Router()
router
    .get("/showAppointment-doctor", showAppointmentsToDoctors)
    .put("/declineAppointment-doctor/:aid", DeclineAppointment)
    .put("/acceptAppointment-doctor/:aid", AcceptAppointment)
    .put("/updateAppointmentstatus-doctor/:id", updateAppointmentStatus)
module.exports = router