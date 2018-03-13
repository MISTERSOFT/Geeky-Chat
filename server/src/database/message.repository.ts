import { Database } from './database';
import { Message } from '../entities';
class MessageRepository extends Database {
  constructor() {
    super();
  }

  getMessages() {
    return this.DB.rel.find(this.KEYS.message)
      .then((docs) => {
        const messages: Message[] = []
        docs.messages.forEach(message => {
          message.user = docs.users.find(u => u.id === message.user)
          messages.push(message)
        })
        console.log(messages);
        // return docs.messages
        return messages
      })
  }
  storeMessage(obj: Message) {
    return this.DB.rel.save(this.KEYS.message, obj)
  }
}

export const messageRepository = new MessageRepository();
