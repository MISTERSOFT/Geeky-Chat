const app = require('http').createServer()
const io = require('socket.io')(app)
const Database  = require('./database')
const ModelBuilder = require('./models')
const ResponseBuilder = require('./response')

app.listen(3000, () => {
    console.log('# Server is running: http://localhost:3000');
})


io.on('connection', (socket) => {
    socket.on('SIGNUP', (userInfo) => {
        const model = ModelBuilder.user.toEntity(userInfo)
        // Create the user
        Database.storeUser(model).then(users => {
            socket.emit('SIGNUP_RESPONSE', ResponseBuilder.compose(
                ResponseBuilder.success(true),
                ResponseBuilder.errors()
            ))
        })
    })

    socket.on('SIGNIN', (user) => {
        console.log('LOGIN...', user)
        const model = ModelBuilder.user.toEntity(user)
        Database.isUserExist(model).then(response => {
            if (response.founded) {
                socket.emit('SIGNIN_RESPONSE', ResponseBuilder.compose(
                    ResponseBuilder.success(true),
                    ResponseBuilder.errors(),
                    { user: ModelBuilder.user.toDTO(response.user) }
                ))
            } else {
                socket.emit('SIGNIN_RESPONSE', ResponseBuilder.compose(
                    ResponseBuilder.success(false),
                    ResponseBuilder.errors('Invalid user email or password')
                ))
            }
        })
    })

    socket.on('SEND_MESSAGE', (message) => {
        console.log('SEND_MESSAGE...', message)
        // Store the message sent
        const model = ModelBuilder.message.toEntity(message)
        const promises = [
            Database.storeMessage(model),
            Database.findUserById(message.userId)
        ]
        Promise.all(promises).then((responses) => {
            const msg = responses[0].messages[0]
            const user = responses[1].users[0]
            msg.user = user

            const dto = ModelBuilder.message.toDTO(msg)
            // Emit the message with user data to the emitter
            socket.emit('SEND_MESSAGE_OK', ResponseBuilder.compose(
                ResponseBuilder.success(true),
                ResponseBuilder.errors(),
                dto
            ))
            // Broadcast the message sent by the user.
            // The message broadcasted contains the text message
            // and data about the emitter
            socket.broadcast.emit('BROADCAST_SEND_MESSAGE', dto)
        })
    })

    socket.on('FETCH_ALL_MESSAGES', () => {
        console.log('FETCH_ALL_MESSAGES...')
        Database.getMessages().then(response => {
            console.log('Messages fetched', response)
            const messages = []
            response.forEach(message => {
                // message.user = ModelBuilder.user.toDTO(message.user)
                messages.push(ModelBuilder.message.toDTO(message))
            })
            socket.emit('FETCH_ALL_MESSAGES_RESPONSE', ResponseBuilder.compose(
                ResponseBuilder.success(true),
                ResponseBuilder.errors(),
                messages
            ))
        })
    })
})
