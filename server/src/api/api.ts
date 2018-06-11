import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { MessageConverter, RoomConverter, UserConverter } from '../converters';
import { Env, Response, Tools } from '../core';
import { userRepository } from '../database';

const app = express()
const _userConverter = new UserConverter()
const _messageConverter = new MessageConverter()
const _roomConverter = new RoomConverter()

//#region Express Middlewares

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Pass to next layer of middleware
  next();
});

//#endregion

//#region Express server routes

app.post('/signin', (req, res) => {
  console.log('Signin...')
  const body = req.body
  const model = _userConverter.toEntity(body)
  userRepository.isUserExist(model).then(user => {
    if (user) {
      const data = Tools.toPlainObjectToken(user)
      var token = jwt.sign(data, Env.SECRET_KEY, { expiresIn: Env.TOKEN_EXPIRATION });
      res.status(200).type('json').end(JSON.stringify(token))
    } else {
      // No user found
      const data = Response.compose({}, false, ['E_INVALID_USER_CREDENTIALS'])
      res.status(200).type('json').end(JSON.stringify(data))
    }
  })
})

app.post('/signup', (req, res) => {
  // TODO: Create express route for Signup
  const userInfo = req.body
  const model = _userConverter.toEntity(userInfo);
  // Create the user
  userRepository.storeUser(model).then(isOK => {
    if (isOK) {
      const data = Response.compose()
      res.status(200).type('json').end(JSON.stringify(data))
    } else {
      const data = Response.compose({}, false, ['E_SIGNIN_ERROR'])
      res.status(200).type('json').end(JSON.stringify(data))
    }
  })
})

app.get('/user/:id', (req, res) => {
  const userId = req.params.id
  userRepository.getById(userId).then(user => {
    const dto = _userConverter.toDTO(user)
    const data = Response.compose(dto)
    res.status(200).type('json').end(JSON.stringify(data))
  }).catch(e => {
    const data = Response.compose({}, false, ['E_SERVER_ERROR'])
    res.status(500).type('json').end(JSON.stringify(data))
  })
})

app.put('/user', (req, res) => {
  console.log('update user with PUT...')
  let error;
  const _user = req.body
  if (!_user || !_user.id) {
    // socket.emit('UPDATE_USER_RESPONSE', Response.compose({}, false, ['E_UPDATE_USER_ERROR']))
    error = Response.compose({}, false, ['E_UPDATE_USER_ERROR'])
    res.status(404).type('json').end(JSON.stringify(error))
    return
  }
  userRepository.getById(_user.id).then(user => {
    const entity = _userConverter.toEntity(_user)
    user.email = _user.email
    user.avatar = _user.avatar
    user.username = _user.username
    // console.log('user', user);
    // console.log('_user', _user);
    userRepository.update(user).then((isOK) => {
      if (isOK) {
        // socket.emit('UPDATE_USER_RESPONSE', Response.compose())
        res.status(200).type('json').end(JSON.stringify(Response.compose()))
      } else {
        error = Response.compose({}, false, ['E_UPDATE_USER_ERROR'])
        res.status(404).type('json').end(JSON.stringify(error))
      }
    })
  })
})

//#endregion

export const API = app;
