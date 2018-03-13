const message = {
    toEntity: (obj) => {
        return {
            createdAt: new Date(),
            text: obj.text,
            user: obj.userId
        }
    },
    toDTO: (obj) => {
        return {
            createdAt: obj.createdAt,
            text: obj.text,
            user: ModelBuilder.user.toDTO(obj.user)
        }
    }
}

const user = {
    toEntity: (obj) => {
        return {
            email: obj.email,
            password: obj.password, // Password not encrypted
            username: obj.username
        }
    },
    toDTO: (obj) => {
        return {
            email: obj.email,
            username: obj.username,
            id: obj.id
        }
    }
}


const ModelBuilder = {
    // generateID = generateID,
    message: message,
    user: user,
}

module.exports = ModelBuilder