import assert from "power-assert";
import React from "react";
import {StageComponent, StageMixin} from "../src/index";
import {EVENT_NAME, createSendActionEvent} from "../src/SendActionEvent";

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

function* promiseInGenerator() {
  const threeSevens = yield Promise.resolve(777);
  return obj => ({value: obj.value + threeSevens});
}

function request(element, action, args, callback) {
  const node = React.findDOMNode(element);
  const event = createSendActionEvent(action, args, callback);
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

    it("should have \"stageValue\" getter property.", () => {
      const descriptor = Object.getOwnPropertyDescriptor(target, "stageValue");
      assert(typeof descriptor.get === "function");
    });

    it("should have \"setStageValue\" method.", () => {
      assert(typeof target.setStageValue === "function");
    });

    describe("should handle " + EVENT_NAME + " events.", () => {
      it("with no arguments.", done => {
        request(target.refs.child, increaseValue, []);
        requestAnimationFrame(() => {
          assert(target.state.value === 777);
          done();
        });
      });

      it("with an argument.", done => {
        request(target.refs.child, increaseValue, [1]);
        requestAnimationFrame(() => {
          assert(target.state.value === 1);
          done();
        });
      });

      it("with multiple arguments.", done => {
        request(target.refs.child, increaseValue, [1, 2]);
        requestAnimationFrame(() => {
          assert(target.state.value === 3);
          done();
        });
      });

      it("with a callback.", done => {
        request(target.refs.child, increaseValue, [], err => {
          assert(err === null);
          assert(target.state.value === 777);
          done();
        });
      });

      it("with a callback and arguments.", done => {
        request(target.refs.child, increaseValue, [1], err => {
          assert(err === null);
          assert(target.state.value === 1);
          done();
        });
      });

      it("action should be able to return promise.", done => {
        request(target.refs.child, increaseValueLater, [3], err => {
          assert(err === null);
          assert(target.state.value === 10);
          done();
        });
        request(target.refs.child, increaseValue, [7]);
      });

      it("action should be able to return generator.", done => {
        request(target.refs.child, increaseValue3times, [3], err => {
          assert(err === null);
          assert(target.state.value === 9);
          done();
        });
      });

      it("action should be able to conbinate promise and generator.", done => {
        request(target.refs.child, multiplyValue3timesSlowly, [2], err => {
          assert(err === null);
          assert(target.state.value === 56);
          done();
        });
        request(target.refs.child, increaseValue, [7]);
      });

      it("promises in generators should not set to state.", done => {
        request(target.refs.child, promiseInGenerator, [], err => {
          assert(err === null);
          assert(target.state.value === 780);
          done();
        });
        request(target.refs.child, increaseValue, [3]);
      });
    });
  });

  describe("if rendered, if has stage value path,", () => {
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
      request(target.refs.child, increaseValue, [1], () => {
        assert(target.state.stage.value === 1);
        request(target.refs.child, increaseValue, [2], () => {
          assert(target.state.stage.value === 3);
          done();
        });
      });
    });
  });

  describe("if rendered, if has deep stage value path,", () => {
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
      request(target.refs.child, increaseValue, [1], () => {
        assert(target.state.s.t.o.r.e.value === 1);
        request(target.refs.child, increaseValue, [2], () => {
          assert(target.state.s.t.o.r.e.value === 3);
          done();
        });
      });
    });
  });
}

describe("StageComponent", () => {
  doTest(
    class Empty extends StageComponent {
      render() {
        return null;
      }
    },
    class Simple extends StageComponent {
      constructor(props) {
        super(props);
        this.state = {value: 0};
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    },
    class WithValuePath extends StageComponent {
      constructor(props) {
        super(props, "stage");
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    },
    class WithValuePath2 extends StageComponent {
      constructor(props) {
        super(props, "s.t.o.r.e");
      }

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }
  );
});

describe("StageMixin", () => {
  doTest(
    React.createClass({
      displayName: "Empty",
      mixins: [StageMixin],

      render() {
        return null;
      }
    }),
    React.createClass({
      displayName: "Simple",
      mixins: [StageMixin],

      getInitialState() {
        return {value: 0};
      },

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }),
    React.createClass({
      displayName: "WithValuePath",
      mixins: [StageMixin],
      stageValuePath: "stage",

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    }),
    React.createClass({
      displayName: "WithValuePath2",
      mixins: [StageMixin],
      stageValuePath: "s.t.o.r.e",

      render() {
        return <div><span ref="child">Hello!</span></div>;
      }
    })
  );
});
