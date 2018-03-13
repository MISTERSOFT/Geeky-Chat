import * as PouchDB from 'pouchdb';
import * as RelationalPouch from 'relational-pouch';
import { Message, User } from '../entities';
PouchDB.plugin(RelationalPouch);

export class Database {
  protected readonly DATABASE_NAME = 'geekychat';
  protected readonly DB: any = new PouchDB(this.DATABASE_NAME);
  protected readonly KEYS = {
    users: 'users',
    user: 'user',
    messages: 'messages',
    message: 'message',
    rooms: 'rooms',
    room: 'room'
  };
  constructor() {
    this.DB.setSchema([
      {
        singular: this.KEYS.user,
        plural: this.KEYS.users,
        relations: {
          messages: { hasMany: this.KEYS.message }
        }
      },
      {
        singular: this.KEYS.message,
        plural: this.KEYS.messages,
        relations: {
          user: { belongsTo: this.KEYS.user }
        }
      },
      {
        singular: this.KEYS.room,
        plural: this.KEYS.rooms,
        relations: {
          users: { hasMany: this.KEYS.user },
          messages: { hasMany: this.KEYS.message }
        }
      }
    ]);
  }

  // getMessages() {
  //   return this.DB.rel.find(this.KEYS.message)
  //     .then((docs) => {
  //       const messages: Message[] = []
  //       docs.messages.forEach(message => {
  //         message.user = docs.users.find(u => u.id === message.user)
  //         messages.push(message)
  //       })
  //       console.log(messages);
  //       // return docs.messages
  //       return messages
  //     })
  // }

  // storeMessage(obj: Message) {
  //   return this.DB.rel.save(this.KEYS.message, obj)
  // }

  //#region Users
  // isUserExist(user: User) {
  //   return this.DB.rel.find(this.KEYS.user)
  //     .then(response => {
  //       const userData = response.users.find(u => u.email === user.email && u.password === user.password)
  //       return { user: userData, founded: userData !== undefined }
  //     })
  // }
  // storeUser(obj: User) {
  //   return this.DB.rel.save(this.KEYS.user, obj)
  // }
  // findUserById(userId: string) {
  //   return this.DB.rel.find(this.KEYS.user, userId)
  // }
  //#endregion
}
