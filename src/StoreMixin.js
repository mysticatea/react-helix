import Impl from "./store-impl";

export default {
  componentDidMount() {
    Impl.initialize(this, this.storeValuePath || "");
    Impl.setupHandler(this);
  },

  componentDidUpdate() {
    Impl.setupHandler(this);
  },

  componentWillUpdate() {
    Impl.teardownHandler(this);
  },

  componentWillUnmount() {
    Impl.teardownHandler(this);
  }
};
