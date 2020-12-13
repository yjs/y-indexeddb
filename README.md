# y-indexeddb

> IndexedDB database provider for Yjs. [Documentation](https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb)

Use the IndexedDB database adapter to store your shared data persistently in
the browser. The next time you join the session, your changes will still be
there.

* Minimizes the amount of data exchanged between server and client
* Makes offline editing possible

## Getting Started

API documentation: https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb

```sh
npm i --save y-indexeddb
```

```js
const provider = new IndexeddbPersistence(docName, ydoc)

provider.on('synced', () => {
  console.log('content from the database is loaded')
})
```

## License

Yjs is licensed under the [MIT License](./LICENSE).

<kevin.jahns@protonmail.com>
