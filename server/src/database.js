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
        return this.db.rel.find(this.collections.message)
        .then((docs) => {
            console.log('docs', docs)
            docs.messages.map(message => {
                message.user = docs.users.find(u => u.id === message.user)
            })
            return docs.messages
        })
    }

    storeMessage(obj) {
        return this.db.rel.save(this.collections.message, obj)
    }

    isUserExist(user) {
        return this.db.rel.find(this.collections.user)
        .then(response => {
            const userData = response.users.find(u => u.email === user.email && u.password === user.password)
            return {user: userData, founded: userData !== undefined}
        })
    }

    storeUser(obj) {
        return this.db.rel.save(this.collections.user, obj)
    }

    findUserById(userId) {
        return this.db.rel.find(this.collections.user, userId)
    }
}

module.exports = new Database()