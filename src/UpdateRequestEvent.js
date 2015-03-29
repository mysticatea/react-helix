function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isThenable(x) {
  return typeof x === "object" &&
         typeof x.then === "function";
}

function isGenerator(x) {
  return typeof x === "object" &&
         typeof x.next === "function" &&
         typeof x.throw === "function";
}

// Process a generator. ping-pong states.
function advanceToEnd(component, generator, resolve, reject) {
  onFulfilled(undefined); //eslint-disable-line no-use-before-define

  function onFulfilled(storeValue) {
    let ret;
    try {
      ret = generator.next(storeValue);
    }
    catch (err) {
      reject(err);
      return;
    }

    next(ret); //eslint-disable-line no-use-before-define
  }

  function onRejected(err) {
    let ret;
    try {
      ret = generator.throw(err);
    }
    catch (err2) {
      reject(err2);
      return;
    }

    next(ret); //eslint-disable-line no-use-before-define
  }

  function next(ret) {
    if (ret.done) {
      if (ret.value === undefined) {
        resolve(component.storeValue);
      }
      else {
        setUnified(component, ret.value, resolve, reject);
      }
    }
    else {
      if (ret.value === undefined) {
        onFulfilled(component.storeValue);
      }
      else {
        setUnified(component, ret.value, onFulfilled, onRejected);
      }
    }
  }
}

function setUnified(component, value, resolve, reject) {
  if (isThenable(value)) {
    value.then(
      result => {
        if (result === undefined) {
          resolve(component.storeValue);
        }
        else {
          component.setStoreValue(result, resolve);
        }
      },
      reject
    );
  }
  else if (isGenerator(value)) {
    advanceToEnd(component, value, resolve, reject);
  }
  else {
    component.setStoreValue(value, resolve);
  }
}

function doNothing() {
}

function printError(error) {
  // This function is used in (process.env.NODE_ENV !== "production").
  if (error != null) {
    console.error(error); //eslint-disable-line no-console
  }
}

/**
 * The event name for `UpdateRequestEvent`.
 * @type {string}
 */
export const EVENT_NAME = "helix-requests-update";

/**
 * @param action {function} - A function to transform the state.
 * @param args {any[]} - Information for action.  This value is given to the
 *   second argument of action.
 * @return {UpdateRequestEvent} - The created event object.
 */
export function createUpdateRequestEvent(action, args, callback) {
  if (process.env.NODE_ENV !== "production") {
    invariant(typeof action === "function", "action should be a function.");
    invariant(Array.isArray(args), "args should be an array.");
    invariant(callback == null || typeof callback === "function",
              "callback should be a function or nothing.");

    callback = callback || printError;
  }
  else if (callback == null) {
    callback = doNothing;
  }


  let event = document.createEvent("CustomEvent");
  let handled = false;

  event.initCustomEvent(EVENT_NAME, true, true, null);
  Object.defineProperties(event, {
    action: {
      value: action,
      configurable: true,
      enumerable: true
    },

    arguments: {
      value: args,
      configurable: true,
      enumerable: true
    },

    // This is internal method, called from StoreMixin.
    applyTo: {value: function apply(component) {
      if (process.env.NODE_ENV !== "production") {
        const get = Object.getOwnPropertyDescriptor(component, "storeValue");
        const set = Object.getOwnPropertyDescriptor(component, "setStoreValue");
        invariant(typeof get.get === "function",
                  "component.storeValue should be a getter property.");
        invariant(typeof set.value === "function",
                  "component.setStoreValue should be a function.");
        invariant(handled === false,
                  `this ${EVENT_NAME} event had been applied already.`);
        invariant(typeof this.action === "function",
                  "this.action should be a function.");
        invariant(Array.isArray(this.arguments),
                  "this.arguments should be an array.");
      }
      handled = true;

      let value;
      try {
        value = this.action(component.storeValue, ...this.arguments);
      }
      catch (error) {
        callback(error);
        return;
      }

      setUnified(
        component,
        value,
        result => callback(null, result),
        callback);
    }},

    // This is internal method, called from ActionerMixin.
    rejectIfNotHandled: {value: function rejectIfNotHandled() {
      if (handled === false) {
        handled = true;
        callback(new Error("not handled"));
      }
    }}
  });

  return event;
}
