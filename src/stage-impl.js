import React from "react";
import {EVENT_NAME} from "./SendActionEvent";

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

//------------------------------------------------------------------------------
function parseStageValuePath(value) {
  return (typeof value === "string" ? value.split(".").filter(Boolean) : []);
}

//------------------------------------------------------------------------------
function defineGetStageValue(parts) {
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
function defineSetStageValue(parts) {
  let body = `var cb2 = cb && function() { cb(this.stageValue); }.bind(this);`;

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
function handleSendAction(event) {
  if (event.defaultPrevented) {
    return;
  }
  if (typeof this.filterAction === "function" && !this.filterAction(event)) {
    return;
  }
  event.stopPropagation();
  event.applyTo(this);
}

//------------------------------------------------------------------------------
export default {
  initialize(component, stageValuePath) {
    if (component.stageMixinInitialized) {
      return;
    }

    const parts = parseStageValuePath(stageValuePath);
    const getStageValue = defineGetStageValue(parts);

    if (process.env.NODE_ENV !== "production") {
      invariant(stageValuePath == null || typeof stageValuePath === "string",
                "StageMixin: stageValuePath should be a string.");

      try {
        getStageValue.call(component);
      }
      catch (cause) {
        let err = new Error(
          `StageMixin: stageValuePath is invalid (${stageValuePath}).`);
        err.cause = cause;
        throw err;
      }
    }

    Object.defineProperties(component, {
      stageMixinInitialized: {
        value: true,
        configurable: true
      },

      stageMixinHandleSendAction: {
        value: handleSendAction.bind(component),
        configurable: true
      },

      stageValue: {
        get: getStageValue,
        configurable: true,
        enumerable: true
      },

      setStageValue: {
        value: defineSetStageValue(parts).bind(component),
        configurable: true
      }
    });
  },

  setupHandler(component) {
    const node = React.findDOMNode(component);
    if (process.env.NODE_ENV !== "production") {
      invariant(node != null, "StageMixin: requires to be rendered.");
    }
    node.addEventListener(EVENT_NAME, component.stageMixinHandleSendAction);
  },

  teardownHandler(component) {
    const node = React.findDOMNode(component);
    if (node != null) {
      node.removeEventListener(
        EVENT_NAME,
        component.stageMixinHandleSendAction);
    }
  }
};
