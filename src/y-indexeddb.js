/* global indexedDB, location, BroadcastChannel */

import AbstractPersistence from '../../yjs/src/Persistence.js'
import BinaryDecoder from '../../yjs/src/Binary/Decoder.js'
import { integrateRemoteStructs } from '../../yjs/src/MessageHandler/integrateRemoteStructs.js'

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
      db.deleteObjectStore('updates')
      db.deleteObjectStore('model')
    }
    db.createObjectStore('updates', {autoIncrement: true})
    db.createObjectStore('model')
  }
  return rtop(request)
}

const PREFERRED_TRIM_SIZE = 500

export default class IndexedDBPersistence extends AbstractPersistence {
  constructor (y, opts) {
    super(opts)
  }

  init (y) {
    let cnf = this.ys.get(y)
    let room = y.room
    cnf.db = null
    cnf._db = openDB(room)
    cnf._db.then(db => {
      cnf.db = db
    })
    cnf.channel = new BroadcastChannel('__yjs__' + room)
    cnf.channel.addEventListener('message', e => {
      integrateRemoteStructs(y, new BinaryDecoder(e))
    })
    var token = true
    cnf.mutualExcluse = function (f) {
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

  deinit (y) {
    let cnf = this.ys.get(y)
    cnf.db.close()
    super.deinit(y)
  }

  saveUpdate (y, update) {
    let cnf = this.ys.get(y)
    cnf.channel.postMessage(update)
    let t = cnf.db.transaction(['updates'], 'readwrite')
    let updatesStore = t.objectStore('updates')
    updatesStore.put(update)
    let cntP = rtop(updatesStore.count())
    cntP.then(cnt => {
      if (cnt >= PREFERRED_TRIM_SIZE) {
        this.persist(y)
      }
    })
  }

  saveStruct (y, struct) {
    let cnf = this.ys.get(y)
    cnf.mutualExcluse(() => {
      super.saveStruct(y, struct)
    })
  }

  retrieve (y) {
    let cnf = this.ys.get(y)
    return cnf._db.then(function (db) {
      let t = db.transaction(['updates', 'model'], 'readonly')
      let modelStore = t.objectStore('model')
      let updatesStore = t.objectStore('updates')
      return Promise.all([rtop(modelStore.get(0)), rtop(updatesStore.getAll())])
    }).then(([model, updates]) => {
      cnf.mutualExcluse(() => {
        super.retrieve(y, model, updates)
      })
    })
  }

  persist (y) {
    let cnf = this.ys.get(y)
    let db = cnf.db
    let t = db.transaction(['updates', 'model'], 'readwrite')
    let updatesStore = t.objectStore('updates')
    return rtop(updatesStore.getAll())
    .then(function (updates) {
      // apply pending updates before deleting them
      AbstractPersistence.prototype.retrieve.call(this, y, null, updates)
      // get binary model
      let binaryModel = AbstractPersistence.prototype.persist.call(this, y)
      // delete all pending updates
      if (updates.length > 0) {
        let modelStore = t.objectStore('model')
        modelStore.put(binaryModel, 0)
        updatesStore.clear()
      }
    })
  }
}
