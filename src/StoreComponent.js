import React from "react";
import Impl from "./store-impl";

export default class StoreComponent extends React.Component {
  constructor(props, storeValuePath = "") {
    super(props);
    Impl.initialize(this, storeValuePath);
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
}
