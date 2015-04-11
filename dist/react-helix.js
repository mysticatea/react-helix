(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactHelix = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Impl = require("./agent-impl");

var _Impl2 = _interopRequireWildcard(_Impl);

var AgentComponent = (function (_React$Component) {
  function AgentComponent() {
    _classCallCheck(this, AgentComponent);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(AgentComponent, _React$Component);

  _createClass(AgentComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if ("development" !== "production") {
        _Impl2["default"].validate(this);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if ("development" !== "production") {
        _Impl2["default"].validate(this);
      }
    }
  }, {
    key: "request",
    value: function request(action /* [, ...args] [, callback] */) {
      var args = [];
      var lastIndex = arguments.length - 1;
      var callback = undefined;
      if (lastIndex >= 1) {
        for (var i = 1; i < lastIndex; ++i) {
          args.push(arguments[i]);
        }
        if (typeof arguments[lastIndex] !== "function") {
          args.push(arguments[lastIndex]);
        } else {
          callback = arguments[lastIndex];
        }
      }
      return _Impl2["default"].sendAction(this, action, args, callback);
    }
  }]);

  return AgentComponent;
})(_React2["default"].Component);

exports["default"] = AgentComponent;
module.exports = exports["default"];
},{"./agent-impl":6,"react":"react"}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Impl = require("./agent-impl");

var _Impl2 = _interopRequireWildcard(_Impl);

exports["default"] = {
  componentDidMount: function componentDidMount() {
    if ("development" !== "production") {
      _Impl2["default"].validate(this);
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if ("development" !== "production") {
      _Impl2["default"].validate(this);
    }
  },

  request: function request(action /* [, ...args] [, callback] */) {
    var args = [];
    var lastIndex = arguments.length - 1;
    var callback = undefined;
    if (lastIndex >= 1) {
      for (var i = 1; i < lastIndex; ++i) {
        args.push(arguments[i]);
      }
      if (typeof arguments[lastIndex] !== "function") {
        args.push(arguments[lastIndex]);
      } else {
        callback = arguments[lastIndex];
      }
    }
    return _Impl2["default"].sendAction(this, action, args, callback);
  }
};
module.exports = exports["default"];
},{"./agent-impl":6}],3:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @param action {function} - A function to transform the state.
 * @param args {any[]} - Information for action.  This value is given to the
 *   second argument of action.
 * @return {SendActionEvent} - The created event object.
 */
exports.createSendActionEvent = createSendActionEvent;
// There are several cross-callings in this file.
/*eslint no-use-before-define:[2,"nofunc"]*/

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isFunction(x) {
  return typeof x === "function";
}

function isThenable(x) {
  return typeof x === "object" && typeof x.then === "function";
}

function isGenerator(x) {
  return typeof x === "object" && typeof x.next === "function" && typeof x["throw"] === "function";
}

function printError(error) {
  // This function is used in (process.env.NODE_ENV !== "production").
  if (error != null) {
    console.error(error); //eslint-disable-line no-console
  }
}

// A handler that is used if value is not all of undefined, a function, a
// promise, and a generator.
// Just it sets the value to the component's stage value.
function set(component, isInGenerator, value, resolve, reject) {
  try {
    component.setStageValue(value, resolve);
  } catch (err) {
    reject(err);
  }
}

// A handler that is used if value is a function.
// It calls the function together with the component's stage value.
// Then set the result to the component's stage value.
function callAndSet(component, isInGenerator, func, resolve, reject) {
  var result = undefined;
  try {
    result = func(component.stageValue);
  } catch (error) {
    reject(error);
    return;
  }
  setUnified(component, isInGenerator, result, resolve, reject);
}

// A handler that is used if value is a promise.
// It waits for the promise become fulfilled.
// Then set the result to the component's stage value.
// But if is while advancing a generator, it doesn't set to the stage value,
// just returns the result.
function waitAndSet(component, isInGenerator, promise, resolve, reject) {
  var promise2 = promise.then(function (result) {
    if (isInGenerator) {
      resolve(result);
    } else {
      setUnified(component, isInGenerator, result, resolve, reject);
    }
  }, reject);

  if ("development" !== "production") {
    promise2["catch"](printError);
  }
}

// A handler that is used if value is a generator.
// Process a generator. ping-pong the component's stage value.
function advanceToEnd(component, isInGenerator, generator, resolve, reject) {
  onFulfilled(undefined);

  function onFulfilled(stageValue) {
    var ret = undefined;
    try {
      ret = generator.next(stageValue);
    } catch (err) {
      reject(err);
      return;
    }

    next(ret);
  }

  function onRejected(err) {
    var ret = undefined;
    try {
      ret = generator["throw"](err);
    } catch (err2) {
      reject(err2);
      return;
    }

    next(ret);
  }

  function next(ret) {
    if (ret.done) {
      setUnified(component, true, ret.value, resolve, reject);
    } else {
      setUnified(component, true, ret.value, onFulfilled, onRejected);
    }
  }
}

// Check type of the value, and handle the value.
function setUnified(component, isInGenerator, value, resolve, reject) {
  if (value === undefined) {
    resolve(component.stageValue);
    return;
  }

  var handle = isFunction(value) ? callAndSet : isThenable(value) ? waitAndSet : isGenerator(value) ? advanceToEnd :
  /* otherwise */set;

  handle(component, isInGenerator, value, resolve, reject);
}

/**
 * The event name for `SendActionEvent`.
 * @type {string}
 */
var EVENT_NAME = "helix-sent-action";exports.EVENT_NAME = EVENT_NAME;

function createSendActionEvent(action, args, callback) {
  if ("development" !== "production") {
    invariant(typeof action === "function", "action should be a function.");
    invariant(Array.isArray(args), "args should be an array.");
    invariant(callback == null || typeof callback === "function", "callback should be a function or nothing.");

    if (callback == null) {
      callback = printError;
    }
  }

  var event = document.createEvent("CustomEvent");
  var handled = false;

  event.initCustomEvent(EVENT_NAME, true, true, null);
  Object.defineProperties(event, {
    action: {
      value: action,
      configurable: true,
      enumerable: true,
      writable: true
    },

    arguments: {
      value: args,
      configurable: true,
      enumerable: true,
      writable: true
    },

    // This is internal method, called from StageMixin.
    applyTo: { value: function applyTo(component) {
        if ("development" !== "production") {
          var get = Object.getOwnPropertyDescriptor(component, "stageValue");
          var _set = Object.getOwnPropertyDescriptor(component, "setStageValue");
          invariant(isFunction(get.get), "component.stageValue should be a getter property.");
          invariant(isFunction(_set.value), "component.setStageValue should be a function.");
          invariant(handled === false, "this " + EVENT_NAME + " event had been applied already.");
          invariant(isFunction(this.action), "this.action should be a function.");
          invariant(Array.isArray(this.arguments), "this.arguments should be an array.");
        }
        handled = true;

        var value = undefined;
        try {
          value = this.action.apply(this, [component.stageValue].concat(_toConsumableArray(this.arguments)));
        } catch (error) {
          if (callback != null) {
            callback(error);
          }
          return;
        }

        setUnified(component, false, value, function (result) {
          return callback && callback(null, result);
        }, callback);
      } },

    // This is internal method, called from AgentMixin.
    rejectIfNotHandled: { value: function rejectIfNotHandled() {
        if (handled === false) {
          handled = true;
          if (callback != null) {
            callback(new Error("not handled"));
          }
        }
      } }
  });

  return event;
}
},{}],4:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Impl = require("./stage-impl");

var _Impl2 = _interopRequireWildcard(_Impl);

var StageComponent = (function (_React$Component) {
  function StageComponent(props) {
    var stageValuePath = arguments[1] === undefined ? "" : arguments[1];

    _classCallCheck(this, StageComponent);

    _get(Object.getPrototypeOf(StageComponent.prototype), "constructor", this).call(this, props);
    _Impl2["default"].initialize(this, stageValuePath);
  }

  _inherits(StageComponent, _React$Component);

  _createClass(StageComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _Impl2["default"].setupHandler(this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      _Impl2["default"].setupHandler(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _Impl2["default"].teardownHandler(this);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      _Impl2["default"].teardownHandler(this);
    }
  }, {
    key: "filterAction",
    value: function filterAction() {
      return true;
    }
  }]);

  return StageComponent;
})(_React2["default"].Component);

exports["default"] = StageComponent;
module.exports = exports["default"];
/* event */
},{"./stage-impl":8,"react":"react"}],5:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Impl = require("./stage-impl");

var _Impl2 = _interopRequireWildcard(_Impl);

exports["default"] = {
  componentWillMount: function componentWillMount() {
    _Impl2["default"].initialize(this, this.stageValuePath || "");
  },

  componentDidMount: function componentDidMount() {
    _Impl2["default"].setupHandler(this);
  },

  componentDidUpdate: function componentDidUpdate() {
    _Impl2["default"].setupHandler(this);
  },

  componentWillUpdate: function componentWillUpdate() {
    _Impl2["default"].teardownHandler(this);
  },

  componentWillUnmount: function componentWillUnmount() {
    _Impl2["default"].teardownHandler(this);
  }
};
module.exports = exports["default"];
},{"./stage-impl":8}],6:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _createSendActionEvent = require("./SendActionEvent");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

exports["default"] = {
  validate: function validate(component) {
    if ("development" !== "production") {
      var node = _React2["default"].findDOMNode(component);
      invariant(node != null, "AgentMixin: requires to be rendered.");
    }
  },

  sendAction: function sendAction(component, action, args, callback) {
    var node = _React2["default"].findDOMNode(component);
    var event = _createSendActionEvent.createSendActionEvent(action, args, callback);

    if ("development" !== "production") {
      invariant(node != null, "AgentMixin: requires to be rendered.");
    }
    node.dispatchEvent(event);
    event.rejectIfNotHandled();
  }
};
module.exports = exports["default"];
},{"./SendActionEvent":3,"react":"react"}],7:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AgentComponent = require("./AgentComponent");

var _AgentComponent2 = _interopRequireWildcard(_AgentComponent);

var _AgentMixin = require("./AgentMixin");

var _AgentMixin2 = _interopRequireWildcard(_AgentMixin);

var _StageComponent = require("./StageComponent");

var _StageComponent2 = _interopRequireWildcard(_StageComponent);

var _StageMixin = require("./StageMixin");

var _StageMixin2 = _interopRequireWildcard(_StageMixin);

exports["default"] = {
  AgentComponent: _AgentComponent2["default"],
  AgentMixin: _AgentMixin2["default"],
  StageComponent: _StageComponent2["default"],
  StageMixin: _StageMixin2["default"]
};
exports.AgentComponent = _AgentComponent2["default"];
exports.AgentMixin = _AgentMixin2["default"];
exports.StageComponent = _StageComponent2["default"];
exports.StageMixin = _StageMixin2["default"];
},{"./AgentComponent":1,"./AgentMixin":2,"./StageComponent":4,"./StageMixin":5}],8:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _EVENT_NAME = require("./SendActionEvent");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

//------------------------------------------------------------------------------
function parseStageValuePath(value) {
  return typeof value === "string" ? value.split(".").filter(Boolean) : [];
}

//------------------------------------------------------------------------------
function defineGetStageValue(parts) {
  var body = undefined;
  switch (parts.length) {
    case 0:
      body = "return this.state;";
      break;

    default:
      var lastIndex = parts.length - 1;
      body = "var tmp0 = this.state;";
      for (var i = 0; i < lastIndex; ++i) {
        body += "\nif (tmp" + i + " == null) {\n  return undefined;\n}\nvar tmp" + (i + 1) + " = tmp" + i + "." + parts[i] + ";";
      }
      body += "\nreturn tmp" + lastIndex + " && tmp" + lastIndex + "." + parts[lastIndex] + ";";
      break;
  }

  return Function(body);
}

//------------------------------------------------------------------------------
function defineSetStageValue(parts) {
  var body = "var cb2 = cb && function() { cb(this.stageValue); }.bind(this);";

  switch (parts.length) {
    case 0:
      body += "\nthis.setState(value, cb2);";
      break;

    case 1:
      body += "\nthis.setState({" + parts[0] + ": value}, cb2);";
      break;

    default:
      var lastIndex = parts.length - 1;
      body += "\nvar tmp0 = this.state || {};";
      for (var i = 0; i < lastIndex; ++i) {
        body += "\nvar tmp" + (i + 1) + " = tmp" + i + "." + parts[i] + ";\nif (tmp" + (i + 1) + " == null) {\n  tmp" + (i + 1) + " = tmp" + i + "." + parts[i] + " = {};\n}";
      }
      body += "\ntmp" + lastIndex + "." + parts[lastIndex] + " = value;\nthis.setState(tmp0, cb2);";
      break;
  }

  return Function("value", "cb", body);
}

//------------------------------------------------------------------------------
function handleSendAction(event) {
  if (event.defaultPrevented) {
    return;
  }
  if (typeof this.filterAction === "function" && !this.filterAction(event)) {
    return;
  }
  event.stopPropagation();
  event.applyTo(this);
}

//------------------------------------------------------------------------------
exports["default"] = {
  initialize: function initialize(component, stageValuePath) {
    if (component.stageMixinInitialized) {
      return;
    }

    var parts = parseStageValuePath(stageValuePath);
    var getStageValue = defineGetStageValue(parts);

    if ("development" !== "production") {
      invariant(stageValuePath == null || typeof stageValuePath === "string", "StageMixin: stageValuePath should be a string.");

      try {
        getStageValue.call(component);
      } catch (cause) {
        var err = new Error("StageMixin: stageValuePath is invalid (" + stageValuePath + ").");
        err.cause = cause;
        throw err;
      }
    }

    Object.defineProperties(component, {
      stageMixinInitialized: {
        value: true,
        configurable: true
      },

      stageMixinHandleSendAction: {
        value: handleSendAction.bind(component),
        configurable: true
      },

      stageValue: {
        get: getStageValue,
        configurable: true,
        enumerable: true
      },

      setStageValue: {
        value: defineSetStageValue(parts).bind(component),
        configurable: true
      }
    });
  },

  setupHandler: function setupHandler(component) {
    var node = _React2["default"].findDOMNode(component);
    if ("development" !== "production") {
      invariant(node != null, "StageMixin: requires to be rendered.");
    }
    node.addEventListener(_EVENT_NAME.EVENT_NAME, component.stageMixinHandleSendAction);
  },

  teardownHandler: function teardownHandler(component) {
    var node = _React2["default"].findDOMNode(component);
    if (node != null) {
      node.removeEventListener(_EVENT_NAME.EVENT_NAME, component.stageMixinHandleSendAction);
    }
  }
};
module.exports = exports["default"];
},{"./SendActionEvent":3,"react":"react"}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQWdlbnRDb21wb25lbnQuanMiLCJsaWIvQWdlbnRNaXhpbi5qcyIsImxpYi9TZW5kQWN0aW9uRXZlbnQuanMiLCJsaWIvU3RhZ2VDb21wb25lbnQuanMiLCJsaWIvU3RhZ2VNaXhpbi5qcyIsImxpYi9hZ2VudC1pbXBsLmpzIiwibGliL2luZGV4LmpzIiwibGliL3N0YWdlLWltcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9O1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxudmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX1JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9SZWFjdCk7XG5cbnZhciBfSW1wbCA9IHJlcXVpcmUoXCIuL2FnZW50LWltcGxcIik7XG5cbnZhciBfSW1wbDIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfSW1wbCk7XG5cbnZhciBBZ2VudENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICBmdW5jdGlvbiBBZ2VudENvbXBvbmVudCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWdlbnRDb21wb25lbnQpO1xuXG4gICAgaWYgKF9SZWFjdCRDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIF9pbmhlcml0cyhBZ2VudENvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgX2NyZWF0ZUNsYXNzKEFnZW50Q29tcG9uZW50LCBbe1xuICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udmFsaWRhdGUodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvbmVudERpZFVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnZhbGlkYXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3QoYWN0aW9uIC8qIFssIC4uLmFyZ3NdIFssIGNhbGxiYWNrXSAqLykge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgIGlmIChsYXN0SW5kZXggPj0gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbbGFzdEluZGV4XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tsYXN0SW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tsYXN0SW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX0ltcGwyW1wiZGVmYXVsdFwiXS5zZW5kQWN0aW9uKHRoaXMsIGFjdGlvbiwgYXJncywgY2FsbGJhY2spO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBBZ2VudENvbXBvbmVudDtcbn0pKF9SZWFjdDJbXCJkZWZhdWx0XCJdLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQWdlbnRDb21wb25lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9JbXBsID0gcmVxdWlyZShcIi4vYWdlbnQtaW1wbFwiKTtcblxudmFyIF9JbXBsMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9JbXBsKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgX0ltcGwyW1wiZGVmYXVsdFwiXS52YWxpZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udmFsaWRhdGUodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uIHJlcXVlc3QoYWN0aW9uIC8qIFssIC4uLmFyZ3NdIFssIGNhbGxiYWNrXSAqLykge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGxhc3RJbmRleCA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICAgIHZhciBjYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICBpZiAobGFzdEluZGV4ID49IDEpIHtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGFzdEluZGV4OyArK2kpIHtcbiAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tsYXN0SW5kZXhdICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tsYXN0SW5kZXhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2xhc3RJbmRleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfSW1wbDJbXCJkZWZhdWx0XCJdLnNlbmRBY3Rpb24odGhpcywgYWN0aW9uLCBhcmdzLCBjYWxsYmFjayk7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX3RvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogQHBhcmFtIGFjdGlvbiB7ZnVuY3Rpb259IC0gQSBmdW5jdGlvbiB0byB0cmFuc2Zvcm0gdGhlIHN0YXRlLlxuICogQHBhcmFtIGFyZ3Mge2FueVtdfSAtIEluZm9ybWF0aW9uIGZvciBhY3Rpb24uICBUaGlzIHZhbHVlIGlzIGdpdmVuIHRvIHRoZVxuICogICBzZWNvbmQgYXJndW1lbnQgb2YgYWN0aW9uLlxuICogQHJldHVybiB7U2VuZEFjdGlvbkV2ZW50fSAtIFRoZSBjcmVhdGVkIGV2ZW50IG9iamVjdC5cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZW5kQWN0aW9uRXZlbnQgPSBjcmVhdGVTZW5kQWN0aW9uRXZlbnQ7XG4vLyBUaGVyZSBhcmUgc2V2ZXJhbCBjcm9zcy1jYWxsaW5ncyBpbiB0aGlzIGZpbGUuXG4vKmVzbGludCBuby11c2UtYmVmb3JlLWRlZmluZTpbMixcIm5vZnVuY1wiXSovXG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG5mdW5jdGlvbiBpc1RoZW5hYmxlKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB4LnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNHZW5lcmF0b3IoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHgubmV4dCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB4W1widGhyb3dcIl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gcHJpbnRFcnJvcihlcnJvcikge1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgaW4gKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikuXG4gIGlmIChlcnJvciAhPSBudWxsKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7IC8vZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIH1cbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBub3QgYWxsIG9mIHVuZGVmaW5lZCwgYSBmdW5jdGlvbiwgYVxuLy8gcHJvbWlzZSwgYW5kIGEgZ2VuZXJhdG9yLlxuLy8gSnVzdCBpdCBzZXRzIHRoZSB2YWx1ZSB0byB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG5mdW5jdGlvbiBzZXQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHRyeSB7XG4gICAgY29tcG9uZW50LnNldFN0YWdlVmFsdWUodmFsdWUsIHJlc29sdmUpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZWplY3QoZXJyKTtcbiAgfVxufVxuXG4vLyBBIGhhbmRsZXIgdGhhdCBpcyB1c2VkIGlmIHZhbHVlIGlzIGEgZnVuY3Rpb24uXG4vLyBJdCBjYWxscyB0aGUgZnVuY3Rpb24gdG9nZXRoZXIgd2l0aCB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG4vLyBUaGVuIHNldCB0aGUgcmVzdWx0IHRvIHRoZSBjb21wb25lbnQncyBzdGFnZSB2YWx1ZS5cbmZ1bmN0aW9uIGNhbGxBbmRTZXQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCBmdW5jLCByZXNvbHZlLCByZWplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmdW5jKGNvbXBvbmVudC5zdGFnZVZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgcmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xufVxuXG4vLyBBIGhhbmRsZXIgdGhhdCBpcyB1c2VkIGlmIHZhbHVlIGlzIGEgcHJvbWlzZS5cbi8vIEl0IHdhaXRzIGZvciB0aGUgcHJvbWlzZSBiZWNvbWUgZnVsZmlsbGVkLlxuLy8gVGhlbiBzZXQgdGhlIHJlc3VsdCB0byB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG4vLyBCdXQgaWYgaXMgd2hpbGUgYWR2YW5jaW5nIGEgZ2VuZXJhdG9yLCBpdCBkb2Vzbid0IHNldCB0byB0aGUgc3RhZ2UgdmFsdWUsXG4vLyBqdXN0IHJldHVybnMgdGhlIHJlc3VsdC5cbmZ1bmN0aW9uIHdhaXRBbmRTZXQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCBwcm9taXNlLCByZXNvbHZlLCByZWplY3QpIHtcbiAgdmFyIHByb21pc2UyID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICBpZiAoaXNJbkdlbmVyYXRvcikge1xuICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgcmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgIH1cbiAgfSwgcmVqZWN0KTtcblxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIHByb21pc2UyW1wiY2F0Y2hcIl0ocHJpbnRFcnJvcik7XG4gIH1cbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBhIGdlbmVyYXRvci5cbi8vIFByb2Nlc3MgYSBnZW5lcmF0b3IuIHBpbmctcG9uZyB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG5mdW5jdGlvbiBhZHZhbmNlVG9FbmQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCBnZW5lcmF0b3IsIHJlc29sdmUsIHJlamVjdCkge1xuICBvbkZ1bGZpbGxlZCh1bmRlZmluZWQpO1xuXG4gIGZ1bmN0aW9uIG9uRnVsZmlsbGVkKHN0YWdlVmFsdWUpIHtcbiAgICB2YXIgcmV0ID0gdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICByZXQgPSBnZW5lcmF0b3IubmV4dChzdGFnZVZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5leHQocmV0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVqZWN0ZWQoZXJyKSB7XG4gICAgdmFyIHJldCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gZ2VuZXJhdG9yW1widGhyb3dcIl0oZXJyKTtcbiAgICB9IGNhdGNoIChlcnIyKSB7XG4gICAgICByZWplY3QoZXJyMik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmV4dChyZXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV4dChyZXQpIHtcbiAgICBpZiAocmV0LmRvbmUpIHtcbiAgICAgIHNldFVuaWZpZWQoY29tcG9uZW50LCB0cnVlLCByZXQudmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFVuaWZpZWQoY29tcG9uZW50LCB0cnVlLCByZXQudmFsdWUsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gQ2hlY2sgdHlwZSBvZiB0aGUgdmFsdWUsIGFuZCBoYW5kbGUgdGhlIHZhbHVlLlxuZnVuY3Rpb24gc2V0VW5pZmllZChjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXNvbHZlKGNvbXBvbmVudC5zdGFnZVZhbHVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaGFuZGxlID0gaXNGdW5jdGlvbih2YWx1ZSkgPyBjYWxsQW5kU2V0IDogaXNUaGVuYWJsZSh2YWx1ZSkgPyB3YWl0QW5kU2V0IDogaXNHZW5lcmF0b3IodmFsdWUpID8gYWR2YW5jZVRvRW5kIDpcbiAgLyogb3RoZXJ3aXNlICovc2V0O1xuXG4gIGhhbmRsZShjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xufVxuXG4vKipcbiAqIFRoZSBldmVudCBuYW1lIGZvciBgU2VuZEFjdGlvbkV2ZW50YC5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbnZhciBFVkVOVF9OQU1FID0gXCJoZWxpeC1zZW50LWFjdGlvblwiO2V4cG9ydHMuRVZFTlRfTkFNRSA9IEVWRU5UX05BTUU7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlbmRBY3Rpb25FdmVudChhY3Rpb24sIGFyZ3MsIGNhbGxiYWNrKSB7XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgaW52YXJpYW50KHR5cGVvZiBhY3Rpb24gPT09IFwiZnVuY3Rpb25cIiwgXCJhY3Rpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgIGludmFyaWFudChBcnJheS5pc0FycmF5KGFyZ3MpLCBcImFyZ3Mgc2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICBpbnZhcmlhbnQoY2FsbGJhY2sgPT0gbnVsbCB8fCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiwgXCJjYWxsYmFjayBzaG91bGQgYmUgYSBmdW5jdGlvbiBvciBub3RoaW5nLlwiKTtcblxuICAgIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICBjYWxsYmFjayA9IHByaW50RXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtcbiAgdmFyIGhhbmRsZWQgPSBmYWxzZTtcblxuICBldmVudC5pbml0Q3VzdG9tRXZlbnQoRVZFTlRfTkFNRSwgdHJ1ZSwgdHJ1ZSwgbnVsbCk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGV2ZW50LCB7XG4gICAgYWN0aW9uOiB7XG4gICAgICB2YWx1ZTogYWN0aW9uLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIGFyZ3VtZW50czoge1xuICAgICAgdmFsdWU6IGFyZ3MsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gVGhpcyBpcyBpbnRlcm5hbCBtZXRob2QsIGNhbGxlZCBmcm9tIFN0YWdlTWl4aW4uXG4gICAgYXBwbHlUbzogeyB2YWx1ZTogZnVuY3Rpb24gYXBwbHlUbyhjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICB2YXIgZ2V0ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb21wb25lbnQsIFwic3RhZ2VWYWx1ZVwiKTtcbiAgICAgICAgICB2YXIgX3NldCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9uZW50LCBcInNldFN0YWdlVmFsdWVcIik7XG4gICAgICAgICAgaW52YXJpYW50KGlzRnVuY3Rpb24oZ2V0LmdldCksIFwiY29tcG9uZW50LnN0YWdlVmFsdWUgc2hvdWxkIGJlIGEgZ2V0dGVyIHByb3BlcnR5LlwiKTtcbiAgICAgICAgICBpbnZhcmlhbnQoaXNGdW5jdGlvbihfc2V0LnZhbHVlKSwgXCJjb21wb25lbnQuc2V0U3RhZ2VWYWx1ZSBzaG91bGQgYmUgYSBmdW5jdGlvbi5cIik7XG4gICAgICAgICAgaW52YXJpYW50KGhhbmRsZWQgPT09IGZhbHNlLCBcInRoaXMgXCIgKyBFVkVOVF9OQU1FICsgXCIgZXZlbnQgaGFkIGJlZW4gYXBwbGllZCBhbHJlYWR5LlwiKTtcbiAgICAgICAgICBpbnZhcmlhbnQoaXNGdW5jdGlvbih0aGlzLmFjdGlvbiksIFwidGhpcy5hY3Rpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgICAgICAgIGludmFyaWFudChBcnJheS5pc0FycmF5KHRoaXMuYXJndW1lbnRzKSwgXCJ0aGlzLmFyZ3VtZW50cyBzaG91bGQgYmUgYW4gYXJyYXkuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuXG4gICAgICAgIHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuYWN0aW9uLmFwcGx5KHRoaXMsIFtjb21wb25lbnQuc3RhZ2VWYWx1ZV0uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh0aGlzLmFyZ3VtZW50cykpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgZmFsc2UsIHZhbHVlLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgIH0gfSxcblxuICAgIC8vIFRoaXMgaXMgaW50ZXJuYWwgbWV0aG9kLCBjYWxsZWQgZnJvbSBBZ2VudE1peGluLlxuICAgIHJlamVjdElmTm90SGFuZGxlZDogeyB2YWx1ZTogZnVuY3Rpb24gcmVqZWN0SWZOb3RIYW5kbGVkKCkge1xuICAgICAgICBpZiAoaGFuZGxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKFwibm90IGhhbmRsZWRcIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSB9XG4gIH0pO1xuXG4gIHJldHVybiBldmVudDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG52YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX1JlYWN0KTtcblxudmFyIF9JbXBsID0gcmVxdWlyZShcIi4vc3RhZ2UtaW1wbFwiKTtcblxudmFyIF9JbXBsMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9JbXBsKTtcblxudmFyIFN0YWdlQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gIGZ1bmN0aW9uIFN0YWdlQ29tcG9uZW50KHByb3BzKSB7XG4gICAgdmFyIHN0YWdlVmFsdWVQYXRoID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBcIlwiIDogYXJndW1lbnRzWzFdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN0YWdlQ29tcG9uZW50KTtcblxuICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFN0YWdlQ29tcG9uZW50LnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgX0ltcGwyW1wiZGVmYXVsdFwiXS5pbml0aWFsaXplKHRoaXMsIHN0YWdlVmFsdWVQYXRoKTtcbiAgfVxuXG4gIF9pbmhlcml0cyhTdGFnZUNvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgX2NyZWF0ZUNsYXNzKFN0YWdlQ29tcG9uZW50LCBbe1xuICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0uc2V0dXBIYW5kbGVyKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wb25lbnREaWRVcGRhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgX0ltcGwyW1wiZGVmYXVsdFwiXS5zZXR1cEhhbmRsZXIodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvbmVudFdpbGxVbm1vdW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgX0ltcGwyW1wiZGVmYXVsdFwiXS50ZWFyZG93bkhhbmRsZXIodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvbmVudFdpbGxVcGRhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udGVhcmRvd25IYW5kbGVyKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmaWx0ZXJBY3Rpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlsdGVyQWN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0YWdlQ29tcG9uZW50O1xufSkoX1JlYWN0MltcImRlZmF1bHRcIl0uQ29tcG9uZW50KTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTdGFnZUNvbXBvbmVudDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4vKiBldmVudCAqLyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9JbXBsID0gcmVxdWlyZShcIi4vc3RhZ2UtaW1wbFwiKTtcblxudmFyIF9JbXBsMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9JbXBsKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0uaW5pdGlhbGl6ZSh0aGlzLCB0aGlzLnN0YWdlVmFsdWVQYXRoIHx8IFwiXCIpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnNldHVwSGFuZGxlcih0aGlzKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnNldHVwSGFuZGxlcih0aGlzKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0udGVhcmRvd25IYW5kbGVyKHRoaXMpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnRlYXJkb3duSGFuZGxlcih0aGlzKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX1JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9SZWFjdCk7XG5cbnZhciBfY3JlYXRlU2VuZEFjdGlvbkV2ZW50ID0gcmVxdWlyZShcIi4vU2VuZEFjdGlvbkV2ZW50XCIpO1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUoY29tcG9uZW50KSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICAgIGludmFyaWFudChub2RlICE9IG51bGwsIFwiQWdlbnRNaXhpbjogcmVxdWlyZXMgdG8gYmUgcmVuZGVyZWQuXCIpO1xuICAgIH1cbiAgfSxcblxuICBzZW5kQWN0aW9uOiBmdW5jdGlvbiBzZW5kQWN0aW9uKGNvbXBvbmVudCwgYWN0aW9uLCBhcmdzLCBjYWxsYmFjaykge1xuICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICB2YXIgZXZlbnQgPSBfY3JlYXRlU2VuZEFjdGlvbkV2ZW50LmNyZWF0ZVNlbmRBY3Rpb25FdmVudChhY3Rpb24sIGFyZ3MsIGNhbGxiYWNrKTtcblxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQobm9kZSAhPSBudWxsLCBcIkFnZW50TWl4aW46IHJlcXVpcmVzIHRvIGJlIHJlbmRlcmVkLlwiKTtcbiAgICB9XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICBldmVudC5yZWplY3RJZk5vdEhhbmRsZWQoKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0FnZW50Q29tcG9uZW50ID0gcmVxdWlyZShcIi4vQWdlbnRDb21wb25lbnRcIik7XG5cbnZhciBfQWdlbnRDb21wb25lbnQyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX0FnZW50Q29tcG9uZW50KTtcblxudmFyIF9BZ2VudE1peGluID0gcmVxdWlyZShcIi4vQWdlbnRNaXhpblwiKTtcblxudmFyIF9BZ2VudE1peGluMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9BZ2VudE1peGluKTtcblxudmFyIF9TdGFnZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL1N0YWdlQ29tcG9uZW50XCIpO1xuXG52YXIgX1N0YWdlQ29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9TdGFnZUNvbXBvbmVudCk7XG5cbnZhciBfU3RhZ2VNaXhpbiA9IHJlcXVpcmUoXCIuL1N0YWdlTWl4aW5cIik7XG5cbnZhciBfU3RhZ2VNaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfU3RhZ2VNaXhpbik7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBBZ2VudENvbXBvbmVudDogX0FnZW50Q29tcG9uZW50MltcImRlZmF1bHRcIl0sXG4gIEFnZW50TWl4aW46IF9BZ2VudE1peGluMltcImRlZmF1bHRcIl0sXG4gIFN0YWdlQ29tcG9uZW50OiBfU3RhZ2VDb21wb25lbnQyW1wiZGVmYXVsdFwiXSxcbiAgU3RhZ2VNaXhpbjogX1N0YWdlTWl4aW4yW1wiZGVmYXVsdFwiXVxufTtcbmV4cG9ydHMuQWdlbnRDb21wb25lbnQgPSBfQWdlbnRDb21wb25lbnQyW1wiZGVmYXVsdFwiXTtcbmV4cG9ydHMuQWdlbnRNaXhpbiA9IF9BZ2VudE1peGluMltcImRlZmF1bHRcIl07XG5leHBvcnRzLlN0YWdlQ29tcG9uZW50ID0gX1N0YWdlQ29tcG9uZW50MltcImRlZmF1bHRcIl07XG5leHBvcnRzLlN0YWdlTWl4aW4gPSBfU3RhZ2VNaXhpbjJbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9SZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfUmVhY3QpO1xuXG52YXIgX0VWRU5UX05BTUUgPSByZXF1aXJlKFwiLi9TZW5kQWN0aW9uRXZlbnRcIik7XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIHBhcnNlU3RhZ2VWYWx1ZVBhdGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHZhbHVlLnNwbGl0KFwiLlwiKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGRlZmluZUdldFN0YWdlVmFsdWUocGFydHMpIHtcbiAgdmFyIGJvZHkgPSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgYm9keSA9IFwicmV0dXJuIHRoaXMuc3RhdGU7XCI7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbGFzdEluZGV4ID0gcGFydHMubGVuZ3RoIC0gMTtcbiAgICAgIGJvZHkgPSBcInZhciB0bXAwID0gdGhpcy5zdGF0ZTtcIjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdEluZGV4OyArK2kpIHtcbiAgICAgICAgYm9keSArPSBcIlxcbmlmICh0bXBcIiArIGkgKyBcIiA9PSBudWxsKSB7XFxuICByZXR1cm4gdW5kZWZpbmVkO1xcbn1cXG52YXIgdG1wXCIgKyAoaSArIDEpICsgXCIgPSB0bXBcIiArIGkgKyBcIi5cIiArIHBhcnRzW2ldICsgXCI7XCI7XG4gICAgICB9XG4gICAgICBib2R5ICs9IFwiXFxucmV0dXJuIHRtcFwiICsgbGFzdEluZGV4ICsgXCIgJiYgdG1wXCIgKyBsYXN0SW5kZXggKyBcIi5cIiArIHBhcnRzW2xhc3RJbmRleF0gKyBcIjtcIjtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIEZ1bmN0aW9uKGJvZHkpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZGVmaW5lU2V0U3RhZ2VWYWx1ZShwYXJ0cykge1xuICB2YXIgYm9keSA9IFwidmFyIGNiMiA9IGNiICYmIGZ1bmN0aW9uKCkgeyBjYih0aGlzLnN0YWdlVmFsdWUpOyB9LmJpbmQodGhpcyk7XCI7XG5cbiAgc3dpdGNoIChwYXJ0cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICBib2R5ICs9IFwiXFxudGhpcy5zZXRTdGF0ZSh2YWx1ZSwgY2IyKTtcIjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAxOlxuICAgICAgYm9keSArPSBcIlxcbnRoaXMuc2V0U3RhdGUoe1wiICsgcGFydHNbMF0gKyBcIjogdmFsdWV9LCBjYjIpO1wiO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIGxhc3RJbmRleCA9IHBhcnRzLmxlbmd0aCAtIDE7XG4gICAgICBib2R5ICs9IFwiXFxudmFyIHRtcDAgPSB0aGlzLnN0YXRlIHx8IHt9O1wiO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SW5kZXg7ICsraSkge1xuICAgICAgICBib2R5ICs9IFwiXFxudmFyIHRtcFwiICsgKGkgKyAxKSArIFwiID0gdG1wXCIgKyBpICsgXCIuXCIgKyBwYXJ0c1tpXSArIFwiO1xcbmlmICh0bXBcIiArIChpICsgMSkgKyBcIiA9PSBudWxsKSB7XFxuICB0bXBcIiArIChpICsgMSkgKyBcIiA9IHRtcFwiICsgaSArIFwiLlwiICsgcGFydHNbaV0gKyBcIiA9IHt9O1xcbn1cIjtcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gXCJcXG50bXBcIiArIGxhc3RJbmRleCArIFwiLlwiICsgcGFydHNbbGFzdEluZGV4XSArIFwiID0gdmFsdWU7XFxudGhpcy5zZXRTdGF0ZSh0bXAwLCBjYjIpO1wiO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gRnVuY3Rpb24oXCJ2YWx1ZVwiLCBcImNiXCIsIGJvZHkpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaGFuZGxlU2VuZEFjdGlvbihldmVudCkge1xuICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIHRoaXMuZmlsdGVyQWN0aW9uID09PSBcImZ1bmN0aW9uXCIgJiYgIXRoaXMuZmlsdGVyQWN0aW9uKGV2ZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXZlbnQuYXBwbHlUbyh0aGlzKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0aWFsaXplKGNvbXBvbmVudCwgc3RhZ2VWYWx1ZVBhdGgpIHtcbiAgICBpZiAoY29tcG9uZW50LnN0YWdlTWl4aW5Jbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYXJ0cyA9IHBhcnNlU3RhZ2VWYWx1ZVBhdGgoc3RhZ2VWYWx1ZVBhdGgpO1xuICAgIHZhciBnZXRTdGFnZVZhbHVlID0gZGVmaW5lR2V0U3RhZ2VWYWx1ZShwYXJ0cyk7XG5cbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgaW52YXJpYW50KHN0YWdlVmFsdWVQYXRoID09IG51bGwgfHwgdHlwZW9mIHN0YWdlVmFsdWVQYXRoID09PSBcInN0cmluZ1wiLCBcIlN0YWdlTWl4aW46IHN0YWdlVmFsdWVQYXRoIHNob3VsZCBiZSBhIHN0cmluZy5cIik7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGdldFN0YWdlVmFsdWUuY2FsbChjb21wb25lbnQpO1xuICAgICAgfSBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcIlN0YWdlTWl4aW46IHN0YWdlVmFsdWVQYXRoIGlzIGludmFsaWQgKFwiICsgc3RhZ2VWYWx1ZVBhdGggKyBcIikuXCIpO1xuICAgICAgICBlcnIuY2F1c2UgPSBjYXVzZTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbXBvbmVudCwge1xuICAgICAgc3RhZ2VNaXhpbkluaXRpYWxpemVkOiB7XG4gICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIHN0YWdlTWl4aW5IYW5kbGVTZW5kQWN0aW9uOiB7XG4gICAgICAgIHZhbHVlOiBoYW5kbGVTZW5kQWN0aW9uLmJpbmQoY29tcG9uZW50KSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9LFxuXG4gICAgICBzdGFnZVZhbHVlOiB7XG4gICAgICAgIGdldDogZ2V0U3RhZ2VWYWx1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9LFxuXG4gICAgICBzZXRTdGFnZVZhbHVlOiB7XG4gICAgICAgIHZhbHVlOiBkZWZpbmVTZXRTdGFnZVZhbHVlKHBhcnRzKS5iaW5kKGNvbXBvbmVudCksXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHNldHVwSGFuZGxlcjogZnVuY3Rpb24gc2V0dXBIYW5kbGVyKGNvbXBvbmVudCkge1xuICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgaW52YXJpYW50KG5vZGUgIT0gbnVsbCwgXCJTdGFnZU1peGluOiByZXF1aXJlcyB0byBiZSByZW5kZXJlZC5cIik7XG4gICAgfVxuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihfRVZFTlRfTkFNRS5FVkVOVF9OQU1FLCBjb21wb25lbnQuc3RhZ2VNaXhpbkhhbmRsZVNlbmRBY3Rpb24pO1xuICB9LFxuXG4gIHRlYXJkb3duSGFuZGxlcjogZnVuY3Rpb24gdGVhcmRvd25IYW5kbGVyKGNvbXBvbmVudCkge1xuICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICBpZiAobm9kZSAhPSBudWxsKSB7XG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoX0VWRU5UX05BTUUuRVZFTlRfTkFNRSwgY29tcG9uZW50LnN0YWdlTWl4aW5IYW5kbGVTZW5kQWN0aW9uKTtcbiAgICB9XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyJdfQ==
