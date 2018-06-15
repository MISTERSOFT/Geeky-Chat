import { createServer } from 'http';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as socketIO from 'socket.io';
import * as UIDGenerator from 'uid-generator';
import { API } from './api';
import { MessageConverter, RoomConverter, UserConverter } from './converters';
import { ChatStateChangeMultiple, ChatStateChangeSingle, Env, Response, RuntimeChatState, RuntimeUserState } from './core';
import { messageRepository, roomRepository, userRepository } from './database';
import { MessageLiteDTO } from './dtos';
import { JoinToken, Room } from './entities';

// const app = express()
// const server = createServer(app)
const server = createServer(API)
const io = socketIO(server)
const uidgen = new UIDGenerator()
const _userConverter = new UserConverter()
const _messageConverter = new MessageConverter()
const _roomConverter = new RoomConverter()

/**
 * Contains all rooms with users per room
 * Runtime constant that help to know things like:
 * - Users status
 * - Users keyboards event
 * - Maybe many things...
 */
const CHAT_RUNTIME = new RuntimeChatState();

server.listen(Env.PORT, () => {
  console.log(`# Server is running: http://localhost:${Env.PORT}`);
  roomRepository.getAllRoomsForRuntime().then((rooms) => {
    CHAT_RUNTIME.rooms = rooms;
    const promises = []
    rooms.forEach(room =>
      promises.push(userRepository.getUsersByRoomForRuntime(room.roomId))
    )
    Promise.all(promises).then((result: Array<{roomId: string, values: RuntimeUserState[]}>) => {
      // For each rooms, get its own users
      CHAT_RUNTIME.rooms.forEach(room => {
        room.users = result.find(r => r.roomId === room.roomId).values;
      })
    })
  })
})

//#region Express Middlewares

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Pass to next layer of middleware
//   next();
// });

// //#endregion

// //#region Express server routes

// app.post('/signin', (req, res) => {
//   console.log('Signin...')
//   const body = req.body
//   const model = _userConverter.toEntity(body)
//   userRepository.isUserExist(model).then(user => {
//     if (user) {
//       const data = Tools.toPlainObjectToken(user)
//       var token = jwt.sign(data, Env.SECRET_KEY, { expiresIn: Env.TOKEN_EXPIRATION });
//       res.status(200).type('json').end(JSON.stringify(token))
//     } else {
//       // No user found
//       const data = Response.compose({}, false, ['E_INVALID_USER_CREDENTIALS'])
//       res.status(200).type('json').end(JSON.stringify(data))
//     }
//   })
// })

// app.post('/signup', (req, res) => {
//   // TODO: Create express route for Signup
//   const userInfo = req.body
//   const model = _userConverter.toEntity(userInfo);
//   // Create the user
//   userRepository.storeUser(model).then(isOK => {
//     if (isOK) {
//       const data = Response.compose()
//       res.status(200).type('json').end(JSON.stringify(data))
//     } else {
//       const data = Response.compose({}, false, ['E_SIGNIN_ERROR'])
//       res.status(200).type('json').end(JSON.stringify(data))
//     }
//   })
// })

// app.get('/user/:id', (req, res) => {
//   const userId = req.params.id
//   userRepository.getById(userId).then(user => {
//     const dto = _userConverter.toDTO(user)
//     const data = Response.compose(dto)
//     res.status(200).type('json').end(JSON.stringify(data))
//   }).catch(e => {
//     const data = Response.compose({}, false, ['E_SERVER_ERROR'])
//     res.status(500).type('json').end(JSON.stringify(data))
//   })
// })

// app.put('/user', (req, res) => {
//   console.log('update user with PUT...')
//   let error;
//   const _user = req.body
//   if (!_user || !_user.id) {
//     // socket.emit('UPDATE_USER_RESPONSE', Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
//     error = Response.compose({}, false, ['E_UPDATE_USER_ERROR'])
//     res.status(404).type('json').end(JSON.stringify(error))
//     return
//   }
//   userRepository.getById(_user.id).then(user => {
//     const entity = _userConverter.toEntity(_user)
//     user.email = _user.email
//     user.avatar = _user.avatar
//     user.username = _user.username
//     // console.log('user', user);
//     // console.log('_user', _user);
//     userRepository.update(user).then((isOK) => {
//       if (isOK) {
//         // socket.emit('UPDATE_USER_RESPONSE', Response.compose())
//         res.status(200).type('json').end(JSON.stringify(Response.compose()))
//       } else {
//         error = Response.compose({}, false, ['E_UPDATE_USER_ERROR'])
//         res.status(404).type('json').end(JSON.stringify(error))
//       }
//     })
//   })
// })

//#endregion

//#region Socket IO Middleware

io.use((socket, next) => {
  const token = socket.handshake.query.token
  if (token) {
    try {
      jwt.verify(token, Env.SECRET_KEY)
      return next();
    } catch (e) {
      next(new Error('E_AUTHENTIFICATION'))
    }
  }
  next(new Error('E_AUTHENTIFICATION'))
})

//#endregion

io.on('connection', (socket) => {
  console.log('Socket connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
  // console.log('TOKEN FOR EVENT', socket.handshake.query.token) // ! Keep this code

  // TODO: Remove
  socket.on('DEBUG', (data) => {
    console.log('debug', data)
    const states = CHAT_RUNTIME.getRoomsStates(data)
    console.log('debug state', states)
    socket.emit('CHAT_STATE', Response.compose(states))
  })

  // socket.on('SIGNUP', (userInfo: UserDTO, respond: Function) => {
  //   // const model = ModelBuilder.user.toEntity(userInfo)
  //   const model = _userConverter.toEntity(userInfo);
  //   // Create the user
  //   userRepository.storeUser(model).then(isOK => {
  //     if (isOK) {
  //       // socket.emit('SIGNUP_RESPONSE', Response.compose())
  //       respond(Response.compose())
  //     } else {
  //       // socket.emit('SIGNUP_RESPONSE', Response.compose({}, false, ['E_SIGNIN_ERROR']))
  //       respond(Response.compose({}, false, ['E_SIGNIN_ERROR']))
  //     }
  //   })
  // })

  // socket.on('SIGNIN', (user, respond: Function) => {
  //   console.log('LOGIN...', user)
  //   const model = _userConverter.toEntity(user);
  //   userRepository.isUserExist(model)
  //     .then(user => {
  //       if (user) {
  //         // socket.emit('SIGNIN_RESPONSE', Response.compose(_userConverter.toDTO(user)))
  //         respond(Response.compose(_userConverter.toDTO(user)))
  //       } else {
  //         // socket.emit('SIGNIN_RESPONSE', Response.compose({}, false, ['E_INVALID_USER_CREDENTIALS']))
  //         respond(Response.compose({}, false, ['E_INVALID_USER_CREDENTIALS']))
  //       }
  //     });
  // })

  socket.on('SEND_MESSAGE', (message: MessageLiteDTO) => {
    console.log('SEND_MESSAGE...', message)
    // Store the sent message
    const model = _messageConverter.toEntity(message)
    model.created_at = new Date()
    messageRepository.storeMessage(model).then(result => {
      if (result) {
        const data = _messageConverter.toDTO(result)
        // Emit the message with user data to the emitter
        socket.emit('SEND_MESSAGE_RESPONSE', Response.compose(data))
        // Broadcast the message sent by the user to the room.
        // The message broadcasted contains the text message
        // and data about the emitter
        socket.to(result.room_id).emit('BROADCAST_SEND_MESSAGE', Response.compose(data))
      }
    })
  })

  socket.on('CHAT_STATE_CHANGE', (changes: ChatStateChangeSingle|ChatStateChangeMultiple) => {
    CHAT_RUNTIME.applyChanges(changes);
    if (ChatStateChangeSingle.isInstance(changes)) {
      console.log('Chat state changed - Single')
      const state = CHAT_RUNTIME.getRoomStateByUser(changes.roomId, changes.userId)
      socket.emit('CHAT_STATE', Response.compose(state))
      socket.to(changes.roomId).emit('CHAT_STATE', Response.compose(state))
    } else {
      console.log('Chat state changed - Multiple')
      const states = CHAT_RUNTIME.getRoomsStateByUser(changes.roomIds, changes.userId)
      socket.emit('CHAT_STATE', Response.compose(states))
      changes.roomIds.forEach(roomId => {
        socket.to(roomId).emit('CHAT_STATE', Response.compose(states))
      })
    }
  })

  socket.on('FETCH_USER_ROOMS_V2', (userId, respond: Function) => {
    console.log('Fetch user rooms data...')
    // Fetch user room
    roomRepository.getRoomsByUser(userId)
      .then((rooms: Room[]) => {
        rooms.forEach(room => {
          // Join each rooms
          socket.join(room._id);
        })

        const promisesByRoom = []
        rooms.forEach(room => {
          promisesByRoom.push(
            Promise.all([
              roomRepository.getUsersByRoom(room._id),
              roomRepository.getRoomMessages(room._id)
            ])
          )
        })
        Promise.all(promisesByRoom)
          .then(responsePromisesByRoom => {
            const roomsDto = _roomConverter.toDTOs(rooms)
            // console.log('responsePromisesByRoom', responsePromisesByRoom)
            responsePromisesByRoom.forEach((v, index) => {
              // console.log('# Q');
              // console.log('  # Users ', _userConverter.toDTOs(responsePromisesByRoom[index][0]))
              // console.log('  # Messages ', _messageConverter.toDTOs(responsePromisesByRoom[index][1]))
              roomsDto[index].users = _userConverter.toDTOs(responsePromisesByRoom[index][0])
              roomsDto[index].messages = _messageConverter.toDTOs(responsePromisesByRoom[index][1])
              // Messages order by time
              roomsDto[index].messages.sort((a, b) => {
                const msgA = new Date(a.created_at).getTime();
                const msgB = new Date(b.created_at).getTime();
                return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
              })
            })
            return roomsDto
          })
          .then(roomsDtos => {
            // Send data to client
            respond(Response.compose(roomsDtos))
            // Send user's rooms states
            // CHAT_RUNTIME.setStatusForUser(userId, UserStatus.ONLINE)
            const roomIds = roomsDtos.map(r => r.id)
            const states = CHAT_RUNTIME.getRoomsStates(roomIds)
            socket.emit('CHAT_STATE', Response.compose(states))
            // Broadcast to all users rooms states
            states.forEach(room => {
              socket.to(room.roomId).emit('CHAT_STATE', Response.compose(states))
            })
          })


        // const data = _roomConverter.toDTOs(rooms);
        // console.log('ROOMS', data);
        // socket.emit('FETCH_USER_ROOMS_RESPONSE', Response.compose(data))
        // respond(Response.compose(data))
      })

    // Fetch users room
    // roomRepository.getUsersByRoom(roomId).then(users => {
    //   const data = _userConverter.toDTOs(users)
    //   console.log('data', data)
    //   // socket.emit('FETCH_ROOM_USERS_RESPONSE', Response.compose(data))
    //   respond(Response.compose(data))
    // })

    // // Fetch room messages
    // roomRepository.getRoomMessages(roomId).then(messages => {
    //   const data = _messageConverter.toDTOs(messages)
    //   // console.log('data', data)
    //   // socket.emit('FETCH_ROOM_MESSAGES_RESPONSE', Response.compose(data))
    //   respond(Response.compose(data))
    // })
  })

  /**
   * When user signin, load all rooms where the user connected
   */
  // socket.on('FETCH_USER_ROOMS', (userId, respond: Function) => {
  //   console.log('FETCH_USER_ROOMS...');
  //   roomRepository.getRoomsByUser(userId)
  //     .then((rooms: Room[]) => {
  //       rooms.forEach(room => {
  //         // Join each rooms
  //         socket.join(room._id);
  //       });
  //       const data = _roomConverter.toDTOs(rooms);
  //       // console.log('ROOMS', data);
  //       // socket.emit('FETCH_USER_ROOMS_RESPONSE', Response.compose(data))
  //       respond(Response.compose(data))
  //     });
  // })

  // socket.on('FETCH_ROOM_USERS', (roomId, respond: Function) => {
  //   console.log('FETCH_ROOM_USERS...')
  //   roomRepository.getUsersByRoom(roomId).then(users => {
  //     const data = _userConverter.toDTOs(users)
  //     console.log('data', data)
  //     // socket.emit('FETCH_ROOM_USERS_RESPONSE', Response.compose(data))
  //     respond(Response.compose(data))
  //   })
  // })

  // socket.on('FETCH_ROOM_MESSAGES', (roomId, respond: Function) => {
  //   console.log('FETCH_ROOM_MESSAGES...');
  //   roomRepository.getRoomMessages(roomId).then(messages => {
  //     const data = _messageConverter.toDTOs(messages)
  //     // console.log('data', data)
  //     // socket.emit('FETCH_ROOM_MESSAGES_RESPONSE', Response.compose(data))
  //     respond(Response.compose(data))
  //   })
  // })

  socket.on('CREATE_ROOM', (obj, respond: Function) => {
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
        // socket.emit('CREATE_ROOM_RESPONSE', Response.compose(data))
        respond(Response.compose(data))
      })
    })
  });

  socket.on('GENERATE_JOIN_CODE', (roomId: string, respond: Function) => {
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
        if (isOk) data = { token: token.token }
        // socket.emit('GENERATE_JOIN_CODE_RESPONSE', Response.compose(data, isOk))
        respond(Response.compose(data, isOk))
      })
    })
    console.log('Generated token = ', genToken);
  })

  socket.on('JOIN_ROOM', (data: { userId: string, token: string }, respond: Function) => {
    roomRepository.getByToken(data.token).then((room: Room) => {
      console.log('Join room, response todo', room)
      const tryToken = room.join_tokens.find(t => t.token === data.token)
      const isTokenExpired = new Date(tryToken.expireAt) < new Date()
      console.log('is token expired', isTokenExpired);
      if (isTokenExpired) {
        // socket.emit('JOIN_ROOM_RESPONSE', Response.compose({}, false, ['E_JOIN_TOKEN_EXPIRED']))
        respond(Response.compose({}, false, ['E_JOIN_TOKEN_EXPIRED']))
      } else {
        roomRepository.storeRelationUserRoom(data.userId, room._id).then(() => {
          socket.join(room._id)
          const res = _roomConverter.toDTO(room)
          // Send room info to user
          // socket.emit('JOIN_ROOM_RESPONSE', Response.compose(res))
          respond(Response.compose(res))
          userRepository.getById(data.userId).then(user => {
            const joiningUser = _userConverter.toDTO(user)
            // Send user data to users connected to the room
            socket.broadcast.to(room._id).emit('USER_JOINING', Response.compose({ roomId: room._id, user: joiningUser }))
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

  // ! TODO: Remove because a route is available with Express
  // socket.on('UPDATE_USER', (_user: UserDTO, respond) => {
  //   if (!_user || !_user.id) {
  //     // socket.emit('UPDATE_USER_RESPONSE', Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
  //     respond(Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
  //     return;
  //   }
  //   userRepository.getById(_user.id).then(user => {
  //     const entity = _userConverter.toEntity(_user)
  //     user.email = _user.email;
  //     user.avatar = _user.avatar;
  //     user.username = _user.username;
  //     // console.log('user', user);
  //     // console.log('_user', _user);
  //     userRepository.update(user).then((isOK) => {
  //       if (isOK) {
  //         // socket.emit('UPDATE_USER_RESPONSE', Response.compose())
  //         respond(Response.compose())
  //       } else {
  //         respond(Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
  //       }
  //     });
  //   })

  // })

})
