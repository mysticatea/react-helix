import React from "react";
import {EVENT_NAME} from "./UpdateRequestEvent";

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

//------------------------------------------------------------------------------
function parseStoreValuePath(value) {
  return (typeof value === "string" ? value.split(".").filter(Boolean) : []);
}

//------------------------------------------------------------------------------
function defineGetStoreValue(parts) {
  let body;
  switch (parts.length) {
    case 0:
      body = "return this.state;";
      break;

    default:
      const lastIndex = parts.length - 1;
      body = "var tmp0 = this.state;";
      for (let i = 0; i < lastIndex; ++i) {
        body += `
if (tmp${i} == null) {
  return undefined;
}
var tmp${i + 1} = tmp${i}.${parts[i]};`;
      }
      body += `
return tmp${lastIndex} && tmp${lastIndex}.${parts[lastIndex]};`;
      break;
  }

  return Function(body);
}

//------------------------------------------------------------------------------
function defineSetStoreValue(parts) {
  let body = `var cb2 = cb && function() { cb(this.storeValue); }.bind(this);`;

  switch (parts.length) {
    case 0:
      body += "\nthis.setState(value, cb2);";
      break;

    case 1:
      body += `\nthis.setState({${parts[0]}: value}, cb2);`;
      break;

    default:
      const lastIndex = parts.length - 1;
      body += `\nvar tmp0 = this.state || {};`;
      for (let i = 0; i < lastIndex; ++i) {
        body += `
var tmp${i + 1} = tmp${i}.${parts[i]};
if (tmp${i + 1} == null) {
  tmp${i + 1} = tmp${i}.${parts[i]} = {};
}`;
      }
      body += `
tmp${lastIndex}.${parts[lastIndex]} = value;
this.setState(tmp0, cb2);`;
      break;
  }

  return Function("value", "cb", body);
}

//------------------------------------------------------------------------------
function handleUpdateRequest(event) {
  if (event.defaultPrevented) {
    return;
  }
  event.applyTo(this);
}

//------------------------------------------------------------------------------
export default {
  initialize(component, storeValuePath) {
    if (component.storeMixinInitialized) {
      return;
    }

    const parts = parseStoreValuePath(storeValuePath);
    const getStoreValue = defineGetStoreValue(parts);

    if (process.env.NODE_ENV !== "production") {
      invariant(storeValuePath == null || typeof storeValuePath === "string",
                "StoreMixin: storeValuePath should be a string.");

      try {
        getStoreValue.call(component);
      }
      catch (cause) {
        let err = new Error(
          `StoreMixin: storeValuePath is invalid (${storeValuePath}).`);
        err.cause = cause;
        throw err;
      }
    }

    Object.defineProperties(component, {
      storeMixinInitialized: {
        value: true,
        configurable: true
      },

      storeMixinHandleUpdateRequest: {
        value: handleUpdateRequest.bind(component),
        configurable: true
      },

      storeValue: {
        get: getStoreValue,
        configurable: true,
        enumerable: true
      },

      setStoreValue: {
        value: defineSetStoreValue(parts).bind(component),
        configurable: true
      }
    });
  },

  setupHandler(component) {
    const node = React.findDOMNode(component);
    if (process.env.NODE_ENV !== "production") {
      invariant(node != null, "StoreMixin: requires to be rendered.");
    }
    node.addEventListener(EVENT_NAME, component.storeMixinHandleUpdateRequest);
  },

  teardownHandler(component) {
    const node = React.findDOMNode(component);
    if (node != null) {
      node.removeEventListener(
        EVENT_NAME,
        component.storeMixinHandleUpdateRequest);
    }
  }
};
