import { Database } from './database';
import { Message, MessageDOC } from '../entities';
class MessageRepository extends Database {
  constructor() {
    super();
  }

  getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.DB.rel.find(this.KEYS.message)
      .then((docs) => {
        const messages: Message[] = []
        docs.messages
        .filter((message: MessageDOC) => message.room === roomId)
        .forEach((message: Message) => {
          message.user = docs.users.find(u => u.id === message.user)
          messages.push(message)
        })
        console.log(messages);
        // return docs.messages
        return messages
      })
  }
  getAllMessages(): Promise<Message[]> {
    return this.DB.rel.find(this.KEYS.message)
      .then((docs) => {
        console.log('get all msgs', docs);
        const messages: Message[] = []
        docs.messages
        .forEach((messageDoc: MessageDOC) => {
          const message = new Message();
          message.id = messageDoc.id;
          message.text = messageDoc.text;
          message.createdAt = messageDoc.createdAt;
          message.room = docs.rooms.find(r => r.id === messageDoc.room);
          message.user = docs.users.find(u => u.id === messageDoc.user)
          messages.push(message)
        })
        console.log(messages);
        // return docs.messages
        return messages
      })
  }
  storeMessage(obj: MessageDOC): Promise<Message> {
    return this.DB.rel.save(this.KEYS.message, obj)
    .then(docs => {
      if (docs.messages.length !== 1) {
        return null
      }
      const msgDoc: MessageDOC = docs.messages[0]
      const message = new Message()
      message.id = msgDoc.id;
      message.createdAt = msgDoc.createdAt;
      message.text = msgDoc.text;
      return message;
    })
  }
}

export const messageRepository = new MessageRepository();
