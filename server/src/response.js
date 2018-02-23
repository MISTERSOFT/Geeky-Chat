/**
 * Create array of error
 * @param {string[]} errors
 */
const errors = (...errors) => {
    const response = []
    errors.forEach(error => response.push(error))
    return response
}

const success = (success) => success

const compose = (success, errors, data = {}) => {
    return {
        success,
        errors,
        data: data
    }
}

const ResponseBuilder = {
    compose: compose,
    errors: errors,
    success: success
}

module.exports = ResponseBuilder