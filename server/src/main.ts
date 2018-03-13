import { createServer } from 'http';
import * as socketIO from 'socket.io';
import { Env, Response } from './core';
import { messageRepository, userRepository } from './database';
import { UserConverter, MessageConverter } from './converters';
import { UserDTO } from './dtos';

const server = createServer();
const io = socketIO(server);
const _userConverter = new UserConverter();
const _messageConverter = new MessageConverter();

server.listen(Env.PORT, () => {
  console.log(`# Server is running: http://localhost:${Env.PORT}`)
});

io.on('connection', (socket) => {
  socket.on('SIGNUP', (userInfo: UserDTO) => {
    // const model = ModelBuilder.user.toEntity(userInfo)
    const model = _userConverter.toEntity(userInfo);
    // Create the user
    userRepository.storeUser(model).then(users => {
      socket.emit('SIGNUP_RESPONSE', Response.compose())
    })
  })

  socket.on('SIGNIN', (user) => {
    console.log('LOGIN...', user)
    const model = _userConverter.toEntity(user);
    userRepository.isUserExist(model).then(response => {
      if (response.founded) {
        socket.emit('SIGNIN_RESPONSE', Response.compose(_userConverter.toDTO(response.user)))
      } else {
        socket.emit('SIGNIN_RESPONSE', Response.compose({}, false, ['Invalid user email or password']))
      }
    })
  })

  socket.on('SEND_MESSAGE', (message) => {
    console.log('SEND_MESSAGE...', message)
    // Store the sent message
    // const model = ModelBuilder.message.toEntity(message)
    const model = _messageConverter.toEntity(message);
    model.createdAt = new Date();
    const promises = [
      messageRepository.storeMessage(model),
      userRepository.findUserById(message.userId)
    ];
    Promise.all(promises).then((responses) => {
      const msg = responses[0].messages[0]
      const user = responses[1].users[0]
      msg.user = user

      const dto = _messageConverter.toDTO(msg)
      // Emit the message with user data to the emitter
      socket.emit('SEND_MESSAGE_RESPONSE', Response.compose(dto))
      // Broadcast the message sent by the user.
      // The message broadcasted contains the text message
      // and data about the emitter
      socket.broadcast.emit('BROADCAST_SEND_MESSAGE', dto)
    })
  })

  socket.on('FETCH_ALL_MESSAGES', () => {
    console.log('FETCH_ALL_MESSAGES...')
    messageRepository.getMessages().then(response => {
      console.log('Messages fetched', response)
      const messages = []
      response.forEach(message => {
        // messages.push(ModelBuilder.message.toDTO(message))
        messages.push(_messageConverter.toDTO(message));
      })
      socket.emit('FETCH_ALL_MESSAGES_RESPONSE', Response.compose(messages))
    })
  })
})
