# IndexedDB database adapter for [Yjs](https://github.com/y-js/yjs)

Use the IndexedDB database adapter to store your shared data persistently in the browser. The next time you join the session, your changes will still be there.

* Minimizes the amount of data exchanged between server and client
* Makes offline editing possible
* Not supported by all browsers (see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API))

## Use it!
Install this with bower or npm.

##### Bower
```
bower install y-indexeddb --save
```

##### NPM
```
npm install y-indexeddb --save
```

### Example

```
Y({
  db: {
    name: 'indexeddb'
  },
  connector: {
    name: 'websockets-client', // choose the websockets connector
    // name: 'webrtc'
    // name: 'xmpp'
    room: 'Textarea-example-dev'
  },
  sourceDir: '/bower_components', // location of the y-* modules
  share: {
    textarea: 'Text' // y.share.textarea is of type Y.Text
  }
  // types: ['Richtext', 'Array'] // optional list of types you want to import
}).then(function (y) {
  // bind the textarea to a shared text element
  y.share.textarea.bind(document.getElementById('textfield'))
}
```

## License
Yjs is licensed under the [MIT License](./LICENSE).

<kevin.jahns@rwth-aachen.de>