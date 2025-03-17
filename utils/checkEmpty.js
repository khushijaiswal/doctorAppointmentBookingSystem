const validator = require("validator")

//                       👇 object ex: {mobile,address,city,type,startTime,endTime}
exports.checkEmpty = (config) => {
    let isError = false
    const error = []
    for (const key in config) {
        if (validator.isEmpty(config[key] ? toString(config[key]) : "")) {  // isEmpty(config.mobile)  isEmpty(config.adddress)
            isError = true
            error.push(`${key} is missing`)
        }
    }
    return { isError, error }
}

