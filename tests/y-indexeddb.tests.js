
import * as Y from 'yjs'
import { IndexedDBPersistence, clearDocument, PREFERRED_TRIM_SIZE, fetchUpdates } from '../src/y-indexeddb.js'
import * as t from 'lib0/testing.js'
import * as promise from 'lib0/promise.js'

/**
 * @param {t.TestCase} tc
 */
export const testIdbUpdateAndMerge = async tc => {
  await clearDocument(tc.testName)
  const doc1 = new Y.Doc()
  const arr1 = doc1.getArray('t')
  const doc2 = new Y.Doc()
  const arr2 = doc2.getArray('t')
  arr1.insert(0, [0])
  const persistence1 = new IndexedDBPersistence(tc.testName, doc1)
  persistence1._storeTimeout = 0
  await persistence1.whenSynced
  arr1.insert(0, [1])
  const persistence2 = new IndexedDBPersistence(tc.testName, doc2)
  persistence2._storeTimeout = 0
  await persistence2.whenSynced
  t.assert(arr2.length === 2)
  for (let i = 2; i < PREFERRED_TRIM_SIZE + 1; i++) {
    arr1.insert(i, [i])
  }
  await promise.wait(100)
  await fetchUpdates(persistence2)
  t.assert(arr2.length === PREFERRED_TRIM_SIZE + 1)
  t.assert(persistence1._dbsize === 1) // wait for dbsize === 0. db should be concatenated
}

/**
 * @param {t.TestCase} tc
 */
export const testIdbConcurrentMerge = async tc => {
  await clearDocument(tc.testName)
  const doc1 = new Y.Doc()
  const arr1 = doc1.getArray('t')
  const doc2 = new Y.Doc()
  const arr2 = doc2.getArray('t')
  arr1.insert(0, [0])
  const persistence1 = new IndexedDBPersistence(tc.testName, doc1)
  persistence1._storeTimeout = 0
  await persistence1.whenSynced
  arr1.insert(0, [1])
  const persistence2 = new IndexedDBPersistence(tc.testName, doc2)
  persistence2._storeTimeout = 0
  await persistence2.whenSynced
  t.assert(arr2.length === 2)
  arr1.insert(0, ['left'])
  for (let i = 0; i < PREFERRED_TRIM_SIZE + 1; i++) {
    arr1.insert(i, [i])
  }
  arr2.insert(0, ['right'])
  for (let i = 0; i < PREFERRED_TRIM_SIZE + 1; i++) {
    arr2.insert(i, [i])
  }
  await promise.wait(100)
  await fetchUpdates(persistence1)
  await fetchUpdates(persistence2)
  t.assert(persistence1._dbsize < 10)
  t.assert(persistence2._dbsize < 10)
  t.compareArrays(arr1.toArray(), arr2.toArray())
}
