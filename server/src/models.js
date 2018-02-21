// generateID = (type) => {
//     return type + '/' + Math.random().toString(36).substr(2, 9);
// }

const message = (obj, sender) => {
    return {
        // id: generateID('messages'),
        createdAt: new Date(),
        text: obj.text,
        user: sender.id
    }
}

const user = (data) => {
    return {
        // id: generateID('users'),
        login: data.login,
        password: data.password, // Password not encrypted
        username: data.username
    }
}

const ModelBuilder = {
    // generateID = generateID,
    message: message,
    user: user
}

module.exports = ModelBuilder