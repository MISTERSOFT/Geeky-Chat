const PouchDB = require('pouchdb')
PouchDB.plugin(require('relational-pouch'))

class Database {
    constructor() {
        this.databaseName = 'geekychat'
        this.collections = {
            users: 'users',
            user: 'user',
            messages: 'messages',
            message: 'message'
        }
        // this.dbUrl = 'http://localhost:3001/'
        this.db = new PouchDB(this.databaseName)

        this.db.setSchema([
            {
                singular: this.collections.user,
                plural: this.collections.users,
                relations: {
                    messages: {
                        hasMany: this.collections.message
                    }
                }
            },
            {
                singular: this.collections.message,
                plural: this.collections.messages,
                relations: {
                    user: {
                        belongsTo: this.collections.user
                    }
                }
            }
        ])
    }

    getMessages() {
        return this.db.rel.find(this.collections.message);
        // return this.db.allDocs({
        //     include_docs: true,
        //     startkey: this.collections.messages,
        //     endkey: this.collections.messages + '\uffff'
        // })
        // .then(result => {
        //     console.log('# Fetch messages result:', result)
        //     const messages = []
        //     result.rows.forEach(message => messages.push(message))

        //     return Promise.resolve(messages)
        // })
        // .catch(error => Promise.reject(error))
    }

    storeMessage(obj) {
        return this.db.rel.save(this.collections.user, obj)
        // return this.db.put(obj)
        // .then(result => {
        //     if (result.ok) {
        //         console.log('# Message added', result.id)
        //         return Promise.resolve(result)
        //     }
        // })
        // .catch(error => {
        //     console.log('Error happened, the message couln\'t be added !', error);
        //     return Promise.reject({
        //         success: false,
        //         message: 'Error happened, the message couln\'t be added !',
        //         error: error
        //     })
        // })
    }

    getUser(user) {
        return this.db.rel.find(this.collections.user)
        .then(response => {
            const userData = response.users.find(u => u.email === user.email && u.password === user.password)
            return {user: userData, founded: userData !== undefined}
        })
    }

    storeUser(obj) {
        return this.db.rel.save(this.collections.user, obj)
    }
}

module.exports = new Database()