import Impl from "./agent-impl";

export default {
  componentDidMount() {
    if (process.env.NODE_ENV !== "production") {
      Impl.validate(this);
    }
  },

  componentDidUpdate() {
    if (process.env.NODE_ENV !== "production") {
      Impl.validate(this);
    }
  },

  requestTo(action /* [, ...args] [, callback] */) {
    const args = [];
    const lastIndex = arguments.length - 1;
    let callback;
    if (lastIndex >= 1) {
      for (let i = 1; i < lastIndex; ++i) {
        args.push(arguments[i]);
      }
      if (typeof arguments[lastIndex] !== "function") {
        args.push(arguments[lastIndex]);
      }
      else {
        callback = arguments[lastIndex];
      }
    }
    return Impl.sendAction(this, action, args, callback);
  }
};
