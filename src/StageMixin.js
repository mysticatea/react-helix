import Impl from "./stage-impl";

export default {
  componentWillMount() {
    Impl.initialize(this, this.stageValuePath || "");
  },

  componentDidMount() {
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
