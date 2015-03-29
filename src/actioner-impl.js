import React from "react";
import {createUpdateRequestEvent} from "./UpdateRequestEvent";

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export default {
  validate(component) {
    const node = React.findDOMNode(component);
    invariant(node != null, "ActionerMixin: requires to be rendered.");
  },

  requestUpdate(component, action, args, callback) {
    const node = React.findDOMNode(component);
    const event = createUpdateRequestEvent(action, args, callback);

    if (process.env.NODE_ENV !== "production") {
      invariant(node != null, "ActionerMixin: requires to be rendered.");
    }
    node.dispatchEvent(event);
    event.rejectIfNotHandled();
  }
};
