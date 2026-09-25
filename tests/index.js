
import * as indexeddb from './y-indexeddb.tests.js'

import { runTests } from 'lib0/testing'
import { isBrowser, isNode } from 'lib0/environment'
import * as log from 'lib0/logging'

if (isBrowser) {
  log.createVConsole(document.body)
}
runTests({
  indexeddb
}).then(success => {
  /* istanbul ignore next */
  if (isNode) {
    process.exit(success ? 0 : 1)
  }
})
