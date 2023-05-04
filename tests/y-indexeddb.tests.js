
import * as Y from 'yjs'
import { IndexeddbPersistence, clearDocument, PREFERRED_TRIM_SIZE, fetchUpdates } from '../src/y-indexeddb.js'
import * as t from 'lib0/testing.js'
import * as promise from 'lib0/promise.js'

/**
 * @param {t.TestCase} tc
 */
export const testPerf = async tc => {
  await t.measureTimeAsync('time to create a y-indexeddb instance', async () => {
    const ydoc = new Y.Doc()
    const provider = new IndexeddbPersistence(tc.testName, ydoc)
    await provider.whenSynced
    provider.destroy()
  })
}

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
  const persistence1 = new IndexeddbPersistence(tc.testName, doc1)
  persistence1._storeTimeout = 0
  await persistence1.whenSynced
  arr1.insert(0, [1])
  const persistence2 = new IndexeddbPersistence(tc.testName, doc2)
  persistence2._storeTimeout = 0
  let calledObserver = false
  // @ts-ignore
  arr2.observe((event, tr) => {
    t.assert(!tr.local)
    t.assert(tr.origin === persistence2)
    calledObserver = true
  })
  await persistence2.whenSynced
  t.assert(calledObserver)
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
  const persistence1 = new IndexeddbPersistence(tc.testName, doc1)
  persistence1._storeTimeout = 0
  await persistence1.whenSynced
  arr1.insert(0, [1])
  const persistence2 = new IndexeddbPersistence(tc.testName, doc2)
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

/**
 * @param {t.TestCase} tc
 */
export const testMetaStorage = async tc => {
  await clearDocument(tc.testName)
  const ydoc = new Y.Doc()
  const persistence = new IndexeddbPersistence(tc.testName, ydoc)
  persistence.set('a', 4)
  persistence.set(4, 'meta!')
  // @ts-ignore
  persistence.set('obj', { a: 4 })
  const resA = await persistence.get('a')
  t.assert(resA === 4)
  const resB = await persistence.get(4)
  t.assert(resB === 'meta!')
  const resC = await persistence.get('obj')
  t.compareObjects(resC, { a: 4 })
}

/**
 * @param {t.TestCase} tc
 */
export const testEarlyDestroy = async tc => {
  let hasbeenSyced = false
  const ydoc = new Y.Doc()
  const indexDBProvider = new IndexeddbPersistence(tc.testName, ydoc)
  indexDBProvider.on('synced', () => {
    hasbeenSyced = true
  })
  indexDBProvider.destroy()
  await new Promise((resolve) => setTimeout(resolve, 500))
  t.assert(!hasbeenSyced)
}
