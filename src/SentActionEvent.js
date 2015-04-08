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

function callAndSet(component, func, resolve, reject) {
  let result;
  try {
    result = func(component.stageValue);
  }
  catch (error) {
    reject(error);
    return;
  }
  setUnified(component, result, resolve, reject);
}

// Process a generator. ping-pong states.
function advanceToEnd(component, generator, resolve, reject) {
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
      setUnified(component, ret.value, resolve, reject);
    }
    else {
      setUnified(component, ret.value, onFulfilled, onRejected);
    }
  }
}

function setUnified(component, value, resolve, reject) {
  // Ignore undefined.
  //   e.g. lonly yield, no-return promises.
  if (value === undefined) {
    resolve(component.stageValue);
  }
  // If value is a function, call it and set the result.
  // In this case, give the current stage value to the first argument.
  else if (isFunction(value)) {
    callAndSet(component, value, resolve, reject);
  }
  // If value is a Promise, wait for fulfilled and set the result.
  else if (isThenable(value)) {
    value.then(
      result => setUnified(component, result, resolve, reject),
      reject
    );
  }
  // If value is a generator, advanced until done.
  // While advancing, set each yielded value.
  else if (isGenerator(value)) {
    advanceToEnd(component, value, resolve, reject);
  }
  // Otherwise, set the value.
  else {
    component.setStageValue(value, resolve);
  }
}

function printError(error) {
  // This function is used in (process.env.NODE_ENV !== "production").
  if (error != null) {
    console.error(error); //eslint-disable-line no-console
  }
}

/**
 * The event name for `SentActionEvent`.
 * @type {string}
 */
export const EVENT_NAME = "helix-sent-action";

/**
 * @param action {function} - A function to transform the state.
 * @param args {any[]} - Information for action.  This value is given to the
 *   second argument of action.
 * @return {SentActionEvent} - The created event object.
 */
export function createSentActionEvent(action, args, callback) {
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
