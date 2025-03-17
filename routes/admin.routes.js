const { showDoctorsToAmin, showPatientsToAmin, showAppointmentsToAdmin, adminBlockUnblockDoctor, adminBlockUnblockPatient } = require("../controller/admin.controller")

const router = require("express").Router()
router
    // Doctor register by admin
    .get("/showDoctors-admin", showDoctorsToAmin)
    .get("/showPatients-admin", showPatientsToAmin)
    .get("/showAppointment-admin", showAppointmentsToAdmin)

    .put("/blockUnblock-admin-doctor/:did", adminBlockUnblockDoctor)
    .put("/blockUnblock-admin-patient/:pid", adminBlockUnblockPatient)


module.exports = router