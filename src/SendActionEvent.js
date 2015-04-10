// There are several cross-callings in this file.
/*eslint no-use-before-define:[2,"nofunc"]*/

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isFunction(x) {
  return typeof x === "function";
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

function printError(error) {
  // This function is used in (process.env.NODE_ENV !== "production").
  if (error != null) {
    console.error(error); //eslint-disable-line no-console
  }
}

// A handler that is used if value is not all of undefined, a function, a
// promise, and a generator.
// Just it sets the value to the component's stage value.
function set(component, isInGenerator, value, resolve, reject) {
  try {
    component.setStageValue(value, resolve);
  }
  catch (err) {
    reject(err);
  }
}

// A handler that is used if value is a function.
// It calls the function together with the component's stage value.
// Then set the result to the component's stage value.
function callAndSet(component, isInGenerator, func, resolve, reject) {
  let result;
  try {
    result = func(component.stageValue);
  }
  catch (error) {
    reject(error);
    return;
  }
  setUnified(component, isInGenerator, result, resolve, reject);
}

// A handler that is used if value is a promise.
// It waits for the promise become fulfilled.
// Then set the result to the component's stage value.
// But if is while advancing a generator, it doesn't set to the stage value,
// just returns the result.
function waitAndSet(component, isInGenerator, promise, resolve, reject) {
  const promise2 = promise.then(
    result => {
      if (isInGenerator) {
        resolve(result);
      }
      else {
        setUnified(component, isInGenerator, result, resolve, reject);
      }
    },
    reject
  );

  if (process.env.NODE_ENV !== "production") {
    promise2.catch(printError);
  }
}

// A handler that is used if value is a generator.
// Process a generator. ping-pong the component's stage value.
function advanceToEnd(component, isInGenerator, generator, resolve, reject) {
  onFulfilled(undefined);

  function onFulfilled(stageValue) {
    let ret;
    try {
      ret = generator.next(stageValue);
    }
    catch (err) {
      reject(err);
      return;
    }

    next(ret);
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

    next(ret);
  }

  function next(ret) {
    if (ret.done) {
      setUnified(component, true, ret.value, resolve, reject);
    }
    else {
      setUnified(component, true, ret.value, onFulfilled, onRejected);
    }
  }
}

// Check type of the value, and handle the value.
function setUnified(component, isInGenerator, value, resolve, reject) {
  if (value === undefined) {
    resolve(component.stageValue);
    return;
  }

  const handle =
    isFunction(value) ? callAndSet :
    isThenable(value) ? waitAndSet :
    isGenerator(value) ? advanceToEnd :
    /* otherwise */ set;

  handle(component, isInGenerator, value, resolve, reject);
}

/**
 * The event name for `SendActionEvent`.
 * @type {string}
 */
export const EVENT_NAME = "helix-sent-action";

/**
 * @param action {function} - A function to transform the state.
 * @param args {any[]} - Information for action.  This value is given to the
 *   second argument of action.
 * @return {SendActionEvent} - The created event object.
 */
export function createSendActionEvent(action, args, callback) {
  if (process.env.NODE_ENV !== "production") {
    invariant(typeof action === "function", "action should be a function.");
    invariant(Array.isArray(args), "args should be an array.");
    invariant(callback == null || typeof callback === "function",
              "callback should be a function or nothing.");

    if (callback == null) {
      callback = printError;
    }
  }

  let event = document.createEvent("CustomEvent");
  let handled = false;

  event.initCustomEvent(EVENT_NAME, true, true, null);
  Object.defineProperties(event, {
    action: {
      value: action,
      configurable: true,
      enumerable: true,
      writable: true
    },

    arguments: {
      value: args,
      configurable: true,
      enumerable: true,
      writable: true
    },

    // This is internal method, called from StageMixin.
    applyTo: {value: function applyTo(component) {
      if (process.env.NODE_ENV !== "production") {
        const get = Object.getOwnPropertyDescriptor(component, "stageValue");
        const set = Object.getOwnPropertyDescriptor(component, "setStageValue");
        invariant(isFunction(get.get),
                  "component.stageValue should be a getter property.");
        invariant(isFunction(set.value),
                  "component.setStageValue should be a function.");
        invariant(handled === false,
                  `this ${EVENT_NAME} event had been applied already.`);
        invariant(isFunction(this.action),
                  "this.action should be a function.");
        invariant(Array.isArray(this.arguments),
                  "this.arguments should be an array.");
      }
      handled = true;

      let value;
      try {
        value = this.action(component.stageValue, ...this.arguments);
      }
      catch (error) {
        if (callback != null) {
          callback(error);
        }
        return;
      }

      setUnified(
        component,
        false,
        value,
        result => callback && callback(null, result),
        callback);
    }},

    // This is internal method, called from AgentMixin.
    rejectIfNotHandled: {value: function rejectIfNotHandled() {
      if (handled === false) {
        handled = true;
        if (callback != null) {
          callback(new Error("not handled"));
        }
      }
    }}
  });

  return event;
}
