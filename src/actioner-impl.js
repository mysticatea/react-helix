import React from "react";
import {createSentActionEvent} from "./UpdateRequestEvent";

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export default {
  validate(component) {
    if (process.env.NODE_ENV !== "production") {
      const node = React.findDOMNode(component);
      invariant(node != null, "AgentMixin: requires to be rendered.");
    }
  },

  sendAction(component, action, args, callback) {
    const node = React.findDOMNode(component);
    const event = createSentActionEvent(action, args, callback);

    if (process.env.NODE_ENV !== "production") {
      invariant(node != null, "AgentMixin: requires to be rendered.");
    }
    node.dispatchEvent(event);
    event.rejectIfNotHandled();
  }
};
