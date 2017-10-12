# Encrypted IndexedDB database adapter for [Yjs](https://github.com/y-js/yjs)

Entirely based on [y-indexeddb](https://github.com/y-js/y-indexeddb)

Extends it with the new mandatory options:

* encode: function that gets called with the object to be stored. Must return a buffer or string.
* decode: function that gets called with the buffer to be decoded. Must return an object.
