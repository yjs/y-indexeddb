(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global Y */
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function extend(Y) {
  var Store = (function () {
    function Store(transaction, name) {
      _classCallCheck(this, Store);

      this.store = transaction.objectStore(name);
    }

    _createClass(Store, [{
      key: 'find',
      value: regeneratorRuntime.mark(function find(id) {
        return regeneratorRuntime.wrap(function find$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.store.get(id);

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, find, this);
      })
    }, {
      key: 'put',
      value: regeneratorRuntime.mark(function put(v) {
        return regeneratorRuntime.wrap(function put$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.store.put(v);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, put, this);
      })
    }, {
      key: 'delete',
      value: regeneratorRuntime.mark(function _delete(id) {
        return regeneratorRuntime.wrap(function _delete$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.store.delete(id);

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _delete, this);
      })
    }, {
      key: 'findWithLowerBound',
      value: regeneratorRuntime.mark(function findWithLowerBound(start) {
        return regeneratorRuntime.wrap(function findWithLowerBound$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.store.openCursor(window.IDBKeyRange.lowerBound(start));

              case 2:
                return _context4.abrupt('return', _context4.sent);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, findWithLowerBound, this);
      })
    }, {
      key: 'findWithUpperBound',
      value: regeneratorRuntime.mark(function findWithUpperBound(end) {
        return regeneratorRuntime.wrap(function findWithUpperBound$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.store.openCursor(window.IDBKeyRange.upperBound(end), 'prev');

              case 2:
                return _context5.abrupt('return', _context5.sent);

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, findWithUpperBound, this);
      })
    }, {
      key: 'findNext',
      value: regeneratorRuntime.mark(function findNext(id) {
        return regeneratorRuntime.wrap(function findNext$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.delegateYield(this.findWithLowerBound([id[0], id[1] + 1]), 't0', 1);

              case 1:
                return _context6.abrupt('return', _context6.t0);

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, findNext, this);
      })
    }, {
      key: 'findPrev',
      value: regeneratorRuntime.mark(function findPrev(id) {
        return regeneratorRuntime.wrap(function findPrev$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.delegateYield(this.findWithUpperBound([id[0], id[1] - 1]), 't0', 1);

              case 1:
                return _context7.abrupt('return', _context7.t0);

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, findPrev, this);
      })
    }, {
      key: 'iterate',
      value: regeneratorRuntime.mark(function iterate(t, start, end, gen) {
        var range, cursorResult;
        return regeneratorRuntime.wrap(function iterate$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                range = null;

                if (start != null && end != null) {
                  range = window.IDBKeyRange.bound(start, end);
                } else if (start != null) {
                  range = window.IDBKeyRange.lowerBound(start);
                } else if (end != null) {
                  range = window.IDBKeyRange.upperBound(end);
                }
                cursorResult = this.store.openCursor(range);

              case 3:
                _context8.next = 5;
                return cursorResult;

              case 5:
                _context8.t0 = _context8.sent;

                if (!(_context8.t0 != null)) {
                  _context8.next = 11;
                  break;
                }

                return _context8.delegateYield(gen.call(t, cursorResult.result.value), 't1', 8);

              case 8:
                cursorResult.result.continue();
                _context8.next = 3;
                break;

              case 11:
              case 'end':
                return _context8.stop();
            }
          }
        }, iterate, this);
      })
    }]);

    return Store;
  })();

  var Transaction = (function (_Y$Transaction) {
    _inherits(Transaction, _Y$Transaction);

    function Transaction(store) {
      _classCallCheck(this, Transaction);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Transaction).call(this, store));

      var transaction = store.db.transaction(['OperationStore', 'StateStore', 'DeleteStore'], 'readwrite');
      _this.store = store;
      _this.ss = new Store(transaction, 'StateStore');
      _this.os = new Store(transaction, 'OperationStore');
      _this.ds = new Store(transaction, 'DeleteStore');
      return _this;
    }

    return Transaction;
  })(Y.Transaction);

  var OperationStore = (function (_Y$AbstractDatabase) {
    _inherits(OperationStore, _Y$AbstractDatabase);

    function OperationStore(y, opts) {
      _classCallCheck(this, OperationStore);

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(OperationStore).call(this, y, opts));

      if (opts == null) {
        opts = {};
      }
      if (opts.namespace == null || typeof opts.namespace !== 'string') {
        throw new Error('IndexedDB: expect a string (opts.namespace)!');
      } else {
        _this2.namespace = opts.namespace;
      }
      if (opts.idbVersion != null) {
        _this2.idbVersion = opts.idbVersion;
      } else {
        _this2.idbVersion = 5;
      }
      var store = _this2;
      // initialize database!
      _this2.requestTransaction(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return window.indexedDB.open(opts.namespace, store.idbVersion);

              case 2:
                store.db = _context9.sent;

              case 3:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee, this);
      }));
      if (opts.cleanStart) {
        _this2.requestTransaction(regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return this.os.store.clear();

                case 2:
                  _context10.next = 4;
                  return this.ds.store.clear();

                case 4:
                  _context10.next = 6;
                  return this.ss.store.clear();

                case 6:
                case 'end':
                  return _context10.stop();
              }
            }
          }, _callee2, this);
        }));
      }
      var operationsToAdd = [];
      window.addEventListener('storage', function (event) {
        if (event.key === '__YJS__' + store.namespace) {
          operationsToAdd.push(event.newValue);
          if (operationsToAdd.length === 1) {
            store.requestTransaction(regeneratorRuntime.mark(function _callee3() {
              var add, i, op;
              return regeneratorRuntime.wrap(function _callee3$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      add = operationsToAdd;

                      operationsToAdd = [];
                      _context11.t0 = regeneratorRuntime.keys(add);

                    case 3:
                      if ((_context11.t1 = _context11.t0()).done) {
                        _context11.next = 12;
                        break;
                      }

                      i = _context11.t1.value;

                      // don't call the localStorage event twice..
                      op = JSON.parse(add[i]);

                      if (!(op.struct !== 'Delete')) {
                        _context11.next = 9;
                        break;
                      }

                      return _context11.delegateYield(this.getOperation(op.id), 't2', 8);

                    case 8:
                      op = _context11.t2;

                    case 9:
                      return _context11.delegateYield(this.store.operationAdded(this, op, true), 't3', 10);

                    case 10:
                      _context11.next = 3;
                      break;

                    case 12:
                    case 'end':
                      return _context11.stop();
                  }
                }
              }, _callee3, this);
            }));
          }
        }
      }, false);
      return _this2;
    }

    _createClass(OperationStore, [{
      key: 'operationAdded',
      value: regeneratorRuntime.mark(function operationAdded(transaction, op, noAdd) {
        return regeneratorRuntime.wrap(function operationAdded$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.delegateYield(_get(Object.getPrototypeOf(OperationStore.prototype), 'operationAdded', this).call(this, transaction, op), 't0', 1);

              case 1:
                if (!noAdd) {
                  window.localStorage['__YJS__' + this.namespace] = JSON.stringify(op);
                }

              case 2:
              case 'end':
                return _context12.stop();
            }
          }
        }, operationAdded, this);
      })
    }, {
      key: 'transact',
      value: function transact(makeGen) {
        var transaction = this.db != null ? new Transaction(this) : null;
        var store = this;

        var gen = makeGen.call(transaction);
        handleTransactions(gen.next());

        function handleTransactions(result) {
          var request = result.value;
          if (result.done) {
            makeGen = store.getNextRequest();
            if (makeGen != null) {
              if (transaction == null && store.db != null) {
                transaction = new Transaction(store);
              }
              gen = makeGen.call(transaction);
              handleTransactions(gen.next());
            } // else no transaction in progress!
            return;
          }
          if (request.constructor === window.IDBRequest) {
            request.onsuccess = function () {
              var res = request.result;
              if (res != null && res.constructor === window.IDBCursorWithValue) {
                res = res.value;
              }
              handleTransactions(gen.next(res));
            };
            request.onerror = function (err) {
              gen.throw(err);
            };
          } else if (request.constructor === window.IDBCursor) {
            request.onsuccess = function () {
              handleTransactions(gen.next(request.result != null ? request.result.value : null));
            };
            request.onerror = function (err) {
              gen.throw(err);
            };
          } else if (request.constructor === window.IDBOpenDBRequest) {
            request.onsuccess = function (event) {
              var db = event.target.result;
              handleTransactions(gen.next(db));
            };
            request.onerror = function () {
              gen.throw("Couldn't open IndexedDB database!");
            };
            request.onupgradeneeded = function (event) {
              var db = event.target.result;
              try {
                db.createObjectStore('OperationStore', { keyPath: 'id' });
                db.createObjectStore('DeleteStore', { keyPath: 'id' });
                db.createObjectStore('StateStore', { keyPath: 'id' });
              } catch (e) {
                console.log('Store already exists!');
              }
            };
          } else {
            gen.throw('You must not yield this type!');
          }
        }
      }
      // TODO: implement "free"..

    }, {
      key: 'destroy',
      value: regeneratorRuntime.mark(function destroy() {
        return regeneratorRuntime.wrap(function destroy$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                this.db.close();
                _context13.next = 3;
                return window.indexedDB.deleteDatabase(this.namespace);

              case 3:
              case 'end':
                return _context13.stop();
            }
          }
        }, destroy, this);
      })
    }]);

    return OperationStore;
  })(Y.AbstractDatabase);

  Y.extend('indexeddb', OperationStore);
}

module.exports = extend;
if (typeof Y !== 'undefined') {
  extend(Y);
}

},{}]},{},[1])

