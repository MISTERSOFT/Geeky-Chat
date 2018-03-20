import { createServer } from 'http'
import * as socketIO from 'socket.io'
import * as UIDGenerator from 'uid-generator'
import * as moment from 'moment'
import { Env, Response } from './core'
import { messageRepository, userRepository, roomRepository, joinTokenRepository } from './database'
import { UserConverter, MessageConverter, RoomConverter, JoinTokenConverter } from './converters'
import { UserDTO, MessageDTO, MessageLiteDTO } from './dtos'
import { Room, Message, MessageDOC, User, RoomDOC, JoinToken } from './entities'

const server = createServer()
const io = socketIO(server)
const uidgen = new UIDGenerator()
const _userConverter = new UserConverter()
const _messageConverter = new MessageConverter()
const _roomConverter = new RoomConverter()
const _joinTokenConverter = new JoinTokenConverter()

server.listen(Env.PORT, () => {
  console.log(`# Server is running: http://localhost:${Env.PORT}`);
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
    // TODO: Improve login system with cookies or whatever
    userRepository.isUserExist(model)
    .then(response => {
      if (response.founded) {
        socket.emit('SIGNIN_RESPONSE', Response.compose(_userConverter.toDTO(response.user)))
      } else {
        socket.emit('SIGNIN_RESPONSE', Response.compose({}, false, ['Invalid user email or password']))
      }
    });
  })

  socket.on('SEND_MESSAGE', (message: MessageLiteDTO) => {
    console.log('SEND_MESSAGE...', message)
    // Store the sent message
    // const model = ModelBuilder.message.toEntity(message)
    const model = _messageConverter.toEntity(message)
    model.createdAt = new Date()
    const promises: [Promise<Message>, Promise<User>, Promise<Room>] = [
      messageRepository.storeMessage(model),
      userRepository.getById(message.userId),
      roomRepository.getById(message.roomId)
    ]
    Promise.all(promises).then((responses) => {
      const msg = responses[0]
      const user = responses[1]
      msg.user = user
      const room = responses[2]

      const dto = _messageConverter.toDTO(msg)
      // Emit the message with user data to the emitter
      socket.emit('SEND_MESSAGE_RESPONSE', Response.compose(dto))
      // Broadcast the message sent by the user to the room.
      // The message broadcasted contains the text message
      // and data about the emitter
      socket.to(room.name_slug).emit('BROADCAST_SEND_MESSAGE', Response.compose(dto))
      // socket.broadcast.emit('BROADCAST_SEND_MESSAGE', dto)
    })
  })

  /**
   * We user signin, load all messages for each rooms where the user connected
   */
  socket.on('FETCH_ALL_USER_DATA', (userId) => {
    console.log('FETCH_ALL_DATA...');
    roomRepository.getRoomsByUser(userId)
    .then((rooms: Room[]) => {
      rooms.forEach(room => {
        // Join each rooms
        socket.join(room.name_slug);
      });
      const data = _roomConverter.toDTOs(rooms);
      console.log('ROOMS', data);
      socket.emit('FETCH_ALL_USER_DATA_RESPONSE', Response.compose(data))
    });
  })

  socket.on('CREATE_ROOM', (obj) => {
    console.log('create room: ', obj.roomName);
    const room = new Room();
    room.name = obj.roomName;
    room.name_slug = obj.roomName;
    room.owner = obj.userId;
    room.users = new Array(obj.userId);
    console.log('room', room);
    roomRepository.store(room).then(result => {
      console.log('create room done, result:', result)
      socket.join(result.name_slug)
      const data = _roomConverter.toDTO(result)
      socket.emit('CREATE_ROOM_RESPONSE', Response.compose(data))
    })
  });

  socket.on('GENERATE_JOIN_CODE', (roomId: string) => {
    const genToken = uidgen.generateSync()
    console.log('Generated token = ', genToken);
    const token = new JoinToken()
    token.token = genToken
    token.room = roomId
    // TODO: Check time zone
    token.expireAt = moment(new Date()).add(10, 'minutes').toDate() // Token is valid 10 minutes
    joinTokenRepository.store(token).then(doc => {
      const data = _joinTokenConverter.toDTO(doc)
      socket.emit('GENERATE_JOIN_CODE_RESPONSE', Response.compose(data))
    })
  })

  // TODO: Later
  socket.on('JOIN_ROOM', (token: string) => {
    joinTokenRepository.findByToken(token).then((tokenDoc) => {
      if (!tokenDoc) {
        socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_INVALID']))
        return null
      }
      // Check if the token expired, and also check if tokenDoc has been founded
      const hasTokenNotExpired = new Date(tokenDoc.expireAt) > new Date()
      console.log('has not expired', hasTokenNotExpired)
      // TOKEN TEST : GCvepZqqkc8wVrUzLZjqsZ
      if (hasTokenNotExpired) {
        return roomRepository.getById(tokenDoc.room).then(room => {
          socket.join(room.name_slug)
          const data = _roomConverter.toDTO(room)
          console.log('Token -> Room', data)
          socket.emit('JOIN_ROOM_RESPONSE', Response.compose(data))
        })
      } else {
        socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_EXPIRED']))
      }
    })
  })

})
