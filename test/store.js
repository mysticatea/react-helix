import assert from "power-assert";
import React from "react";
import {StoreComponent, StoreMixin} from "../lib/index";
import {EVENT_NAME, createUpdateRequestEvent} from "../lib/UpdateRequestEvent";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function increaseValue(obj, amount1, amount2) {
  let value = (obj && obj.value) || 0;
  if (amount1 !== undefined) {
    value += amount1;
  }
  if (amount2 !== undefined) {
    value += amount2;
  }

  // special
  if (amount1 === undefined && amount2 === undefined) {
    value = 777;
  }

  return {value};
}

function increaseValueLater(_, amount) {
  return delay(100).then(() => {
    return obj => {
      let value = (obj && obj.value) || 0;
      value += amount;
      return {value};
    };
  });
}

function* increaseValue3times(obj, amount) {
  obj = yield increaseValue(obj, amount);
  obj = yield increaseValue(obj, amount);
  yield increaseValue(obj, amount);
}

function* multiplyValue3timesSlowly(_, k) {
  yield delay(100);
  yield obj => ({value: obj.value * k});
  yield delay(100);
  yield obj => ({value: obj.value * k});
  yield delay(100);
  yield obj => ({value: obj.value * k});
}

function requestUpdate(element, action, args, callback) {
  const node = React.findDOMNode(element);
  const event = createUpdateRequestEvent(action, args, callback);
  node.dispatchEvent(event);
  event.rejectIfNotHandled();
}

function doTest(Empty, Simple, WithValuePath, WithValuePath2) {
  describe("if not rendered,", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });
    afterEach(() => {
      React.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    });

    it("should throw an error.", () => {
      assert.throws(() => {
        React.render(<Empty/>, container);
      });
    });
  });

  describe("if rendered,", () => {
    let container, target;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
      target = React.render(<Simple/>, container);
    });
    afterEach(() => {
      target = null;
      React.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    });

    it("should have \"storeValue\" getter property.", () => {
      const descriptor = Object.getOwnPropertyDescriptor(target, "storeValue");
      assert(typeof descriptor.get === "function");
    });

    it("should have \"setStoreValue\" method.", () => {
      assert(typeof target.setStoreValue === "function");
    });

    describe("should handle " + EVENT_NAME + " events.", () => {
      it("with no arguments.", done => {
        requestUpdate(target.refs.child, increaseValue, []);
        requestAnimationFrame(() => {
          assert(target.state.value === 777);
          done();
        });
      });

      it("with an argument.", done => {
        requestUpdate(target.refs.child, increaseValue, [1]);
        requestAnimationFrame(() => {
          assert(target.state.value === 1);
          done();
        });
      });

      it("with multiple arguments.", done => {
        requestUpdate(target.refs.child, increaseValue, [1, 2]);
        requestAnimationFrame(() => {
          assert(target.state.value === 3);
          done();
        });
      });

      it("with a callback.", done => {
        requestUpdate(target.refs.child, increaseValue, [], err => {
          assert(err === null);
          assert(target.state.value === 777);
          done();
        });
      });

      it("with a callback and arguments.", done => {
        requestUpdate(target.refs.child, increaseValue, [1], err => {
          assert(err === null);
          assert(target.state.value === 1);
          done();
        });
      });

      it("action should be able to return promise.", done => {
        requestUpdate(target.refs.child, increaseValueLater, [3], err => {
          assert(err === null);
          assert(target.state.value === 10);
          done();
        });
        requestUpdate(target.refs.child, increaseValue, [7]);
      });

      it("action should be able to return generator.", done => {
        requestUpdate(target.refs.child, increaseValue3times, [3], err => {
          assert(err === null);
          assert(target.state.value === 9);
          done();
        });
      });

      it("action should be able to conbinate promise and generator.", done => {
        requestUpdate(target.refs.child, multiplyValue3timesSlowly, [2], err => {
          assert(err === null);
          assert(target.state.value === 56);
          done();
        });
        requestUpdate(target.refs.child, increaseValue, [7]);
      });
    });
  });

  describe("if rendered, if has store value path,", () => {
    let container, target;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
      target = React.render(<WithValuePath/>, container);
    });
    afterEach(() => {
      target = null;
      React.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    });

    it("should handle " + EVENT_NAME + " events.", done => {
      requestUpdate(target.refs.child, increaseValue, [1], () => {
        assert(target.state.store.value === 1);
        requestUpdate(target.refs.child, increaseValue, [2], () => {
          assert(target.state.store.value === 3);
          done();
        });
      });
    });
  });

  describe("if rendered, if has deep store value path,", () => {
    let container, target;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
      target = React.render(<WithValuePath2/>, container);
    });
    afterEach(() => {
      target = null;
      React.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    });

    it("should handle " + EVENT_NAME + " events.", done => {
      requestUpdate(target.refs.child, increaseValue, [1], () => {
        assert(target.state.s.t.o.r.e.value === 1);
        requestUpdate(target.refs.child, increaseValue, [2], () => {
          assert(target.state.s.t.o.r.e.value === 3);
          done();
        });
      });
    });
  });
}

describe("StoreComponent", () => {
  doTest(
    class Empty extends StoreComponent {
      render() {
        return null;
      }
    },
    class Simple extends StoreComponent {
      constructor(props) {
        super(props);
        this.state = {value: 0};
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    },
    class WithValuePath extends StoreComponent {
      constructor(props) {
        super(props, "store");
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    },
    class WithValuePath2 extends StoreComponent {
      constructor(props) {
        super(props, "s.t.o.r.e");
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }
  );
});

describe("StoreMixin", () => {
  doTest(
    React.createClass({
      displayName: "Empty",
      mixins: [StoreMixin],

      render() {
        return null;
      }
    }),
    React.createClass({
      displayName: "Simple",
      mixins: [StoreMixin],

      getInitialState() {
        return {value: 0};
      },

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }),
    React.createClass({
      displayName: "WithValuePath",
      mixins: [StoreMixin],
      storeValuePath: "store",

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }),
    React.createClass({
      displayName: "WithValuePath2",
      mixins: [StoreMixin],
      storeValuePath: "s.t.o.r.e",

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    })
  );
});
