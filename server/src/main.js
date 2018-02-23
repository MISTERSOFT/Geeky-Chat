const app = require('http').createServer()
const io = require('socket.io')(app)
const Database  = require('./database')
const ModelBuilder = require('./models')
const ResponseBuilder = require('./response')

app.listen(3000, () => {
    console.log('# Server is running: http://localhost:3000');
})

const users = []
const messages = []

io.on('connection', (socket) => {
    socket.on('SIGNUP', (userInfo) => {
        const model = ModelBuilder.user(userInfo)
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
        const model = ModelBuilder.user(user)
        Database.getUser(model).then(response => {
            if (response.founded) {
                socket.emit('SIGNIN_RESPONSE', ResponseBuilder.compose(
                    ResponseBuilder.success(true),
                    ResponseBuilder.errors(),
                    { user: response.user }
                ))
            } else {
                socket.emit('SIGNIN_RESPONSE', ResponseBuilder.compose(
                    ResponseBuilder.success(false),
                    ResponseBuilder.errors('Invalid user email or password')
                ))
            }
        })
    })

    // On connection, send all message to user
    // socket.emit('FIRST_CONNECTION', messages)

    // On message sent by the user, add message to messages array
    socket.on('SEND_MESSAGE', (message) => {
        console.log('SEND_MESSAGE', message)
        messages.push(message)
        socket.broadcast.emit('NEW_MESSAGE_RECEIVED', message)
    })
})
