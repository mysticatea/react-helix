(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactHelix = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _agentImpl = require("./agent-impl");

var _agentImpl2 = _interopRequireDefault(_agentImpl);

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
        _agentImpl2["default"].validate(this);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if ("development" !== "production") {
        _agentImpl2["default"].validate(this);
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
      return _agentImpl2["default"].sendAction(this, action, args, callback);
    }
  }]);

  return AgentComponent;
})(_react2["default"].Component);

exports["default"] = AgentComponent;
module.exports = exports["default"];
},{"./agent-impl":6,"react":"react"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _agentImpl = require("./agent-impl");

var _agentImpl2 = _interopRequireDefault(_agentImpl);

exports["default"] = {
  componentDidMount: function componentDidMount() {
    if ("development" !== "production") {
      _agentImpl2["default"].validate(this);
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if ("development" !== "production") {
      _agentImpl2["default"].validate(this);
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
    return _agentImpl2["default"].sendAction(this, action, args, callback);
  }
};
module.exports = exports["default"];
},{"./agent-impl":6}],3:[function(require,module,exports){
// There are several cross-callings in this file.
/*eslint no-use-before-define:[2,"nofunc"]*/

"use strict";

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _stageImpl = require("./stage-impl");

var _stageImpl2 = _interopRequireDefault(_stageImpl);

var StageComponent = (function (_React$Component) {
  function StageComponent(props) {
    var stageValuePath = arguments[1] === undefined ? "" : arguments[1];

    _classCallCheck(this, StageComponent);

    _get(Object.getPrototypeOf(StageComponent.prototype), "constructor", this).call(this, props);
    _stageImpl2["default"].initialize(this, stageValuePath);
  }

  _inherits(StageComponent, _React$Component);

  _createClass(StageComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _stageImpl2["default"].setupHandler(this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      _stageImpl2["default"].setupHandler(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _stageImpl2["default"].teardownHandler(this);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      _stageImpl2["default"].teardownHandler(this);
    }
  }, {
    key: "filterAction",
    value: function filterAction() {
      return true;
    }
  }]);

  return StageComponent;
})(_react2["default"].Component);

exports["default"] = StageComponent;
module.exports = exports["default"];
/* event */
},{"./stage-impl":7,"react":"react"}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _stageImpl = require("./stage-impl");

var _stageImpl2 = _interopRequireDefault(_stageImpl);

exports["default"] = {
  componentWillMount: function componentWillMount() {
    _stageImpl2["default"].initialize(this, this.stageValuePath || "");
  },

  componentDidMount: function componentDidMount() {
    _stageImpl2["default"].setupHandler(this);
  },

  componentDidUpdate: function componentDidUpdate() {
    _stageImpl2["default"].setupHandler(this);
  },

  componentWillUpdate: function componentWillUpdate() {
    _stageImpl2["default"].teardownHandler(this);
  },

  componentWillUnmount: function componentWillUnmount() {
    _stageImpl2["default"].teardownHandler(this);
  }
};
module.exports = exports["default"];
},{"./stage-impl":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _SendActionEvent = require("./SendActionEvent");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

exports["default"] = {
  validate: function validate(component) {
    if ("development" !== "production") {
      var node = _react2["default"].findDOMNode(component);
      invariant(node != null, "AgentMixin: requires to be rendered.");
    }
  },

  sendAction: function sendAction(component, action, args, callback) {
    var node = _react2["default"].findDOMNode(component);
    var event = (0, _SendActionEvent.createSendActionEvent)(action, args, callback);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _SendActionEvent = require("./SendActionEvent");

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
    var node = _react2["default"].findDOMNode(component);
    if ("development" !== "production") {
      invariant(node != null, "StageMixin: requires to be rendered.");
    }
    node.addEventListener(_SendActionEvent.EVENT_NAME, component.stageMixinHandleSendAction);
  },

  teardownHandler: function teardownHandler(component) {
    var node = _react2["default"].findDOMNode(component);
    if (node != null) {
      node.removeEventListener(_SendActionEvent.EVENT_NAME, component.stageMixinHandleSendAction);
    }
  }
};
module.exports = exports["default"];
},{"./SendActionEvent":3,"react":"react"}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _AgentComponent = require("./AgentComponent");

var _AgentComponent2 = _interopRequireDefault(_AgentComponent);

var _AgentMixin = require("./AgentMixin");

var _AgentMixin2 = _interopRequireDefault(_AgentMixin);

var _StageComponent = require("./StageComponent");

var _StageComponent2 = _interopRequireDefault(_StageComponent);

var _StageMixin = require("./StageMixin");

var _StageMixin2 = _interopRequireDefault(_StageMixin);

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
},{"./AgentComponent":1,"./AgentMixin":2,"./StageComponent":4,"./StageMixin":5}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQWdlbnRDb21wb25lbnQuanMiLCJsaWIvQWdlbnRNaXhpbi5qcyIsImxpYi9TZW5kQWN0aW9uRXZlbnQuanMiLCJsaWIvU3RhZ2VDb21wb25lbnQuanMiLCJsaWIvU3RhZ2VNaXhpbi5qcyIsImxpYi9hZ2VudC1pbXBsLmpzIiwibGliL3N0YWdlLWltcGwuanMiLCJsaWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfYWdlbnRJbXBsID0gcmVxdWlyZShcIi4vYWdlbnQtaW1wbFwiKTtcblxudmFyIF9hZ2VudEltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWdlbnRJbXBsKTtcblxudmFyIEFnZW50Q29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gIGZ1bmN0aW9uIEFnZW50Q29tcG9uZW50KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBZ2VudENvbXBvbmVudCk7XG5cbiAgICBpZiAoX1JlYWN0JENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICBfUmVhY3QkQ29tcG9uZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgX2luaGVyaXRzKEFnZW50Q29tcG9uZW50LCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICBfY3JlYXRlQ2xhc3MoQWdlbnRDb21wb25lbnQsIFt7XG4gICAga2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgX2FnZW50SW1wbDJbXCJkZWZhdWx0XCJdLnZhbGlkYXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wb25lbnREaWRVcGRhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgX2FnZW50SW1wbDJbXCJkZWZhdWx0XCJdLnZhbGlkYXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3QoYWN0aW9uIC8qIFssIC4uLmFyZ3NdIFssIGNhbGxiYWNrXSAqLykge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgIGlmIChsYXN0SW5kZXggPj0gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbbGFzdEluZGV4XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tsYXN0SW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tsYXN0SW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX2FnZW50SW1wbDJbXCJkZWZhdWx0XCJdLnNlbmRBY3Rpb24odGhpcywgYWN0aW9uLCBhcmdzLCBjYWxsYmFjayk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEFnZW50Q29tcG9uZW50O1xufSkoX3JlYWN0MltcImRlZmF1bHRcIl0uQ29tcG9uZW50KTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBBZ2VudENvbXBvbmVudDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX2FnZW50SW1wbCA9IHJlcXVpcmUoXCIuL2FnZW50LWltcGxcIik7XG5cbnZhciBfYWdlbnRJbXBsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FnZW50SW1wbCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIF9hZ2VudEltcGwyW1wiZGVmYXVsdFwiXS52YWxpZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIF9hZ2VudEltcGwyW1wiZGVmYXVsdFwiXS52YWxpZGF0ZSh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24gcmVxdWVzdChhY3Rpb24gLyogWywgLi4uYXJnc10gWywgY2FsbGJhY2tdICovKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgbGFzdEluZGV4ID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgdmFyIGNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIGlmIChsYXN0SW5kZXggPj0gMSkge1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsYXN0SW5kZXg7ICsraSkge1xuICAgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2xhc3RJbmRleF0gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2xhc3RJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbbGFzdEluZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9hZ2VudEltcGwyW1wiZGVmYXVsdFwiXS5zZW5kQWN0aW9uKHRoaXMsIGFjdGlvbiwgYXJncywgY2FsbGJhY2spO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIvLyBUaGVyZSBhcmUgc2V2ZXJhbCBjcm9zcy1jYWxsaW5ncyBpbiB0aGlzIGZpbGUuXG4vKmVzbGludCBuby11c2UtYmVmb3JlLWRlZmluZTpbMixcIm5vZnVuY1wiXSovXG5cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG4vKipcbiAqIEBwYXJhbSBhY3Rpb24ge2Z1bmN0aW9ufSAtIEEgZnVuY3Rpb24gdG8gdHJhbnNmb3JtIHRoZSBzdGF0ZS5cbiAqIEBwYXJhbSBhcmdzIHthbnlbXX0gLSBJbmZvcm1hdGlvbiBmb3IgYWN0aW9uLiAgVGhpcyB2YWx1ZSBpcyBnaXZlbiB0byB0aGVcbiAqICAgc2Vjb25kIGFyZ3VtZW50IG9mIGFjdGlvbi5cbiAqIEByZXR1cm4ge1NlbmRBY3Rpb25FdmVudH0gLSBUaGUgY3JlYXRlZCBldmVudCBvYmplY3QuXG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VuZEFjdGlvbkV2ZW50ID0gY3JlYXRlU2VuZEFjdGlvbkV2ZW50O1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTsgcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNUaGVuYWJsZSh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgeC50aGVuID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGlzR2VuZXJhdG9yKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB4Lm5leHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgeFtcInRocm93XCJdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIHByaW50RXJyb3IoZXJyb3IpIHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGluIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpLlxuICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpOyAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59XG5cbi8vIEEgaGFuZGxlciB0aGF0IGlzIHVzZWQgaWYgdmFsdWUgaXMgbm90IGFsbCBvZiB1bmRlZmluZWQsIGEgZnVuY3Rpb24sIGFcbi8vIHByb21pc2UsIGFuZCBhIGdlbmVyYXRvci5cbi8vIEp1c3QgaXQgc2V0cyB0aGUgdmFsdWUgdG8gdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuZnVuY3Rpb24gc2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCkge1xuICB0cnkge1xuICAgIGNvbXBvbmVudC5zZXRTdGFnZVZhbHVlKHZhbHVlLCByZXNvbHZlKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVqZWN0KGVycik7XG4gIH1cbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLlxuLy8gSXQgY2FsbHMgdGhlIGZ1bmN0aW9uIHRvZ2V0aGVyIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuLy8gVGhlbiBzZXQgdGhlIHJlc3VsdCB0byB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG5mdW5jdGlvbiBjYWxsQW5kU2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgZnVuYywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gZnVuYyhjb21wb25lbnQuc3RhZ2VWYWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0VW5pZmllZChjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBhIHByb21pc2UuXG4vLyBJdCB3YWl0cyBmb3IgdGhlIHByb21pc2UgYmVjb21lIGZ1bGZpbGxlZC5cbi8vIFRoZW4gc2V0IHRoZSByZXN1bHQgdG8gdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuLy8gQnV0IGlmIGlzIHdoaWxlIGFkdmFuY2luZyBhIGdlbmVyYXRvciwgaXQgZG9lc24ndCBzZXQgdG8gdGhlIHN0YWdlIHZhbHVlLFxuLy8ganVzdCByZXR1cm5zIHRoZSByZXN1bHQuXG5mdW5jdGlvbiB3YWl0QW5kU2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHZhciBwcm9taXNlMiA9IHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgaWYgKGlzSW5HZW5lcmF0b3IpIHtcbiAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VW5pZmllZChjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0sIHJlamVjdCk7XG5cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBwcm9taXNlMltcImNhdGNoXCJdKHByaW50RXJyb3IpO1xuICB9XG59XG5cbi8vIEEgaGFuZGxlciB0aGF0IGlzIHVzZWQgaWYgdmFsdWUgaXMgYSBnZW5lcmF0b3IuXG4vLyBQcm9jZXNzIGEgZ2VuZXJhdG9yLiBwaW5nLXBvbmcgdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuZnVuY3Rpb24gYWR2YW5jZVRvRW5kKGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgZ2VuZXJhdG9yLCByZXNvbHZlLCByZWplY3QpIHtcbiAgb25GdWxmaWxsZWQodW5kZWZpbmVkKTtcblxuICBmdW5jdGlvbiBvbkZ1bGZpbGxlZChzdGFnZVZhbHVlKSB7XG4gICAgdmFyIHJldCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gZ2VuZXJhdG9yLm5leHQoc3RhZ2VWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXh0KHJldCk7XG4gIH1cblxuICBmdW5jdGlvbiBvblJlamVjdGVkKGVycikge1xuICAgIHZhciByZXQgPSB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGdlbmVyYXRvcltcInRocm93XCJdKGVycik7XG4gICAgfSBjYXRjaCAoZXJyMikge1xuICAgICAgcmVqZWN0KGVycjIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5leHQocmV0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQocmV0KSB7XG4gICAgaWYgKHJldC5kb25lKSB7XG4gICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgdHJ1ZSwgcmV0LnZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgdHJ1ZSwgcmV0LnZhbHVlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9XG59XG5cbi8vIENoZWNrIHR5cGUgb2YgdGhlIHZhbHVlLCBhbmQgaGFuZGxlIHRoZSB2YWx1ZS5cbmZ1bmN0aW9uIHNldFVuaWZpZWQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzb2x2ZShjb21wb25lbnQuc3RhZ2VWYWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGhhbmRsZSA9IGlzRnVuY3Rpb24odmFsdWUpID8gY2FsbEFuZFNldCA6IGlzVGhlbmFibGUodmFsdWUpID8gd2FpdEFuZFNldCA6IGlzR2VuZXJhdG9yKHZhbHVlKSA/IGFkdmFuY2VUb0VuZCA6XG4gIC8qIG90aGVyd2lzZSAqL3NldDtcblxuICBoYW5kbGUoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGUgZXZlbnQgbmFtZSBmb3IgYFNlbmRBY3Rpb25FdmVudGAuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG52YXIgRVZFTlRfTkFNRSA9IFwiaGVsaXgtc2VudC1hY3Rpb25cIjtleHBvcnRzLkVWRU5UX05BTUUgPSBFVkVOVF9OQU1FO1xuXG5mdW5jdGlvbiBjcmVhdGVTZW5kQWN0aW9uRXZlbnQoYWN0aW9uLCBhcmdzLCBjYWxsYmFjaykge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIGludmFyaWFudCh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIsIFwiYWN0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShhcmdzKSwgXCJhcmdzIHNob3VsZCBiZSBhbiBhcnJheS5cIik7XG4gICAgaW52YXJpYW50KGNhbGxiYWNrID09IG51bGwgfHwgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIsIFwiY2FsbGJhY2sgc2hvdWxkIGJlIGEgZnVuY3Rpb24gb3Igbm90aGluZy5cIik7XG5cbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sgPSBwcmludEVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XG4gIHZhciBoYW5kbGVkID0gZmFsc2U7XG5cbiAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KEVWRU5UX05BTUUsIHRydWUsIHRydWUsIG51bGwpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhldmVudCwge1xuICAgIGFjdGlvbjoge1xuICAgICAgdmFsdWU6IGFjdGlvbixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBhcmd1bWVudHM6IHtcbiAgICAgIHZhbHVlOiBhcmdzLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIC8vIFRoaXMgaXMgaW50ZXJuYWwgbWV0aG9kLCBjYWxsZWQgZnJvbSBTdGFnZU1peGluLlxuICAgIGFwcGx5VG86IHsgdmFsdWU6IGZ1bmN0aW9uIGFwcGx5VG8oY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgdmFyIGdldCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9uZW50LCBcInN0YWdlVmFsdWVcIik7XG4gICAgICAgICAgdmFyIF9zZXQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbXBvbmVudCwgXCJzZXRTdGFnZVZhbHVlXCIpO1xuICAgICAgICAgIGludmFyaWFudChpc0Z1bmN0aW9uKGdldC5nZXQpLCBcImNvbXBvbmVudC5zdGFnZVZhbHVlIHNob3VsZCBiZSBhIGdldHRlciBwcm9wZXJ0eS5cIik7XG4gICAgICAgICAgaW52YXJpYW50KGlzRnVuY3Rpb24oX3NldC52YWx1ZSksIFwiY29tcG9uZW50LnNldFN0YWdlVmFsdWUgc2hvdWxkIGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgICAgICAgIGludmFyaWFudChoYW5kbGVkID09PSBmYWxzZSwgXCJ0aGlzIFwiICsgRVZFTlRfTkFNRSArIFwiIGV2ZW50IGhhZCBiZWVuIGFwcGxpZWQgYWxyZWFkeS5cIik7XG4gICAgICAgICAgaW52YXJpYW50KGlzRnVuY3Rpb24odGhpcy5hY3Rpb24pLCBcInRoaXMuYWN0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheSh0aGlzLmFyZ3VtZW50cyksIFwidGhpcy5hcmd1bWVudHMgc2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmFjdGlvbi5hcHBseSh0aGlzLCBbY29tcG9uZW50LnN0YWdlVmFsdWVdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodGhpcy5hcmd1bWVudHMpKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0VW5pZmllZChjb21wb25lbnQsIGZhbHNlLCB2YWx1ZSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICB9IH0sXG5cbiAgICAvLyBUaGlzIGlzIGludGVybmFsIG1ldGhvZCwgY2FsbGVkIGZyb20gQWdlbnRNaXhpbi5cbiAgICByZWplY3RJZk5vdEhhbmRsZWQ6IHsgdmFsdWU6IGZ1bmN0aW9uIHJlamVjdElmTm90SGFuZGxlZCgpIHtcbiAgICAgICAgaWYgKGhhbmRsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIm5vdCBoYW5kbGVkXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gfVxuICB9KTtcblxuICByZXR1cm4gZXZlbnQ7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gyLCBfeDMsIF94NCkgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeDIsIHByb3BlcnR5ID0gX3gzLCByZWNlaXZlciA9IF94NDsgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDsgX2FnYWluID0gZmFsc2U7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3gyID0gcGFyZW50OyBfeDMgPSBwcm9wZXJ0eTsgX3g0ID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfc3RhZ2VJbXBsID0gcmVxdWlyZShcIi4vc3RhZ2UtaW1wbFwiKTtcblxudmFyIF9zdGFnZUltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhZ2VJbXBsKTtcblxudmFyIFN0YWdlQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gIGZ1bmN0aW9uIFN0YWdlQ29tcG9uZW50KHByb3BzKSB7XG4gICAgdmFyIHN0YWdlVmFsdWVQYXRoID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBcIlwiIDogYXJndW1lbnRzWzFdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN0YWdlQ29tcG9uZW50KTtcblxuICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFN0YWdlQ29tcG9uZW50LnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgX3N0YWdlSW1wbDJbXCJkZWZhdWx0XCJdLmluaXRpYWxpemUodGhpcywgc3RhZ2VWYWx1ZVBhdGgpO1xuICB9XG5cbiAgX2luaGVyaXRzKFN0YWdlQ29tcG9uZW50LCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICBfY3JlYXRlQ2xhc3MoU3RhZ2VDb21wb25lbnQsIFt7XG4gICAga2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgX3N0YWdlSW1wbDJbXCJkZWZhdWx0XCJdLnNldHVwSGFuZGxlcih0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcG9uZW50RGlkVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgIF9zdGFnZUltcGwyW1wiZGVmYXVsdFwiXS5zZXR1cEhhbmRsZXIodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvbmVudFdpbGxVbm1vdW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgX3N0YWdlSW1wbDJbXCJkZWZhdWx0XCJdLnRlYXJkb3duSGFuZGxlcih0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgICAgX3N0YWdlSW1wbDJbXCJkZWZhdWx0XCJdLnRlYXJkb3duSGFuZGxlcih0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmlsdGVyQWN0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbHRlckFjdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdGFnZUNvbXBvbmVudDtcbn0pKF9yZWFjdDJbXCJkZWZhdWx0XCJdLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU3RhZ2VDb21wb25lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuLyogZXZlbnQgKi8iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfc3RhZ2VJbXBsID0gcmVxdWlyZShcIi4vc3RhZ2UtaW1wbFwiKTtcblxudmFyIF9zdGFnZUltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhZ2VJbXBsKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIF9zdGFnZUltcGwyW1wiZGVmYXVsdFwiXS5pbml0aWFsaXplKHRoaXMsIHRoaXMuc3RhZ2VWYWx1ZVBhdGggfHwgXCJcIik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIF9zdGFnZUltcGwyW1wiZGVmYXVsdFwiXS5zZXR1cEhhbmRsZXIodGhpcyk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgX3N0YWdlSW1wbDJbXCJkZWZhdWx0XCJdLnNldHVwSGFuZGxlcih0aGlzKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgIF9zdGFnZUltcGwyW1wiZGVmYXVsdFwiXS50ZWFyZG93bkhhbmRsZXIodGhpcyk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIF9zdGFnZUltcGwyW1wiZGVmYXVsdFwiXS50ZWFyZG93bkhhbmRsZXIodGhpcyk7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfU2VuZEFjdGlvbkV2ZW50ID0gcmVxdWlyZShcIi4vU2VuZEFjdGlvbkV2ZW50XCIpO1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUoY29tcG9uZW50KSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIHZhciBub2RlID0gX3JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICAgIGludmFyaWFudChub2RlICE9IG51bGwsIFwiQWdlbnRNaXhpbjogcmVxdWlyZXMgdG8gYmUgcmVuZGVyZWQuXCIpO1xuICAgIH1cbiAgfSxcblxuICBzZW5kQWN0aW9uOiBmdW5jdGlvbiBzZW5kQWN0aW9uKGNvbXBvbmVudCwgYWN0aW9uLCBhcmdzLCBjYWxsYmFjaykge1xuICAgIHZhciBub2RlID0gX3JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICB2YXIgZXZlbnQgPSAoMCwgX1NlbmRBY3Rpb25FdmVudC5jcmVhdGVTZW5kQWN0aW9uRXZlbnQpKGFjdGlvbiwgYXJncywgY2FsbGJhY2spO1xuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIGludmFyaWFudChub2RlICE9IG51bGwsIFwiQWdlbnRNaXhpbjogcmVxdWlyZXMgdG8gYmUgcmVuZGVyZWQuXCIpO1xuICAgIH1cbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIGV2ZW50LnJlamVjdElmTm90SGFuZGxlZCgpO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX1NlbmRBY3Rpb25FdmVudCA9IHJlcXVpcmUoXCIuL1NlbmRBY3Rpb25FdmVudFwiKTtcblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfVxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcGFyc2VTdGFnZVZhbHVlUGF0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUuc3BsaXQoXCIuXCIpLmZpbHRlcihCb29sZWFuKSA6IFtdO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZGVmaW5lR2V0U3RhZ2VWYWx1ZShwYXJ0cykge1xuICB2YXIgYm9keSA9IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChwYXJ0cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICBib2R5ID0gXCJyZXR1cm4gdGhpcy5zdGF0ZTtcIjtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBsYXN0SW5kZXggPSBwYXJ0cy5sZW5ndGggLSAxO1xuICAgICAgYm9keSA9IFwidmFyIHRtcDAgPSB0aGlzLnN0YXRlO1wiO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SW5kZXg7ICsraSkge1xuICAgICAgICBib2R5ICs9IFwiXFxuaWYgKHRtcFwiICsgaSArIFwiID09IG51bGwpIHtcXG4gIHJldHVybiB1bmRlZmluZWQ7XFxufVxcbnZhciB0bXBcIiArIChpICsgMSkgKyBcIiA9IHRtcFwiICsgaSArIFwiLlwiICsgcGFydHNbaV0gKyBcIjtcIjtcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gXCJcXG5yZXR1cm4gdG1wXCIgKyBsYXN0SW5kZXggKyBcIiAmJiB0bXBcIiArIGxhc3RJbmRleCArIFwiLlwiICsgcGFydHNbbGFzdEluZGV4XSArIFwiO1wiO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gRnVuY3Rpb24oYm9keSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkZWZpbmVTZXRTdGFnZVZhbHVlKHBhcnRzKSB7XG4gIHZhciBib2R5ID0gXCJ2YXIgY2IyID0gY2IgJiYgZnVuY3Rpb24oKSB7IGNiKHRoaXMuc3RhZ2VWYWx1ZSk7IH0uYmluZCh0aGlzKTtcIjtcblxuICBzd2l0Y2ggKHBhcnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJvZHkgKz0gXCJcXG50aGlzLnNldFN0YXRlKHZhbHVlLCBjYjIpO1wiO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDE6XG4gICAgICBib2R5ICs9IFwiXFxudGhpcy5zZXRTdGF0ZSh7XCIgKyBwYXJ0c1swXSArIFwiOiB2YWx1ZX0sIGNiMik7XCI7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbGFzdEluZGV4ID0gcGFydHMubGVuZ3RoIC0gMTtcbiAgICAgIGJvZHkgKz0gXCJcXG52YXIgdG1wMCA9IHRoaXMuc3RhdGUgfHwge307XCI7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgIGJvZHkgKz0gXCJcXG52YXIgdG1wXCIgKyAoaSArIDEpICsgXCIgPSB0bXBcIiArIGkgKyBcIi5cIiArIHBhcnRzW2ldICsgXCI7XFxuaWYgKHRtcFwiICsgKGkgKyAxKSArIFwiID09IG51bGwpIHtcXG4gIHRtcFwiICsgKGkgKyAxKSArIFwiID0gdG1wXCIgKyBpICsgXCIuXCIgKyBwYXJ0c1tpXSArIFwiID0ge307XFxufVwiO1xuICAgICAgfVxuICAgICAgYm9keSArPSBcIlxcbnRtcFwiICsgbGFzdEluZGV4ICsgXCIuXCIgKyBwYXJ0c1tsYXN0SW5kZXhdICsgXCIgPSB2YWx1ZTtcXG50aGlzLnNldFN0YXRlKHRtcDAsIGNiMik7XCI7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBGdW5jdGlvbihcInZhbHVlXCIsIFwiY2JcIiwgYm9keSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBoYW5kbGVTZW5kQWN0aW9uKGV2ZW50KSB7XG4gIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgdGhpcy5maWx0ZXJBY3Rpb24gPT09IFwiZnVuY3Rpb25cIiAmJiAhdGhpcy5maWx0ZXJBY3Rpb24oZXZlbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldmVudC5hcHBseVRvKHRoaXMpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRpYWxpemUoY29tcG9uZW50LCBzdGFnZVZhbHVlUGF0aCkge1xuICAgIGlmIChjb21wb25lbnQuc3RhZ2VNaXhpbkluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhcnRzID0gcGFyc2VTdGFnZVZhbHVlUGF0aChzdGFnZVZhbHVlUGF0aCk7XG4gICAgdmFyIGdldFN0YWdlVmFsdWUgPSBkZWZpbmVHZXRTdGFnZVZhbHVlKHBhcnRzKTtcblxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQoc3RhZ2VWYWx1ZVBhdGggPT0gbnVsbCB8fCB0eXBlb2Ygc3RhZ2VWYWx1ZVBhdGggPT09IFwic3RyaW5nXCIsIFwiU3RhZ2VNaXhpbjogc3RhZ2VWYWx1ZVBhdGggc2hvdWxkIGJlIGEgc3RyaW5nLlwiKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2V0U3RhZ2VWYWx1ZS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiU3RhZ2VNaXhpbjogc3RhZ2VWYWx1ZVBhdGggaXMgaW52YWxpZCAoXCIgKyBzdGFnZVZhbHVlUGF0aCArIFwiKS5cIik7XG4gICAgICAgIGVyci5jYXVzZSA9IGNhdXNlO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29tcG9uZW50LCB7XG4gICAgICBzdGFnZU1peGluSW5pdGlhbGl6ZWQ6IHtcbiAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSxcblxuICAgICAgc3RhZ2VNaXhpbkhhbmRsZVNlbmRBY3Rpb246IHtcbiAgICAgICAgdmFsdWU6IGhhbmRsZVNlbmRBY3Rpb24uYmluZChjb21wb25lbnQpLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIHN0YWdlVmFsdWU6IHtcbiAgICAgICAgZ2V0OiBnZXRTdGFnZVZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIHNldFN0YWdlVmFsdWU6IHtcbiAgICAgICAgdmFsdWU6IGRlZmluZVNldFN0YWdlVmFsdWUocGFydHMpLmJpbmQoY29tcG9uZW50KSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0dXBIYW5kbGVyOiBmdW5jdGlvbiBzZXR1cEhhbmRsZXIoY29tcG9uZW50KSB7XG4gICAgdmFyIG5vZGUgPSBfcmVhY3QyW1wiZGVmYXVsdFwiXS5maW5kRE9NTm9kZShjb21wb25lbnQpO1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQobm9kZSAhPSBudWxsLCBcIlN0YWdlTWl4aW46IHJlcXVpcmVzIHRvIGJlIHJlbmRlcmVkLlwiKTtcbiAgICB9XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKF9TZW5kQWN0aW9uRXZlbnQuRVZFTlRfTkFNRSwgY29tcG9uZW50LnN0YWdlTWl4aW5IYW5kbGVTZW5kQWN0aW9uKTtcbiAgfSxcblxuICB0ZWFyZG93bkhhbmRsZXI6IGZ1bmN0aW9uIHRlYXJkb3duSGFuZGxlcihjb21wb25lbnQpIHtcbiAgICB2YXIgbm9kZSA9IF9yZWFjdDJbXCJkZWZhdWx0XCJdLmZpbmRET01Ob2RlKGNvbXBvbmVudCk7XG4gICAgaWYgKG5vZGUgIT0gbnVsbCkge1xuICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKF9TZW5kQWN0aW9uRXZlbnQuRVZFTlRfTkFNRSwgY29tcG9uZW50LnN0YWdlTWl4aW5IYW5kbGVTZW5kQWN0aW9uKTtcbiAgICB9XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9BZ2VudENvbXBvbmVudCA9IHJlcXVpcmUoXCIuL0FnZW50Q29tcG9uZW50XCIpO1xuXG52YXIgX0FnZW50Q29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FnZW50Q29tcG9uZW50KTtcblxudmFyIF9BZ2VudE1peGluID0gcmVxdWlyZShcIi4vQWdlbnRNaXhpblwiKTtcblxudmFyIF9BZ2VudE1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FnZW50TWl4aW4pO1xuXG52YXIgX1N0YWdlQ29tcG9uZW50ID0gcmVxdWlyZShcIi4vU3RhZ2VDb21wb25lbnRcIik7XG5cbnZhciBfU3RhZ2VDb21wb25lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU3RhZ2VDb21wb25lbnQpO1xuXG52YXIgX1N0YWdlTWl4aW4gPSByZXF1aXJlKFwiLi9TdGFnZU1peGluXCIpO1xuXG52YXIgX1N0YWdlTWl4aW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU3RhZ2VNaXhpbik7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBBZ2VudENvbXBvbmVudDogX0FnZW50Q29tcG9uZW50MltcImRlZmF1bHRcIl0sXG4gIEFnZW50TWl4aW46IF9BZ2VudE1peGluMltcImRlZmF1bHRcIl0sXG4gIFN0YWdlQ29tcG9uZW50OiBfU3RhZ2VDb21wb25lbnQyW1wiZGVmYXVsdFwiXSxcbiAgU3RhZ2VNaXhpbjogX1N0YWdlTWl4aW4yW1wiZGVmYXVsdFwiXVxufTtcbmV4cG9ydHMuQWdlbnRDb21wb25lbnQgPSBfQWdlbnRDb21wb25lbnQyW1wiZGVmYXVsdFwiXTtcbmV4cG9ydHMuQWdlbnRNaXhpbiA9IF9BZ2VudE1peGluMltcImRlZmF1bHRcIl07XG5leHBvcnRzLlN0YWdlQ29tcG9uZW50ID0gX1N0YWdlQ29tcG9uZW50MltcImRlZmF1bHRcIl07XG5leHBvcnRzLlN0YWdlTWl4aW4gPSBfU3RhZ2VNaXhpbjJbXCJkZWZhdWx0XCJdOyJdfQ==
