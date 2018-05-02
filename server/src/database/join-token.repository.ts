import { database } from './database';
// import { JoinRoomToken, JoinTokenDOC } from '../entities';
class JoinTokenRepository {
  constructor() { }
  store(token: any) { //: Promise<JoinToken> {
    // return this.DB.rel.save(this.KEYS.join_token, token)
    // .then(docs => {
    //   return docs.join_tokens[0]
    // })
  }
  findByToken(token: string) { // : Promise<JoinToken> {
    // return this.DB.rel.find(this.KEYS.join_token)
    // .then((docs) => {
    //   return docs.join_tokens.find((t: JoinToken) => t.token === token)
    // })
  }
}

export const joinTokenRepository = new JoinTokenRepository()
