import { Database } from './database';
import { messageRepository } from './message.repository';
import { Room, RoomDOC, User, MessageDOC, Message } from '../entities';
import { userRepository } from '.';

export class RoomRepository extends Database {
  constructor() {
    super();
  }
  store(obj): Promise<Room> {
    return this.DB.rel.save(this.KEYS.room, obj)
    .then(docs => {
      const roomDoc: RoomDOC = docs.rooms[0]
      const room = new Room()
      room.id = roomDoc.id
      room.name = roomDoc.name
      room.name_slug = roomDoc.name_slug
      room.owner = roomDoc.owner

      return userRepository.getUsersByRoom(room.id)
      .then(users => {
        room.users = users
        return room
      });
    });
  }
  getById(roomId): Promise<Room> {
    return this.DB.rel.find(this.KEYS.room, roomId)
    .then((docs) => {
      if (docs.rooms.length !== 1) {
        return null
      }
      const roomDoc: RoomDOC = docs.rooms[0]
      const room = new Room()
      room.id = roomDoc.id
      room.name = roomDoc.name
      room.name_slug = roomDoc.name_slug
      room.owner = roomDoc.owner
      docs.users.forEach((user: User) => {
        if (roomDoc.users.findIndex(u => u === user.id) !== -1) {
          room.users.push(user);
        }
      })
      return room
    })
  }
  getRooms(): Promise<Room[]> {
    return this.DB.rel.find(this.KEYS.room)
    .then(docs => {
      const rooms: Room[] = [];
      docs.rooms.forEach((roomDoc: RoomDOC) => {
        const room = new Room();
        room.id = roomDoc.id;
        room.name = roomDoc.name;
        room.name_slug = roomDoc.name_slug;
        room.owner = roomDoc.owner;

        docs.users.forEach((user: User) => {
          if (roomDoc.users.findIndex(u => u === user.id) !== -1) {
            room.users.push(user);
          }
        });

        rooms.push(room);
      });

      return rooms;
    })
    .then((rooms: Room[]) => {
      return messageRepository.getAllMessages()
      .then((messages: Message[]) => {
        rooms.forEach(room => {
          room.messages = messages.filter(msg => room.id === msg.room.id);
        });
        return rooms;
      });
    });
  }
  getRoomsByUser(userId: string): Promise<Room[]> {
    // return this.DB.rel.findHasMany(this.KEYS.room, this.KEYS.user, userId);
    return this.DB.rel.find(this.KEYS.room)
    .then(docs => {
      // console.log('getAllRoomsByUser', docs);
      // 1. Fetch all user's room
      const rooms: Room[] = [];
      docs.rooms.forEach((roomDoc: RoomDOC) => {
        if (roomDoc.users.findIndex(user => user === userId) !== -1) {
          // 2. Fetch all messages for each user's room
          const room: Room = new Room();
          room.id = roomDoc.id;
          room.name = roomDoc.name;
          room.name_slug = roomDoc.name_slug;
          room.owner = roomDoc.owner;
          // room.messages = [];
          // docs.messages.forEach((messageDoc: MessageDOC) => {
          //   if (messageDoc.room === room.id) {
          //     const message = new Message();
          //     message.id = messageDoc.id;
          //     message.text = messageDoc.text;
          //     message.createdAt = messageDoc.createdAt;
          //     room.messages.push(message);
          //   }
          // })
          // Fetch all users connected to each rooms
          docs.users.forEach((user: User) => {
            if (roomDoc.users.findIndex(u => u === user.id) !== -1) {
              room.users.push(user);
            }
          })
          rooms.push(room);
        }
      });
      return rooms;
      // 3. Fetch all users connected to each rooms
      // return docs.rooms.forEach((roomDoc: RoomDOC) => {
      //   if (roomDoc.users.findIndex(user => user === userId) !== -1) {
      //     const room: Room = docs.users.find((user: User) => user.id === userId);
      //     rooms.push(roomDoc);
      //   }
      // });
    })
    .then((rooms: Room[]) => {
      return messageRepository.getAllMessages().then((messages: Message[]) => {
        rooms.forEach(room => {
          room.messages = messages.filter(msg => {
            return room.id === msg.room.id;
          })
        });
        return rooms;
      })
      // rooms.forEach((room: Room) => {
      //   messageRepository.getMessagesByRoom(room.id)
      //   .then((messages: Message[]) => {
      //     room.messages = messages;
      //   })
      // })
    })
  }
}

export const roomRepository = new RoomRepository();
