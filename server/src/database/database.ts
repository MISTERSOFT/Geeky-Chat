import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as RelationalPouch from 'relational-pouch';
PouchDB.plugin(RelationalPouch);
PouchDB.plugin(PouchDBFind);
import * as NodeCouchDB from 'node-couchdb';
import { Message, User } from '../entities';
import { Env } from '../core';

class Database {
  readonly INSTANCE = new NodeCouchDB({
    auth: {
      user: 'root',
      pass: 'root'
    }
  })
  // protected readonly DB: any = new PouchDB(this.DATABASE_NAME);
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
  readonly DOC_TYPES = {
    user: 'user',
    message: 'message',
    room: 'room',
    relations: {
      users_rooms: 'users_rooms'
    },
    join_room_token: 'join_room_token'
  };
  constructor() {
    this.INSTANCE.listDatabases()
      .then((databases: string[]) => {
        databases.forEach(() => {
          const exist = databases.findIndex(db => db === Env.DATABASE_NAME)
          if (exist === -1) {
            this.INSTANCE.createDatabase(Env.DATABASE_NAME)
          }
        })
        // Object.keys(this.DATABASES).forEach((db) => {
        //   const exist = dbs.findIndex(db => db === this.DATABASES[db])
        //   if (exist === -1) {
        //     this.INSTANCE.createDatabase(db)
        //   }
        // })
      })
      .catch(err => {
        console.log('error catched', err);
      });
    // this.DB.setSchema([
    //   {
    //     singular: this.KEYS.user,
    //     plural: this.KEYS.users,
    //     relations: {
    //       messages: { hasMany: this.KEYS.message },
    //       rooms: { hasMany: this.KEYS.room }
    //     }
    //   },
    //   {
    //     singular: this.KEYS.message,
    //     plural: this.KEYS.messages,
    //     relations: {
    //       user: { belongsTo: this.KEYS.user },
    //       room: { belongsTo: this.KEYS.room }
    //     }
    //   },
    //   {
    //     singular: this.KEYS.room,
    //     plural: this.KEYS.rooms,
    //     relations: {
    //       users: { hasMany: this.KEYS.user },
    //       messages: { hasMany: this.KEYS.message },
    //       owner: { belongsTo: this.KEYS.owner }
    //     }
    //   },
    //   {
    //     singular: this.KEYS.owner,
    //     plural: this.KEYS.owners,
    //     documentType: this.KEYS.user
    //   },
    //   {
    //     singular: this.KEYS.join_token,
    //     plural: this.KEYS.join_tokens,
    //     relations: {
    //       room: { belongsTo: this.KEYS.room }
    //     }
    //   }
    // ]);
  }
}

export const database = new Database();
