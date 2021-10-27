# y-indexeddb

> IndexedDB database provider for Yjs. [Documentation](https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb)

Use the IndexedDB database adapter to store your shared data persistently in
the browser. The next time you join the session, your changes will still be
there.

* Minimizes the amount of data exchanged between server and client
* Makes offline editing possible

## Getting Started

You find the complete documentation published online: [API documentation](https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb).

```sh
npm i --save y-indexeddb
```

```js
const provider = new IndexeddbPersistence(docName, ydoc)

provider.on('synced', () => {
  console.log('content from the database is loaded')
})
```

## API

<dl>
  <b><code>provider = new IndexeddbPersistence(docName: string, ydoc: Y.Doc)</code></b>
  <dd>
Create a y-indexeddb persistence provider. Specify docName as a unique string
that identifies this document. In most cases, you want to use the same identifier
that is used as the room-name in the connection provider.
  </dd>
  <b><code>provider.on('synced', function(idbPersistence: IndexeddbPersistence))</code></b>
  <dd>
The "synced" event is fired when the connection to the database has been established
and all available content has been loaded. The event is also fired when no content
is available yet.
  </dd>
  <b><code>provider.set(key: any, value: any): Promise&lt;any&gt;</code></b>
  <dd>
Set a custom property on the provider instance. You can use this to store relevant
meta-information for the persisted document. However, the content will not be
synced with other peers.
  </dd>
  <b><code>provider.get(key: any): Promise&gt;any&lt;</code></b>
  <dd>
Retrieve a stored value.
  </dd>
  <b><code>provider.del(key: any): Promise&gt;undefined&lt;</code></b>
  <dd>
Delete a stored value.
  </dd>
  <b><code>provider.destroy(): Promise</code></b>
  <dd>
Close the connection to the database and stop syncing the document. This method is
automatically called when the Yjs document is destroyed (e.g. ydoc.destroy()).
  </dd>
  <b><code>provider.clearData(): Promise</code></b>
  <dd>
Destroy this database and remove the stored document and all related meta-information
from the database.
  </dd>
</dl>

## License

Yjs is licensed under the [MIT License](./LICENSE).

<kevin.jahns@protonmail.com>
