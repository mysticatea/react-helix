import assert from "power-assert";
import React from "react";
import {AgentComponent, AgentMixin} from "../src/index";
import {EVENT_NAME} from "../src/SendActionEvent";

function increaseValue(obj, amount) {
  return {value: (obj.value || 0) + amount};
}

function doTest(Empty, Simple) {
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

    it("should have \"request\" method.", () => {
      assert(typeof target.request === "function");
    });

    describe("\"request\" should fire an " + EVENT_NAME + " event.", () => {
      let event, listener;

      beforeEach(() => {
        listener = (e) => {
          assert(event == null);
          event = e;
        };
        addEventListener(EVENT_NAME, listener);
      });
      afterEach(() => {
        removeEventListener(EVENT_NAME, listener);
        event = listener = null;
      });

      it("with no arguments.", () => {
        target.request(increaseValue);

        assert(event instanceof Event);
        assert(event.action === increaseValue);
        assert(event.arguments.length === 0);
      });

      it("with an argument.", () => {
        target.request(increaseValue, 777);

        assert(event instanceof Event);
        assert(event.action === increaseValue);
        assert(event.arguments.length === 1);
        assert(event.arguments[0] === 777);
      });

      it("with multiple arguments.", () => {
        target.request(increaseValue, 777, 888);

        assert(event instanceof Event);
        assert(event.action === increaseValue);
        assert(event.arguments.length === 2);
        assert(event.arguments[0] === 777);
        assert(event.arguments[1] === 888);
      });

      it("with a callback.", () => {
        function callback() {
          assert(callback.called === false);
          callback.called = true;
        }
        callback.called = false;

        target.request(increaseValue, callback);

        assert(callback.called);
        assert(event instanceof Event);
        assert(event.action === increaseValue);
        assert(event.arguments.length === 0);
      });

      it("with a callback and arguments.", () => {
        function callback() {
          assert(callback.called === false);
          callback.called = true;
        }
        callback.called = false;

        target.request(increaseValue, 777, callback);

        assert(callback.called);
        assert(event instanceof Event);
        assert(event.action === increaseValue);
        assert(event.arguments.length === 1);
        assert(event.arguments[0] === 777);
      });
    });
  });
}

describe("AgentComponent", () => {
  doTest(
    class Empty extends AgentComponent {
      render() {
        return null;
      }
    },
    class Simple extends AgentComponent {
      constructor(props) {
        super(props);
      }

      render() {
        return <div>Hello!</div>;
      }
    }
  );
});

describe("AgentMixin", () => {
  doTest(
    React.createClass({
      displayName: "Empty",
      mixins: [AgentMixin],

      render() {
        return null;
      }
    }),
    React.createClass({
      displayName: "Simple",
      mixins: [AgentMixin],

      render() {
        return <div>Hello!</div>;
      }
    })
  );
});
