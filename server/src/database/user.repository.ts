import { RuntimeUserState } from '../core';
import { Env } from '../core/environment';
import { User } from '../entities';
import { database } from './database';

export class UserRepository {
  // * METHOD WORKS
  isUserExist(user: User) {
    const mangoQuery = {
      selector: {
        $and: [
          {
            doc_type: { $eq: database.DOC_TYPES.user }
          },
          {
            email: { $eq: user.email }
          },
          {
            password: { $eq: user.password }
          }
        ]
      }
    }
    return database.INSTANCE.mango(Env.DATABASE_NAME, mangoQuery, {}).then(response => {
      // console.log('User exist - data', response.data.docs)
      const docs = response.data.docs
      return (docs.length === 1) ? docs[0] : null
    }, err => {
      console.log('Not able to insert', err)
      // either request error occured
      // ...or err.code=EDOCCONFLICT if document with the same id already exists
    });
    // return this.DB.rel.find(this.KEYS.user)
    //   .then(response => {
    //     const userData = response.users.find(u => u.email === user.email && u.password === user.password)
    //     return { user: userData, founded: userData !== undefined }
    //   })
  }
  // * METHOD WORKS
  storeUser(newUser: User) {
    return database.INSTANCE.uniqid().then(ids => {
      const uuid = ids[0]
      newUser._id = uuid
      console.log('USER TO STORE', newUser)
      return database.INSTANCE.insert(Env.DATABASE_NAME, newUser).then(response => {
        console.log('User inserted - data', response.data)
        return response.data.ok
      }, err => {
        console.log('Not able to insert', err)
        // either request error occured
        // ...or err.code=EDOCCONFLICT if document with the same id already exists
      })
    })
    // return this.DB.rel.save(this.KEYS.user, obj)
  }
  getById(userId: string): Promise<User> {
    return database.INSTANCE.get(Env.DATABASE_NAME, userId)
      .then(response => {
        // console.log('getUserById', response.data)
        return response.data;
      });
    // return this.DB.rel.find(this.KEYS.user, userId)
    // .then(docs => {
    //   return (docs.users.length === 1) ? docs.users[0] : null;
    // });
  }

  getUsersByRoomForRuntime(roomId: string): Promise<{roomId: string, values: RuntimeUserState[]}> {
    const url = Env.USERS_VIEW_URL + 'by_room_for_runtime'
    const viewUrlParams = {
      include_docs: false,
      key: roomId
    }
    return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
      .then(response => {
        // console.log('getUsersByRoomForRuntime', response.data.rows)
        return {
          roomId: roomId,
          values: response.data.rows.map(doc => new RuntimeUserState(doc.value))
        }
      })
  }

  update(user: User): Promise<boolean> {
    return database.INSTANCE.update(Env.DATABASE_NAME, user).then(response => response.data.ok);
  }

  // ! TODO: MAYBE REMOVE THIS BECAUSE NO NEED WITH COUCHDB
  getUsersByRoom(roomId: string) {
    return Promise.all([
      database.INSTANCE.get(Env.DATABASE_NAME, Env.USERS_VIEW_URL, {}),
      database.INSTANCE.get(Env.DATABASE_NAME, Env.ROOMS_VIEW_URL, {})
    ]).then(response => {
      const usersView = response[0]
      const roomsView = response[1]
      // (data, headers, status)
      console.log('getUsersByRoom - users', usersView)
      console.log('getUsersByRoom - rooms', roomsView)
      // data is json response
      // status is statusCode number
    }, err => {
      console.log('Not able to getUsersByRoom', err)
      // either request error occured
      // ...or err.code=EDOCCONFLICT if document with the same id already exists
    });
    // return this.DB.rel.find(this.KEYS.room).then(docs => {
    //   const users: User[] = []
    //   const room: RoomDOC = docs.rooms.find((roomDoc: RoomDOC) => roomDoc.id === roomId)
    //   if (!room) {
    //     return []
    //   }
    //   docs.users.forEach((user: User) => {
    //     if (room.users.findIndex(u => u === user._id) !== -1) {
    //       users.push(user)
    //     }
    //   })
    //   return users
    // })
  }
}

export const userRepository = new UserRepository();
