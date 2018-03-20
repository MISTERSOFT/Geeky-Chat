import * as PouchDB from 'pouchdb';
import * as RelationalPouch from 'relational-pouch';
PouchDB.plugin(RelationalPouch);
import { Message, User } from '../entities';

export class Database {
  protected readonly DATABASE_NAME = 'geekychat';
  protected readonly DB: any = new PouchDB(this.DATABASE_NAME);
  protected readonly KEYS = {
    users: 'users',
    user: 'user',
    messages: 'messages',
    message: 'message',
    rooms: 'rooms',
    room: 'room',
    owners: 'owners',
    owner: 'owner',
    join_tokens: 'join_tokens',
    join_token: 'join_token'
  };
  constructor() {
    this.DB.setSchema([
      {
        singular: this.KEYS.user,
        plural: this.KEYS.users,
        relations: {
          messages: { hasMany: this.KEYS.message },
          rooms: { hasMany: this.KEYS.room }
        }
      },
      {
        singular: this.KEYS.message,
        plural: this.KEYS.messages,
        relations: {
          user: { belongsTo: this.KEYS.user },
          room: { belongsTo: this.KEYS.room }
        }
      },
      {
        singular: this.KEYS.room,
        plural: this.KEYS.rooms,
        relations: {
          users: { hasMany: this.KEYS.user },
          messages: { hasMany: this.KEYS.message },
          owner: { belongsTo: this.KEYS.owner }
        }
      },
      {
        singular: this.KEYS.owner,
        plural: this.KEYS.owners,
        documentType: this.KEYS.user
      },
      {
        singular: this.KEYS.join_token,
        plural: this.KEYS.join_tokens,
        relations: {
          room: { belongsTo: this.KEYS.room }
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
