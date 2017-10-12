/* global indexedDB, location, BroadcastChannel */

/*
 * Request to Promise transformer
 */
function rtop (request) {
  return new Promise(function (resolve, reject) {
    request.onerror = function (event) {
      reject(new Error(event.target.errorCode))
    }
    request.onblocked = function () {
      location.reload()
    }
    request.onsuccess = function (event) {
      resolve(event.target.result)
    }
  })
}

function openDB (room) {
  let request = indexedDB.open(room, 1)
  request.onupgradeneeded = function (event) {
    let db = event.target.result
    if (db.objectStoreNames.contains('model')) {
      db.deleteObjectStore('messages')
      db.deleteObjectStore('model')
    }
    db.createObjectStore('messages', {autoIncrement: true})
    db.createObjectStore('model')
  }
  return rtop(request)
}

const PREFERRED_TRIM_SIZE = 500

export default function extendInexedDBPersistence (Y) {
  class IndexedDBPersistence extends Y.AbstractPersistence {
    constructor (y, opts) {
      super(y, opts)
      let room = this.y.options.connector.room
      this.db = null
      this.computedInitialContent = false
      this.bufferedMessagesBeforeInitialContent = []
      this._db = openDB(room)
      this._db.then(db => {
        this.db = db
      })
      this.channel = new BroadcastChannel('__yjs__' + room)
      this.channel.addEventListener('message', e => {
        let message = e.data
        if (this.computedInitialContent) {
          this.mutualExcluse(() => {
            this.y.connector.receiveMessage('indexeddb', message, true)
          })
        } else {
          this.bufferedMessagesBeforeInitialContent.push(message)
        }
      })
      var token = true
      this.mutualExcluse = function (f) {
        if (token) {
          token = false
          try {
            f()
          } catch (e) {
            token = true
            throw new Error(e)
          }
          token = true
        }
      }
    }

    destroy () {
      this.db.close()
    }

    saveToMessageQueue (message) {
      this.channel.postMessage(message)
      let t = this.db.transaction(['messages'], 'readwrite')
      let messagesStore = t.objectStore('messages')
      messagesStore.put(message)
      let cntP = rtop(messagesStore.count())
      super.saveToMessageQueue(message)
      cntP.then(cnt => {
        if (cnt >= PREFERRED_TRIM_SIZE) {
          this.persistDB()
        }
      })
    }

    saveOperations (message) {
      this.mutualExcluse(() => {
        super.saveOperations(message)
      })
    }

    retrieveContent () {
      return this._db.then(function (db) {
        let t = db.transaction(['messages', 'model'], 'readonly')
        let modelStore = t.objectStore('model')
        let messagesStore = t.objectStore('messages')

        return Promise.all([rtop(modelStore.get(0)), rtop(messagesStore.getAll())])
      }).then(([model, messages]) => {
        if (model != null) {
          this.y.db.requestTransaction(function () {
            this.fromBinary(model)
          })
        }
        this.mutualExcluse(() => {
          messages.forEach(m => {
            this.y.connector.receiveMessage('indexeddb', m, true)
          })
        })
        this.computedInitialContent = true
        if (model != null || messages.length > 0) {
          this.y.db.setUserId(Y.utils.generateUserId())
        }
      })
    }

    persistDB () {
      if (!this.computedInitialContent) {
        return Promise.reject(new Error('Unable to persistDB(). The content is not yet initialized via retrieveContent!'))
      }
      this.log('Room %s: Persisting Yjs model to Redis', this.y.options.connector.room)
      let db = this.db

      return new Promise((resolve, reject) => {
        this.y.db.requestTransaction(function () {
          let t = db.transaction(['messages', 'model'], 'readwrite')
          let messagesStore = t.objectStore('messages')
          let cntRequest = messagesStore.count()
          cntRequest.onsuccess = () => {
            if (cntRequest.result > 0) {
              let modelStore = t.objectStore('model')
              let buffer = this.toBinary()
              modelStore.put(buffer, 0)
              messagesStore.clear()
            }
            resolve()
          }
          cntRequest.onerror = function (e) {
            reject(e.target.errorCode)
          }
        })
      })
    }
  }
  Y.extend('indexeddb', IndexedDBPersistence)
}
