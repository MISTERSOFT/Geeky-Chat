const app = require('http').createServer()
const io = require('socket.io')(app)
const Database  = require('./database')
const ModelBuilder = require('./models')

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
            socket.emit('SIGNUP_RESPONSE', {
                success: true
            })
        })
    })

    socket.on('LOGIN', (user) => {
        console.log('LOGIN', user)
        users.push(user)
        socket.emit('LOAD_MESSAGES', messages)
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
