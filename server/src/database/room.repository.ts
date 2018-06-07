import { groupBy } from 'lodash';
import { Env } from '../core';
import { Message, MessageDOC, Room, RoomDOC, User, UserRoomRelation } from '../entities';
import { database } from './database';

export class RoomRepository {
  constructor() { }
  store(newRoom: Room): Promise<Room> {
    return database.INSTANCE.uniqid(2)
      .then(ids => {
        const uuid = ids[0]
        newRoom._id = uuid
        console.log('ROOM TO STORE', newRoom)
        return database.INSTANCE.insert(Env.DATABASE_NAME, newRoom).then(response => {
          if (response.data.ok) {
            // const relationUserRoom: UserRoomRelation = {
            //   _id: ids[1],
            //   doc_type: database.DOC_TYPES.relations.users_rooms,
            //   user_id: newRoom.owner,
            //   room_id: newRoom._id
            // }
            // database.INSTANCE.insert(Env.DATABASE_NAME, relationUserRoom)
            this.storeRelationUserRoom(newRoom.owner, newRoom._id)

            newRoom._rev = response.data.rev;
            return newRoom;
          }
          return false;
        }, err => {
          console.log('Not able to insert', err)
          // either request error occured
          // ...or err.code=EDOCCONFLICT if document with the same id already exists
        })
      })
  }
  getById(roomId): Promise<RoomDOC> { // : Promise<Room> {
    return database.INSTANCE.get(Env.DATABASE_NAME, roomId)
      .then(response => {
        return response.data
      })
  }
  getRoomMessages(roomId: string) {
    const url = Env.MESSAGES_VIEW_URL + 'by_room'
    const viewUrlParams = {
      include_docs: true,
      key: roomId
    }
    return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
      .then(response => {
        // console.log('getRoomMessages', response.data.rows)
        const grouped = groupBy(response.data.rows, 'id')
        const messages = []
        for (const id in grouped) {
          const user = grouped[id].find(item => item.doc.doc_type === database.DOC_TYPES.user).doc
          const msg: MessageDOC = grouped[id].find(item => item.doc.doc_type === database.DOC_TYPES.message).doc
          const message: Message = {
            _id: msg._id,
            _rev: msg._rev,
            created_at: msg.created_at,
            text: msg.text,
            room_id: msg.room_id,
            user: user
          }
          messages.push(message)
        }
        return messages
      })
  }
  getUsersByRoom(roomId: string) {
    const url = Env.USERS_VIEW_URL + 'by_room'
    const viewUrlParams = {
      include_docs: true,
      key: roomId
    }
    return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
      .then(response => {
        // console.log('getUsersByRoom', response.data.rows)
        const users = []
        response.data.rows.forEach(item => users.push(new User(item.doc)))
        return users
      })
  }
  getRoomsByUser(userId: string): Promise<Room[]> {
    const url = Env.ROOMS_VIEW_URL + 'by_user';
    const viewUrlParams = {
      include_docs: true,
      key: userId
    }
    return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
      .then(response => {
        // console.log('getRoomsByUser', response.data.rows)
        const rooms: Room[] = []
        response.data.rows.forEach(item => rooms.push(new Room(item.doc)))
        // console.log('BEFORE RETURN FETCH', rooms)
        return rooms
      })
  }
  update(room: RoomDOC) {
    return database.INSTANCE.update(Env.DATABASE_NAME, room)
      .then(response => {
        return response.data.ok
      })
  }
  getByToken(token: string) {
    const url = Env.ROOMS_VIEW_URL + 'by_token';
    const viewUrlParams = {
      include_docs: true,
      key: token
    }
    return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
      .then(response => {
        console.log('getByToken', response.data)
        let room
        if (response.data.rows.length === 1) {
          room = new Room(response.data.rows[0].doc)
        }
        console.log('BEFORE RETURN FETCH', room)
        return room
      })
  }

  storeRelationUserRoom(userId: string, roomId: string) {
    return database.INSTANCE.uniqid().then(id => {
      const relationUserRoom: UserRoomRelation = {
        _id: id[0],
        doc_type: database.DOC_TYPES.relations.users_rooms,
        user_id: userId,
        room_id: roomId
      }
      console.log('relation', id[0])
      return database.INSTANCE.insert(Env.DATABASE_NAME, relationUserRoom)
    })
  }
}

export const roomRepository = new RoomRepository();
