import { Database } from './database';
import { JoinToken, JoinTokenDOC } from '../entities';
class JoinTokenRepository extends Database {
  constructor() {
    super();
  }
  store(token: JoinToken): Promise<JoinToken> {
    return this.DB.rel.save(this.KEYS.join_token, token).then(docs => {
      return docs.join_tokens
    })
  }
  findByToken(token: string) {
    const opts = {
      selector: { token: token }
    }
    this.DB.find(opts).then((docs) => {
      console.log('tokens docs', docs)
    })
  }
}

export const joinTokenRepository = new JoinTokenRepository()
