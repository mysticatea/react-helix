import Impl from "./stage-impl";

export default {
  componentDidMount() {
    Impl.initialize(this, this.stageValuePath || "");
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
