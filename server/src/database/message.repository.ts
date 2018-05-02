import { database } from './database';
import { Message, MessageDOC } from '../entities';
import { Env } from '../core'
class MessageRepository {
  constructor() { }

  getMessagesByRoom(roomId: string) {
    // return this.DB.rel.find(this.KEYS.message)
    //   .then((docs) => {
    //     const messages: Message[] = []
    //     docs.messages
    //     .filter((message: MessageDOC) => message.room === roomId)
    //     .forEach((message: Message) => {
    //       message.user = docs.users.find(u => u.id === message.user)
    //       messages.push(message)
    //     })
    //     console.log(messages);
    //     // return docs.messages
    //     return messages
    //   })
  }
  getAllMessages() {
    // return this.DB.rel.find(this.KEYS.message)
    //   .then((docs) => {
    //     console.log('get all msgs', docs);
    //     const messages: Message[] = []
    //     docs.messages
    //     .forEach((messageDoc: MessageDOC) => {
    //       const message = new Message();
    //       message.id = messageDoc.id;
    //       message.text = messageDoc.text;
    //       message.createdAt = messageDoc.createdAt;
    //       message.room = docs.rooms.find(r => r.id === messageDoc.room);
    //       message.user = docs.users.find(u => u.id === messageDoc.user)
    //       messages.push(message)
    //     })
    //     console.log(messages);
    //     // return docs.messages
    //     return messages
    //   })
  }
  storeMessage(newMessage: MessageDOC) {
    return database.INSTANCE.uniqid().then(ids => {
      const uuid = ids[0]
      newMessage._id = uuid
      console.log('MESSAGE TO STORE', newMessage)
      return database.INSTANCE.insert(Env.DATABASE_NAME, newMessage).then(responseMsg => {
        console.log('Message inserted - data', responseMsg.data)
        if (responseMsg.data.ok) {
          const url = Env.USERS_VIEW_URL + 'by_id'
          const viewUrlParams = {
            include_docs: true,
            key: newMessage.user_id
          }
          return database.INSTANCE.get(Env.DATABASE_NAME, url, viewUrlParams)
            .then(responseUser => {
              console.log('fetch user for message', responseUser.data.rows)
              const message: Message = {
                _id: newMessage._id,
                _rev: responseMsg.data.rev,
                created_at: newMessage.created_at,
                text: newMessage.text,
                user: responseUser.data.rows[0].doc,
                room_id: newMessage.room_id
              }
              return message
            })
        }
        return false
      }, err => {
        console.log('Not able to insert', err)
        // either request error occured
        // ...or err.code=EDOCCONFLICT if document with the same id already exists
      })
    })
    // return this.DB.rel.save(this.KEYS.message, obj)
    // .then(docs => {
    //   if (docs.messages.length !== 1) {
    //     return null
    //   }
    //   const msgDoc: MessageDOC = docs.messages[0]
    //   const message = new Message()
    //   message.id = msgDoc.id;
    //   message.createdAt = msgDoc.createdAt;
    //   message.text = msgDoc.text;
    //   return message;
    // })
  }
}

export const messageRepository = new MessageRepository();
