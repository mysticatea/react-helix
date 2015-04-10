import React from "react";
import Impl from "./stage-impl";

export default class StageComponent extends React.Component {
  constructor(props, stageValuePath = "") {
    super(props);
    Impl.initialize(this, stageValuePath);
  }

  componentDidMount() {
    Impl.setupHandler(this);
  }

  componentDidUpdate() {
    Impl.setupHandler(this);
  }

  componentWillUnmount() {
    Impl.teardownHandler(this);
  }

  componentWillUpdate() {
    Impl.teardownHandler(this);
  }

  filterAction(/* event */) {
    return true;
  }
}
