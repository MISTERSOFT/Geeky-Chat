import { createServer } from 'http'
import * as socketIO from 'socket.io'
import * as UIDGenerator from 'uid-generator'
import * as moment from 'moment'
import { Env, Response } from './core'
import { messageRepository, userRepository, roomRepository } from './database'
import { UserConverter, MessageConverter, RoomConverter } from './converters'
import { UserDTO, MessageDTO, MessageLiteDTO } from './dtos'
import { Room, Message, MessageDOC, User, RoomDOC, JoinToken } from './entities'

const server = createServer()
const io = socketIO(server)
const uidgen = new UIDGenerator()
const _userConverter = new UserConverter()
const _messageConverter = new MessageConverter()
const _roomConverter = new RoomConverter()

server.listen(Env.PORT, () => {
  console.log(`# Server is running: http://localhost:${Env.PORT}`);
});

io.on('connection', (socket) => {
  socket.on('DEBUG', () => {
    io.to('3038c03c9ba32116a19b9374560156d0').clients((err, clients) => {
      socket.emit('DEBUG_RESPONSE', {
        rooms: socket.rooms,
        clients: clients
      })
    })
  })

  socket.on('SIGNUP', (userInfo: UserDTO) => {
    // const model = ModelBuilder.user.toEntity(userInfo)
    const model = _userConverter.toEntity(userInfo);
    // Create the user
    userRepository.storeUser(model).then(isOK => {
      if (isOK) {
        socket.emit('SIGNUP_RESPONSE', Response.compose())
      } else {
        socket.emit('SIGNUP_RESPONSE', Response.compose({}, false, ['E_SIGNIN_ERROR']))
      }
    })
  })

  socket.on('SIGNIN', (user) => {
    console.log('LOGIN...', user)
    const model = _userConverter.toEntity(user);
    // TODO: Improve login system with cookies or whatever
    userRepository.isUserExist(model)
      .then(user => {
        if (user) {
          socket.emit('SIGNIN_RESPONSE', Response.compose(_userConverter.toDTO(user)))
        } else {
          socket.emit('SIGNIN_RESPONSE', Response.compose({}, false, ['E_INVALID_USER_CREDENTIALS']))
        }
      });
  })

  socket.on('SEND_MESSAGE', (message: MessageLiteDTO) => {
    console.log('SEND_MESSAGE...', message)
    // Store the sent message
    const model = _messageConverter.toEntity(message)
    model.created_at = new Date()
    messageRepository.storeMessage(model).then(result => {
      if (result) {
        const data = _messageConverter.toDTO(result)
        console.log('Message to EMIT after save', data)
        // Emit the message with user data to the emitter
        // socket.emit('SEND_MESSAGE_RESPONSE', Response.compose(data))
        // Broadcast the message sent by the user to the room.
        // The message broadcasted contains the text message
        // and data about the emitter
        socket.to(result.room_id).emit('BROADCAST_SEND_MESSAGE', Response.compose(data))
      }
    })
  })

  /**
   * We user signin, load all rooms where the user connected
   */
  socket.on('FETCH_USER_ROOMS', (userId) => {
    console.log('FETCH_USER_ROOMS...');
    roomRepository.getRoomsByUser(userId)
      .then((rooms: Room[]) => {
        rooms.forEach(room => {
          // Join each rooms
          socket.join(room._id);
        });
        const data = _roomConverter.toDTOs(rooms);
        console.log('ROOMS', data);
        socket.emit('FETCH_USER_ROOMS_RESPONSE', Response.compose(data))
      });
  })

  socket.on('FETCH_ROOM_USERS', (roomId) => {
    console.log('FETCH_ROOM_USERS...')
    roomRepository.getUsersByRoom(roomId).then(users => {
      const data = _userConverter.toDTOs(users)
      console.log('data', data)
      socket.emit('FETCH_ROOM_USERS_RESPONSE', Response.compose(data))
    })
  })

  socket.on('FETCH_ROOM_MESSAGES', (roomId) => {
    console.log('FETCH_ROOM_MESSAGES...');
    roomRepository.getRoomMessages(roomId).then(messages => {
      const data = _messageConverter.toDTOs(messages)
      // console.log('data', data)
      socket.emit('FETCH_ROOM_MESSAGES_RESPONSE', Response.compose(data))
    })
  })

  socket.on('CREATE_ROOM', (obj) => {
    console.log('create room: ', obj.roomName);
    const room = new Room();
    room.name = obj.roomName;
    room.owner = obj.userId;
    // room.users = new Array(obj.userId);
    roomRepository.store(room).then(result => {
      userRepository.getById(room.owner).then((user) => {
        socket.join(result._id)
        const data = _roomConverter.toDTO(result)
        data.users = [_userConverter.toDTO(user)]
        console.log('Room DTO', data)
        socket.emit('CREATE_ROOM_RESPONSE', Response.compose(data))
      })
    })
  });

  socket.on('GENERATE_JOIN_CODE', (roomId: string) => {
    const genToken = uidgen.generateSync()
    // TODO: Check time zone for ExpireAt
    const token: JoinToken = {
      token: genToken,
      expireAt: moment(new Date()).add(10, 'minutes').toDate() // Token is valid 10 minutes
    }
    roomRepository.getById(roomId).then(room => {
      console.log('room', room)
      room.join_tokens.push(token)
      roomRepository.update(room).then((isOk) => {
        let data = {}
        if (isOk) data = {token: token.token}
        socket.emit('GENERATE_JOIN_CODE_RESPONSE', Response.compose(data, isOk))
      })
    })
    console.log('Generated token = ', genToken);
  })

  socket.on('JOIN_ROOM', (data: {userId: string, token: string}) => {
    roomRepository.getByToken(data.token).then((room: Room) => {
      console.log('Join room, response todo', room)
      const tryToken = room.join_tokens.find(t => t.token === data.token)
      const isTokenExpired = new Date(tryToken.expireAt) < new Date()
      console.log('is token expired', isTokenExpired);
      if (isTokenExpired) {
        socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_EXPIRED']))
      } else {
        roomRepository.storeRelationUserRoom(data.userId, room._id).then(() => {
          socket.join(room._id)
          const res = _roomConverter.toDTO(room)
          // Send room info to user
          socket.emit('JOIN_ROOM_RESPONSE', Response.compose(res))
          userRepository.getById(data.userId).then(user => {
            const joiningUser = _userConverter.toDTO(user)
            // Send user data to users connected to the room
            socket.broadcast.to(room._id).emit('USER_JOINING', Response.compose({roomId: room._id, user: joiningUser}))
          })
        })
      }
    })
    // joinTokenRepository.findByToken(token).then((tokenDoc) => {
    //   if (!tokenDoc) {
    //     socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_INVALID']))
    //     return null
    //   }
    //   // Check if the token expired, and also check if tokenDoc has been founded
    //   const hasTokenNotExpired = new Date(tokenDoc.expireAt) > new Date()
    //   console.log('has not expired', hasTokenNotExpired)
    //   // TOKEN TEST : GCvepZqqkc8wVrUzLZjqsZ
    //   if (hasTokenNotExpired) {
    //     return roomRepository.getById(tokenDoc.room).then(room => {
    //       socket.join(room.name_slug)
    //       const data = _roomConverter.toDTO(room)
    //       console.log('Token -> Room', data)
    //       socket.emit('JOIN_ROOM_RESPONSE', Response.compose(data))
    //     })
    //   } else {
    //     socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_EXPIRED']))
    //   }
    // })
  })

  socket.on('UPDATE_USER', (_user: UserDTO) => {
    if (!_user || !_user.id) {
      socket.emit('UPDATE_USER_RESPONSE', Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
      return;
    }
    userRepository.getById(_user.id).then(user => {
      const entity = _userConverter.toEntity(_user)
      user.email = _user.email;
      user.avatar = _user.avatar;
      user.username = _user.username;
      // console.log('user', user);
      // console.log('_user', _user);
      userRepository.update(user).then((isOK) => {
        if (isOK) {
          socket.emit('UPDATE_USER_RESPONSE', Response.compose())
        } else {
          socket.emit('UPDATE_USER_RESPONSE', Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
        }
      });
    })

  })

})
