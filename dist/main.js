/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Sequencer = __webpack_require__(1);
	var Handle = Sequencer.Handle;
	var fetch = __webpack_require__(2);
	
	window.onload = function () {
	  function log(text) {
	    var div = document.querySelector("#log");
	    div.innerHTML += text + "<br/>";
	  }
	
	  // Create a handle and release it after some time has passed.
	  // The sequence will block at `doWaitForHandle(blockUntilLaterHandle)` until the handle is released.
	  var blockUntilLaterHandle = new Handle();
	  setTimeout(blockUntilLaterHandle.release, 10000);
	
	  var sequencer = new Sequencer();
	
	  // Enqueue a simple synchronous action
	  sequencer.do(function () {
	    log("1st instantly");
	  });
	
	  // Waits for one second then performs an action after the delay has elapsed.
	  // This also demonstrates "do" task chaining.
	  sequencer.doWait(1000).do(function () {
	    log("2nd after 1 second");
	  });
	
	  // Performs an action and waits until release() is called
	  sequencer.doWaitForRelease(function (release) {
	    setTimeout(release, 3000);
	  });
	
	  sequencer.do(function () {
	    log("3rd after waiting for a release() call");
	  });
	
	  // Block until the handle is released
	  sequencer.doWaitForHandle(blockUntilLaterHandle);
	
	  sequencer.do(function () {
	    log("4rd after waiting for a manually-created handle to be released");
	  });
	
	  // Performs an action and waits until release() is called a certain number of times.
	  // The sequencer proceeds after 5 seconds (when two releases have been performed).
	  sequencer.doWaitForReleases(2, function (release) {
	    setTimeout(release, 5000);
	    setTimeout(release, 3000);
	  });
	
	  sequencer.do(function () {
	    log("5th after waiting for two release() calls");
	  });
	
	  // Wait for a promise to be fulfilled.
	  // You can optionally obtain the promise's value and/or rejection reason.
	  var url = "https://cors-test.appspot.com/test";
	  sequencer.doWaitForPromise(fetch(url), function (response) {
	    log("> Promise Resolved : Received HTTP " + response.status + " from " + url);
	  });
	
	  sequencer.do(function () {
	    log("6th after waiting for a promise to be resolved");
	  });
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports =
	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {
	
		module.exports = __webpack_require__(1);
	
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {
	
		/* WEBPACK VAR INJECTION */(function(process) {"use strict";
		
		var Handle = __webpack_require__(3);
		
		var Sequencer = function Sequencer() {
		  var sequence = [];
		  var currentTask = null;
		  var currentHandle = null;
		  var processing = false;
		
		  this.push = function (task) {
		    sequence.push(task);
		    resumeProcessing();
		  };
		
		  this.clear = function () {
		    sequence = [];
		    if (currentTask !== null && typeof currentTask.cancel !== "undefined") {
		      currentTask.cancel(currentHandle);
		    }
		  };
		
		  function resumeProcessing() {
		    if (processing) return;
		    processing = true;
		    process();
		  }
		
		  function finishProcessing() {
		    if (sequence.length !== 0) return false;
		    processing = false;
		    return true;
		  }
		
		  function process() {
		    if (finishProcessing()) return;
		
		    // When the handle is released, we'll process the next task
		    var handle = new Handle(function () {
		      currentTask = null;
		      currentHandle = null;
		      process();
		    });
		
		    // Perform the next task, providing it with the handle it can
		    // release to signify that its job is done
		    var task = sequence.shift();
		    currentTask = task;
		    currentHandle = handle;
		    task.perform(handle);
		  }
		};
		
		__webpack_require__(4).extend(Sequencer.prototype);
		__webpack_require__(5).extend(Sequencer.prototype);
		__webpack_require__(6).extend(Sequencer.prototype);
		__webpack_require__(7).extend(Sequencer.prototype);
		__webpack_require__(8).extend(Sequencer.prototype);
		__webpack_require__(9).extend(Sequencer.prototype);
		
		Sequencer.Handle = Handle; // Expose the Handle type in the API
		
		module.exports = Sequencer;
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))
	
	/***/ }),
	/* 2 */
	/***/ (function(module, exports) {
	
		// shim for using process in browser
		var process = module.exports = {};
		
		// cached from whatever global is present so that test runners that stub it
		// don't break things.  But we need to wrap it in a try catch in case it is
		// wrapped in strict mode code which doesn't define any globals.  It's inside a
		// function because try/catches deoptimize in certain engines.
		
		var cachedSetTimeout;
		var cachedClearTimeout;
		
		function defaultSetTimout() {
		    throw new Error('setTimeout has not been defined');
		}
		function defaultClearTimeout () {
		    throw new Error('clearTimeout has not been defined');
		}
		(function () {
		    try {
		        if (typeof setTimeout === 'function') {
		            cachedSetTimeout = setTimeout;
		        } else {
		            cachedSetTimeout = defaultSetTimout;
		        }
		    } catch (e) {
		        cachedSetTimeout = defaultSetTimout;
		    }
		    try {
		        if (typeof clearTimeout === 'function') {
		            cachedClearTimeout = clearTimeout;
		        } else {
		            cachedClearTimeout = defaultClearTimeout;
		        }
		    } catch (e) {
		        cachedClearTimeout = defaultClearTimeout;
		    }
		} ())
		function runTimeout(fun) {
		    if (cachedSetTimeout === setTimeout) {
		        //normal enviroments in sane situations
		        return setTimeout(fun, 0);
		    }
		    // if setTimeout wasn't available but was latter defined
		    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
		        cachedSetTimeout = setTimeout;
		        return setTimeout(fun, 0);
		    }
		    try {
		        // when when somebody has screwed with setTimeout but no I.E. maddness
		        return cachedSetTimeout(fun, 0);
		    } catch(e){
		        try {
		            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
		            return cachedSetTimeout.call(null, fun, 0);
		        } catch(e){
		            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
		            return cachedSetTimeout.call(this, fun, 0);
		        }
		    }
		
		
		}
		function runClearTimeout(marker) {
		    if (cachedClearTimeout === clearTimeout) {
		        //normal enviroments in sane situations
		        return clearTimeout(marker);
		    }
		    // if clearTimeout wasn't available but was latter defined
		    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
		        cachedClearTimeout = clearTimeout;
		        return clearTimeout(marker);
		    }
		    try {
		        // when when somebody has screwed with setTimeout but no I.E. maddness
		        return cachedClearTimeout(marker);
		    } catch (e){
		        try {
		            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
		            return cachedClearTimeout.call(null, marker);
		        } catch (e){
		            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
		            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
		            return cachedClearTimeout.call(this, marker);
		        }
		    }
		
		
		
		}
		var queue = [];
		var draining = false;
		var currentQueue;
		var queueIndex = -1;
		
		function cleanUpNextTick() {
		    if (!draining || !currentQueue) {
		        return;
		    }
		    draining = false;
		    if (currentQueue.length) {
		        queue = currentQueue.concat(queue);
		    } else {
		        queueIndex = -1;
		    }
		    if (queue.length) {
		        drainQueue();
		    }
		}
		
		function drainQueue() {
		    if (draining) {
		        return;
		    }
		    var timeout = runTimeout(cleanUpNextTick);
		    draining = true;
		
		    var len = queue.length;
		    while(len) {
		        currentQueue = queue;
		        queue = [];
		        while (++queueIndex < len) {
		            if (currentQueue) {
		                currentQueue[queueIndex].run();
		            }
		        }
		        queueIndex = -1;
		        len = queue.length;
		    }
		    currentQueue = null;
		    draining = false;
		    runClearTimeout(timeout);
		}
		
		process.nextTick = function (fun) {
		    var args = new Array(arguments.length - 1);
		    if (arguments.length > 1) {
		        for (var i = 1; i < arguments.length; i++) {
		            args[i - 1] = arguments[i];
		        }
		    }
		    queue.push(new Item(fun, args));
		    if (queue.length === 1 && !draining) {
		        runTimeout(drainQueue);
		    }
		};
		
		// v8 likes predictible objects
		function Item(fun, array) {
		    this.fun = fun;
		    this.array = array;
		}
		Item.prototype.run = function () {
		    this.fun.apply(null, this.array);
		};
		process.title = 'browser';
		process.browser = true;
		process.env = {};
		process.argv = [];
		process.version = ''; // empty string to avoid regexp issues
		process.versions = {};
		
		function noop() {}
		
		process.on = noop;
		process.addListener = noop;
		process.once = noop;
		process.off = noop;
		process.removeListener = noop;
		process.removeAllListeners = noop;
		process.emit = noop;
		process.prependListener = noop;
		process.prependOnceListener = noop;
		
		process.listeners = function (name) { return [] }
		
		process.binding = function (name) {
		    throw new Error('process.binding is not supported');
		};
		
		process.cwd = function () { return '/' };
		process.chdir = function (dir) {
		    throw new Error('process.chdir is not supported');
		};
		process.umask = function() { return 0; };
	
	
	/***/ }),
	/* 3 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var Handle = function Handle(onRelease) {
		  var that = this;
		  var onReleaseHandlers = [];
		
		  if (!(typeof onRelease === "undefined")) onReleaseHandlers.push(onRelease);
		
		  function callReleaseHandlers() {
		    onReleaseHandlers.forEach(function (handler) {
		      return handler();
		    });
		  }
		
		  this.isReleased = false;
		
		  this.addOnReleaseHandler = function (handler) {
		    onReleaseHandlers.push(handler);
		  };
		
		  this.release = function () {
		    if (that.isReleased) return;
		    that.isReleased = true;
		    callReleaseHandlers();
		  };
		};
		
		module.exports = Handle;
	
	/***/ }),
	/* 4 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var DoTask = function DoTask(action) {
		  this.perform = function (handle) {
		    action();
		    handle.release();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.do = function (action) {
		      this.push(new DoTask(action));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 5 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var DoWaitTask = function DoWaitTask(duration) {
		  var that = this;
		
		  this.timeout = null;
		
		  this.perform = function (handle) {
		    that.timeout = setTimeout(handle.release, duration);
		  };
		  this.cancel = function (handle) {
		    if (that.timeout !== null) clearTimeout(that.timeout);
		    handle.release();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.doWait = function (duration) {
		      this.push(new DoWaitTask(duration));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 6 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var DoWaitForHandleTask = function DoWaitForHandleTask(handleToWaitFor) {
		  this.perform = function (handle) {
		    if (handleToWaitFor.isReleased) {
		      handle.release();
		      return;
		    }
		    handleToWaitFor.addOnReleaseHandler(handle.release);
		  };
		  this.cancel = function (handle) {
		    handle.release();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.doWaitForHandle = function (handleToWaitFor) {
		      this.push(new DoWaitForHandleTask(handleToWaitFor));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 7 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		// May require an ES6 promises polyfill such as "es6-promise", depending on the environment
		
		var DoWaitForPromiseTask = function DoWaitForPromiseTask(promise, onFulfilled, onRejected) {
		  this.perform = function (handle) {
		    promise.then(function (value) {
		      if (typeof onFulfilled !== "undefined") onFulfilled(value);
		      handle.release();
		    }, function (reason) {
		      if (typeof onRejected !== "undefined") onRejected(reason);
		      handle.release();
		    });
		  };
		  this.cancel = function (handle) {
		    // Allows monkey-patching an ES6 promise with a cancel function that will
		    // automatically be invoked by the sequencer when it cancels this task.
		    // Details: http://stackoverflow.com/a/25346945/167983
		    if (typeof promise.cancel !== "undefined") promise.cancel();
		    handle.release();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.doWaitForPromise = function (promise, onFulfilled, onRejected) {
		      this.push(new DoWaitForPromiseTask(promise, onFulfilled, onRejected));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 8 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var DoWaitForRelease = function DoWaitForRelease(action) {
		  this.perform = function (handle) {
		    // The caller is provided with the release() function directly.
		    // The use of an handle is an internal implementation detail.
		    action(handle.release);
		  };
		  this.cancel = function (handle) {
		    handle.release();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.doWaitForRelease = function (action) {
		      this.push(new DoWaitForRelease(action));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 9 */
	/***/ (function(module, exports, __webpack_require__) {
	
		"use strict";
		
		var CounterHandle = __webpack_require__(10);
		
		var DoWaitForReleases = function DoWaitForReleases(count, action) {
		  var that = this;
		
		  this.counterHandle = new CounterHandle(count);
		
		  this.perform = function (handle) {
		    // When the counter handle is released for the last time, the sequencer handle is released too.
		    that.counterHandle.addOnReleaseHandler(handle.release);
		
		    // The caller is provided with the CounterHandle release() function directly.
		    // The use of a CounterHandle is an internal implementation detail.
		    action(that.counterHandle.release);
		  };
		  this.cancel = function (handle) {
		    that.counterHandle.releaseAll();
		  };
		};
		
		module.exports = {
		  extend: function extend(sequencerPrototype) {
		    sequencerPrototype.doWaitForReleases = function (count, action) {
		      this.push(new DoWaitForReleases(count, action));
		      return this;
		    };
		  }
		};
	
	/***/ }),
	/* 10 */
	/***/ (function(module, exports) {
	
		"use strict";
		
		var CounterHandle = function CounterHandle(count, onRelease) {
		  var that = this;
		  var onReleaseHandlers = [];
		
		  if (count === 0) throw new Error("Count must be greater than zero!");
		
		  if (!(typeof onRelease === "undefined")) onReleaseHandlers.push(onRelease);
		
		  function callReleaseHandlers() {
		    onReleaseHandlers.forEach(function (handler) {
		      return handler();
		    });
		  }
		
		  this.isReleased = false;
		  this.releaseCount = 0;
		
		  this.addOnReleaseHandler = function (handler) {
		    onReleaseHandlers.push(handler);
		  };
		
		  this.release = function () {
		    if (that.isReleased) return;
		    that.releaseCount += 1;
		    if (that.releaseCount === count) {
		      that.isReleased = true;
		      callReleaseHandlers();
		    }
		  };
		
		  this.releaseAll = function () {
		    if (that.isReleased) return;
		    that.isReleased = true;
		    callReleaseHandlers();
		  };
		};
		
		module.exports = CounterHandle;
	
	/***/ })
	/******/ ]);
	//# sourceMappingURL=sequencer.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(3);
	module.exports = self.fetch.bind(self);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]
	
	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }
	
	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1])
	      }, this)
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }
	
	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)
	
	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }
	
	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }
	
	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }
	
	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	
	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = String(input)
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map