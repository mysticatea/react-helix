(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactHelix = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Impl = require("./agent-impl");

var _Impl2 = _interopRequireDefault(_Impl);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Impl = require("./agent-impl");

var _Impl2 = _interopRequireDefault(_Impl);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Impl = require("./stage-impl");

var _Impl2 = _interopRequireDefault(_Impl);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Impl = require("./stage-impl");

var _Impl2 = _interopRequireDefault(_Impl);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
},{"./AgentComponent":1,"./AgentMixin":2,"./StageComponent":4,"./StageMixin":5}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQWdlbnRDb21wb25lbnQuanMiLCJsaWIvQWdlbnRNaXhpbi5qcyIsImxpYi9TZW5kQWN0aW9uRXZlbnQuanMiLCJsaWIvU3RhZ2VDb21wb25lbnQuanMiLCJsaWIvU3RhZ2VNaXhpbi5qcyIsImxpYi9hZ2VudC1pbXBsLmpzIiwibGliL2luZGV4LmpzIiwibGliL3N0YWdlLWltcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVhY3QpO1xuXG52YXIgX0ltcGwgPSByZXF1aXJlKFwiLi9hZ2VudC1pbXBsXCIpO1xuXG52YXIgX0ltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSW1wbCk7XG5cbnZhciBBZ2VudENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICBmdW5jdGlvbiBBZ2VudENvbXBvbmVudCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQWdlbnRDb21wb25lbnQpO1xuXG4gICAgaWYgKF9SZWFjdCRDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIF9pbmhlcml0cyhBZ2VudENvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgX2NyZWF0ZUNsYXNzKEFnZW50Q29tcG9uZW50LCBbe1xuICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udmFsaWRhdGUodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvbmVudERpZFVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnZhbGlkYXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3QoYWN0aW9uIC8qIFssIC4uLmFyZ3NdIFssIGNhbGxiYWNrXSAqLykge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgIGlmIChsYXN0SW5kZXggPj0gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbbGFzdEluZGV4XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tsYXN0SW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tsYXN0SW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX0ltcGwyW1wiZGVmYXVsdFwiXS5zZW5kQWN0aW9uKHRoaXMsIGFjdGlvbiwgYXJncywgY2FsbGJhY2spO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBBZ2VudENvbXBvbmVudDtcbn0pKF9SZWFjdDJbXCJkZWZhdWx0XCJdLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQWdlbnRDb21wb25lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0ltcGwgPSByZXF1aXJlKFwiLi9hZ2VudC1pbXBsXCIpO1xuXG52YXIgX0ltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSW1wbCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udmFsaWRhdGUodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnZhbGlkYXRlKHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbiByZXF1ZXN0KGFjdGlvbiAvKiBbLCAuLi5hcmdzXSBbLCBjYWxsYmFja10gKi8pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBsYXN0SW5kZXggPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgICB2YXIgY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGxhc3RJbmRleCA+PSAxKSB7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbbGFzdEluZGV4XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbbGFzdEluZGV4XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tsYXN0SW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX0ltcGwyW1wiZGVmYXVsdFwiXS5zZW5kQWN0aW9uKHRoaXMsIGFjdGlvbiwgYXJncywgY2FsbGJhY2spO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF90b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG4vKipcbiAqIEBwYXJhbSBhY3Rpb24ge2Z1bmN0aW9ufSAtIEEgZnVuY3Rpb24gdG8gdHJhbnNmb3JtIHRoZSBzdGF0ZS5cbiAqIEBwYXJhbSBhcmdzIHthbnlbXX0gLSBJbmZvcm1hdGlvbiBmb3IgYWN0aW9uLiAgVGhpcyB2YWx1ZSBpcyBnaXZlbiB0byB0aGVcbiAqICAgc2Vjb25kIGFyZ3VtZW50IG9mIGFjdGlvbi5cbiAqIEByZXR1cm4ge1NlbmRBY3Rpb25FdmVudH0gLSBUaGUgY3JlYXRlZCBldmVudCBvYmplY3QuXG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VuZEFjdGlvbkV2ZW50ID0gY3JlYXRlU2VuZEFjdGlvbkV2ZW50O1xuLy8gVGhlcmUgYXJlIHNldmVyYWwgY3Jvc3MtY2FsbGluZ3MgaW4gdGhpcyBmaWxlLlxuLyplc2xpbnQgbm8tdXNlLWJlZm9yZS1kZWZpbmU6WzIsXCJub2Z1bmNcIl0qL1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNUaGVuYWJsZSh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgeC50aGVuID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGlzR2VuZXJhdG9yKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB4Lm5leHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgeFtcInRocm93XCJdID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIHByaW50RXJyb3IoZXJyb3IpIHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGluIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpLlxuICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpOyAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59XG5cbi8vIEEgaGFuZGxlciB0aGF0IGlzIHVzZWQgaWYgdmFsdWUgaXMgbm90IGFsbCBvZiB1bmRlZmluZWQsIGEgZnVuY3Rpb24sIGFcbi8vIHByb21pc2UsIGFuZCBhIGdlbmVyYXRvci5cbi8vIEp1c3QgaXQgc2V0cyB0aGUgdmFsdWUgdG8gdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuZnVuY3Rpb24gc2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCkge1xuICB0cnkge1xuICAgIGNvbXBvbmVudC5zZXRTdGFnZVZhbHVlKHZhbHVlLCByZXNvbHZlKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVqZWN0KGVycik7XG4gIH1cbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLlxuLy8gSXQgY2FsbHMgdGhlIGZ1bmN0aW9uIHRvZ2V0aGVyIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuLy8gVGhlbiBzZXQgdGhlIHJlc3VsdCB0byB0aGUgY29tcG9uZW50J3Mgc3RhZ2UgdmFsdWUuXG5mdW5jdGlvbiBjYWxsQW5kU2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgZnVuYywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gZnVuYyhjb21wb25lbnQuc3RhZ2VWYWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0VW5pZmllZChjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbn1cblxuLy8gQSBoYW5kbGVyIHRoYXQgaXMgdXNlZCBpZiB2YWx1ZSBpcyBhIHByb21pc2UuXG4vLyBJdCB3YWl0cyBmb3IgdGhlIHByb21pc2UgYmVjb21lIGZ1bGZpbGxlZC5cbi8vIFRoZW4gc2V0IHRoZSByZXN1bHQgdG8gdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuLy8gQnV0IGlmIGlzIHdoaWxlIGFkdmFuY2luZyBhIGdlbmVyYXRvciwgaXQgZG9lc24ndCBzZXQgdG8gdGhlIHN0YWdlIHZhbHVlLFxuLy8ganVzdCByZXR1cm5zIHRoZSByZXN1bHQuXG5mdW5jdGlvbiB3YWl0QW5kU2V0KGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHZhciBwcm9taXNlMiA9IHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgaWYgKGlzSW5HZW5lcmF0b3IpIHtcbiAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VW5pZmllZChjb21wb25lbnQsIGlzSW5HZW5lcmF0b3IsIHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0sIHJlamVjdCk7XG5cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBwcm9taXNlMltcImNhdGNoXCJdKHByaW50RXJyb3IpO1xuICB9XG59XG5cbi8vIEEgaGFuZGxlciB0aGF0IGlzIHVzZWQgaWYgdmFsdWUgaXMgYSBnZW5lcmF0b3IuXG4vLyBQcm9jZXNzIGEgZ2VuZXJhdG9yLiBwaW5nLXBvbmcgdGhlIGNvbXBvbmVudCdzIHN0YWdlIHZhbHVlLlxuZnVuY3Rpb24gYWR2YW5jZVRvRW5kKGNvbXBvbmVudCwgaXNJbkdlbmVyYXRvciwgZ2VuZXJhdG9yLCByZXNvbHZlLCByZWplY3QpIHtcbiAgb25GdWxmaWxsZWQodW5kZWZpbmVkKTtcblxuICBmdW5jdGlvbiBvbkZ1bGZpbGxlZChzdGFnZVZhbHVlKSB7XG4gICAgdmFyIHJldCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gZ2VuZXJhdG9yLm5leHQoc3RhZ2VWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXh0KHJldCk7XG4gIH1cblxuICBmdW5jdGlvbiBvblJlamVjdGVkKGVycikge1xuICAgIHZhciByZXQgPSB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGdlbmVyYXRvcltcInRocm93XCJdKGVycik7XG4gICAgfSBjYXRjaCAoZXJyMikge1xuICAgICAgcmVqZWN0KGVycjIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5leHQocmV0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQocmV0KSB7XG4gICAgaWYgKHJldC5kb25lKSB7XG4gICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgdHJ1ZSwgcmV0LnZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRVbmlmaWVkKGNvbXBvbmVudCwgdHJ1ZSwgcmV0LnZhbHVlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9XG59XG5cbi8vIENoZWNrIHR5cGUgb2YgdGhlIHZhbHVlLCBhbmQgaGFuZGxlIHRoZSB2YWx1ZS5cbmZ1bmN0aW9uIHNldFVuaWZpZWQoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmVzb2x2ZShjb21wb25lbnQuc3RhZ2VWYWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGhhbmRsZSA9IGlzRnVuY3Rpb24odmFsdWUpID8gY2FsbEFuZFNldCA6IGlzVGhlbmFibGUodmFsdWUpID8gd2FpdEFuZFNldCA6IGlzR2VuZXJhdG9yKHZhbHVlKSA/IGFkdmFuY2VUb0VuZCA6XG4gIC8qIG90aGVyd2lzZSAqL3NldDtcblxuICBoYW5kbGUoY29tcG9uZW50LCBpc0luR2VuZXJhdG9yLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGUgZXZlbnQgbmFtZSBmb3IgYFNlbmRBY3Rpb25FdmVudGAuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG52YXIgRVZFTlRfTkFNRSA9IFwiaGVsaXgtc2VudC1hY3Rpb25cIjtleHBvcnRzLkVWRU5UX05BTUUgPSBFVkVOVF9OQU1FO1xuXG5mdW5jdGlvbiBjcmVhdGVTZW5kQWN0aW9uRXZlbnQoYWN0aW9uLCBhcmdzLCBjYWxsYmFjaykge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIGludmFyaWFudCh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIsIFwiYWN0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShhcmdzKSwgXCJhcmdzIHNob3VsZCBiZSBhbiBhcnJheS5cIik7XG4gICAgaW52YXJpYW50KGNhbGxiYWNrID09IG51bGwgfHwgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIsIFwiY2FsbGJhY2sgc2hvdWxkIGJlIGEgZnVuY3Rpb24gb3Igbm90aGluZy5cIik7XG5cbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sgPSBwcmludEVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XG4gIHZhciBoYW5kbGVkID0gZmFsc2U7XG5cbiAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KEVWRU5UX05BTUUsIHRydWUsIHRydWUsIG51bGwpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhldmVudCwge1xuICAgIGFjdGlvbjoge1xuICAgICAgdmFsdWU6IGFjdGlvbixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBhcmd1bWVudHM6IHtcbiAgICAgIHZhbHVlOiBhcmdzLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIC8vIFRoaXMgaXMgaW50ZXJuYWwgbWV0aG9kLCBjYWxsZWQgZnJvbSBTdGFnZU1peGluLlxuICAgIGFwcGx5VG86IHsgdmFsdWU6IGZ1bmN0aW9uIGFwcGx5VG8oY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgdmFyIGdldCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9uZW50LCBcInN0YWdlVmFsdWVcIik7XG4gICAgICAgICAgdmFyIF9zZXQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbXBvbmVudCwgXCJzZXRTdGFnZVZhbHVlXCIpO1xuICAgICAgICAgIGludmFyaWFudChpc0Z1bmN0aW9uKGdldC5nZXQpLCBcImNvbXBvbmVudC5zdGFnZVZhbHVlIHNob3VsZCBiZSBhIGdldHRlciBwcm9wZXJ0eS5cIik7XG4gICAgICAgICAgaW52YXJpYW50KGlzRnVuY3Rpb24oX3NldC52YWx1ZSksIFwiY29tcG9uZW50LnNldFN0YWdlVmFsdWUgc2hvdWxkIGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgICAgICAgIGludmFyaWFudChoYW5kbGVkID09PSBmYWxzZSwgXCJ0aGlzIFwiICsgRVZFTlRfTkFNRSArIFwiIGV2ZW50IGhhZCBiZWVuIGFwcGxpZWQgYWxyZWFkeS5cIik7XG4gICAgICAgICAgaW52YXJpYW50KGlzRnVuY3Rpb24odGhpcy5hY3Rpb24pLCBcInRoaXMuYWN0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheSh0aGlzLmFyZ3VtZW50cyksIFwidGhpcy5hcmd1bWVudHMgc2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmFjdGlvbi5hcHBseSh0aGlzLCBbY29tcG9uZW50LnN0YWdlVmFsdWVdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodGhpcy5hcmd1bWVudHMpKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0VW5pZmllZChjb21wb25lbnQsIGZhbHNlLCB2YWx1ZSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICB9IH0sXG5cbiAgICAvLyBUaGlzIGlzIGludGVybmFsIG1ldGhvZCwgY2FsbGVkIGZyb20gQWdlbnRNaXhpbi5cbiAgICByZWplY3RJZk5vdEhhbmRsZWQ6IHsgdmFsdWU6IGZ1bmN0aW9uIHJlamVjdElmTm90SGFuZGxlZCgpIHtcbiAgICAgICAgaWYgKGhhbmRsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIm5vdCBoYW5kbGVkXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gfVxuICB9KTtcblxuICByZXR1cm4gZXZlbnQ7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG52YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVhY3QpO1xuXG52YXIgX0ltcGwgPSByZXF1aXJlKFwiLi9zdGFnZS1pbXBsXCIpO1xuXG52YXIgX0ltcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSW1wbCk7XG5cbnZhciBTdGFnZUNvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICBmdW5jdGlvbiBTdGFnZUNvbXBvbmVudChwcm9wcykge1xuICAgIHZhciBzdGFnZVZhbHVlUGF0aCA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGFyZ3VtZW50c1sxXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdGFnZUNvbXBvbmVudCk7XG5cbiAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihTdGFnZUNvbXBvbmVudC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgcHJvcHMpO1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0uaW5pdGlhbGl6ZSh0aGlzLCBzdGFnZVZhbHVlUGF0aCk7XG4gIH1cblxuICBfaW5oZXJpdHMoU3RhZ2VDb21wb25lbnQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gIF9jcmVhdGVDbGFzcyhTdGFnZUNvbXBvbmVudCwgW3tcbiAgICBrZXk6IFwiY29tcG9uZW50RGlkTW91bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnNldHVwSGFuZGxlcih0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcG9uZW50RGlkVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0uc2V0dXBIYW5kbGVyKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wb25lbnRXaWxsVW5tb3VudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIF9JbXBsMltcImRlZmF1bHRcIl0udGVhcmRvd25IYW5kbGVyKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wb25lbnRXaWxsVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICBfSW1wbDJbXCJkZWZhdWx0XCJdLnRlYXJkb3duSGFuZGxlcih0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmlsdGVyQWN0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbHRlckFjdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdGFnZUNvbXBvbmVudDtcbn0pKF9SZWFjdDJbXCJkZWZhdWx0XCJdLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU3RhZ2VDb21wb25lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuLyogZXZlbnQgKi8iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9JbXBsID0gcmVxdWlyZShcIi4vc3RhZ2UtaW1wbFwiKTtcblxudmFyIF9JbXBsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0ltcGwpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgX0ltcGwyW1wiZGVmYXVsdFwiXS5pbml0aWFsaXplKHRoaXMsIHRoaXMuc3RhZ2VWYWx1ZVBhdGggfHwgXCJcIik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0uc2V0dXBIYW5kbGVyKHRoaXMpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0uc2V0dXBIYW5kbGVyKHRoaXMpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgX0ltcGwyW1wiZGVmYXVsdFwiXS50ZWFyZG93bkhhbmRsZXIodGhpcyk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIF9JbXBsMltcImRlZmF1bHRcIl0udGVhcmRvd25IYW5kbGVyKHRoaXMpO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9SZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZWFjdCk7XG5cbnZhciBfY3JlYXRlU2VuZEFjdGlvbkV2ZW50ID0gcmVxdWlyZShcIi4vU2VuZEFjdGlvbkV2ZW50XCIpO1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUoY29tcG9uZW50KSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICAgIGludmFyaWFudChub2RlICE9IG51bGwsIFwiQWdlbnRNaXhpbjogcmVxdWlyZXMgdG8gYmUgcmVuZGVyZWQuXCIpO1xuICAgIH1cbiAgfSxcblxuICBzZW5kQWN0aW9uOiBmdW5jdGlvbiBzZW5kQWN0aW9uKGNvbXBvbmVudCwgYWN0aW9uLCBhcmdzLCBjYWxsYmFjaykge1xuICAgIHZhciBub2RlID0gX1JlYWN0MltcImRlZmF1bHRcIl0uZmluZERPTU5vZGUoY29tcG9uZW50KTtcbiAgICB2YXIgZXZlbnQgPSBfY3JlYXRlU2VuZEFjdGlvbkV2ZW50LmNyZWF0ZVNlbmRBY3Rpb25FdmVudChhY3Rpb24sIGFyZ3MsIGNhbGxiYWNrKTtcblxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQobm9kZSAhPSBudWxsLCBcIkFnZW50TWl4aW46IHJlcXVpcmVzIHRvIGJlIHJlbmRlcmVkLlwiKTtcbiAgICB9XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICBldmVudC5yZWplY3RJZk5vdEhhbmRsZWQoKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfQWdlbnRDb21wb25lbnQgPSByZXF1aXJlKFwiLi9BZ2VudENvbXBvbmVudFwiKTtcblxudmFyIF9BZ2VudENvbXBvbmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BZ2VudENvbXBvbmVudCk7XG5cbnZhciBfQWdlbnRNaXhpbiA9IHJlcXVpcmUoXCIuL0FnZW50TWl4aW5cIik7XG5cbnZhciBfQWdlbnRNaXhpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BZ2VudE1peGluKTtcblxudmFyIF9TdGFnZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL1N0YWdlQ29tcG9uZW50XCIpO1xuXG52YXIgX1N0YWdlQ29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0YWdlQ29tcG9uZW50KTtcblxudmFyIF9TdGFnZU1peGluID0gcmVxdWlyZShcIi4vU3RhZ2VNaXhpblwiKTtcblxudmFyIF9TdGFnZU1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0YWdlTWl4aW4pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcbiAgQWdlbnRDb21wb25lbnQ6IF9BZ2VudENvbXBvbmVudDJbXCJkZWZhdWx0XCJdLFxuICBBZ2VudE1peGluOiBfQWdlbnRNaXhpbjJbXCJkZWZhdWx0XCJdLFxuICBTdGFnZUNvbXBvbmVudDogX1N0YWdlQ29tcG9uZW50MltcImRlZmF1bHRcIl0sXG4gIFN0YWdlTWl4aW46IF9TdGFnZU1peGluMltcImRlZmF1bHRcIl1cbn07XG5leHBvcnRzLkFnZW50Q29tcG9uZW50ID0gX0FnZW50Q29tcG9uZW50MltcImRlZmF1bHRcIl07XG5leHBvcnRzLkFnZW50TWl4aW4gPSBfQWdlbnRNaXhpbjJbXCJkZWZhdWx0XCJdO1xuZXhwb3J0cy5TdGFnZUNvbXBvbmVudCA9IF9TdGFnZUNvbXBvbmVudDJbXCJkZWZhdWx0XCJdO1xuZXhwb3J0cy5TdGFnZU1peGluID0gX1N0YWdlTWl4aW4yW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9SZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZWFjdCk7XG5cbnZhciBfRVZFTlRfTkFNRSA9IHJlcXVpcmUoXCIuL1NlbmRBY3Rpb25FdmVudFwiKTtcblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfVxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcGFyc2VTdGFnZVZhbHVlUGF0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUuc3BsaXQoXCIuXCIpLmZpbHRlcihCb29sZWFuKSA6IFtdO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZGVmaW5lR2V0U3RhZ2VWYWx1ZShwYXJ0cykge1xuICB2YXIgYm9keSA9IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChwYXJ0cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICBib2R5ID0gXCJyZXR1cm4gdGhpcy5zdGF0ZTtcIjtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBsYXN0SW5kZXggPSBwYXJ0cy5sZW5ndGggLSAxO1xuICAgICAgYm9keSA9IFwidmFyIHRtcDAgPSB0aGlzLnN0YXRlO1wiO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SW5kZXg7ICsraSkge1xuICAgICAgICBib2R5ICs9IFwiXFxuaWYgKHRtcFwiICsgaSArIFwiID09IG51bGwpIHtcXG4gIHJldHVybiB1bmRlZmluZWQ7XFxufVxcbnZhciB0bXBcIiArIChpICsgMSkgKyBcIiA9IHRtcFwiICsgaSArIFwiLlwiICsgcGFydHNbaV0gKyBcIjtcIjtcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gXCJcXG5yZXR1cm4gdG1wXCIgKyBsYXN0SW5kZXggKyBcIiAmJiB0bXBcIiArIGxhc3RJbmRleCArIFwiLlwiICsgcGFydHNbbGFzdEluZGV4XSArIFwiO1wiO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gRnVuY3Rpb24oYm9keSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkZWZpbmVTZXRTdGFnZVZhbHVlKHBhcnRzKSB7XG4gIHZhciBib2R5ID0gXCJ2YXIgY2IyID0gY2IgJiYgZnVuY3Rpb24oKSB7IGNiKHRoaXMuc3RhZ2VWYWx1ZSk7IH0uYmluZCh0aGlzKTtcIjtcblxuICBzd2l0Y2ggKHBhcnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJvZHkgKz0gXCJcXG50aGlzLnNldFN0YXRlKHZhbHVlLCBjYjIpO1wiO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDE6XG4gICAgICBib2R5ICs9IFwiXFxudGhpcy5zZXRTdGF0ZSh7XCIgKyBwYXJ0c1swXSArIFwiOiB2YWx1ZX0sIGNiMik7XCI7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbGFzdEluZGV4ID0gcGFydHMubGVuZ3RoIC0gMTtcbiAgICAgIGJvZHkgKz0gXCJcXG52YXIgdG1wMCA9IHRoaXMuc3RhdGUgfHwge307XCI7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJbmRleDsgKytpKSB7XG4gICAgICAgIGJvZHkgKz0gXCJcXG52YXIgdG1wXCIgKyAoaSArIDEpICsgXCIgPSB0bXBcIiArIGkgKyBcIi5cIiArIHBhcnRzW2ldICsgXCI7XFxuaWYgKHRtcFwiICsgKGkgKyAxKSArIFwiID09IG51bGwpIHtcXG4gIHRtcFwiICsgKGkgKyAxKSArIFwiID0gdG1wXCIgKyBpICsgXCIuXCIgKyBwYXJ0c1tpXSArIFwiID0ge307XFxufVwiO1xuICAgICAgfVxuICAgICAgYm9keSArPSBcIlxcbnRtcFwiICsgbGFzdEluZGV4ICsgXCIuXCIgKyBwYXJ0c1tsYXN0SW5kZXhdICsgXCIgPSB2YWx1ZTtcXG50aGlzLnNldFN0YXRlKHRtcDAsIGNiMik7XCI7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBGdW5jdGlvbihcInZhbHVlXCIsIFwiY2JcIiwgYm9keSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBoYW5kbGVTZW5kQWN0aW9uKGV2ZW50KSB7XG4gIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgdGhpcy5maWx0ZXJBY3Rpb24gPT09IFwiZnVuY3Rpb25cIiAmJiAhdGhpcy5maWx0ZXJBY3Rpb24oZXZlbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICBldmVudC5hcHBseVRvKHRoaXMpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRpYWxpemUoY29tcG9uZW50LCBzdGFnZVZhbHVlUGF0aCkge1xuICAgIGlmIChjb21wb25lbnQuc3RhZ2VNaXhpbkluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhcnRzID0gcGFyc2VTdGFnZVZhbHVlUGF0aChzdGFnZVZhbHVlUGF0aCk7XG4gICAgdmFyIGdldFN0YWdlVmFsdWUgPSBkZWZpbmVHZXRTdGFnZVZhbHVlKHBhcnRzKTtcblxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQoc3RhZ2VWYWx1ZVBhdGggPT0gbnVsbCB8fCB0eXBlb2Ygc3RhZ2VWYWx1ZVBhdGggPT09IFwic3RyaW5nXCIsIFwiU3RhZ2VNaXhpbjogc3RhZ2VWYWx1ZVBhdGggc2hvdWxkIGJlIGEgc3RyaW5nLlwiKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2V0U3RhZ2VWYWx1ZS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiU3RhZ2VNaXhpbjogc3RhZ2VWYWx1ZVBhdGggaXMgaW52YWxpZCAoXCIgKyBzdGFnZVZhbHVlUGF0aCArIFwiKS5cIik7XG4gICAgICAgIGVyci5jYXVzZSA9IGNhdXNlO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29tcG9uZW50LCB7XG4gICAgICBzdGFnZU1peGluSW5pdGlhbGl6ZWQ6IHtcbiAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSxcblxuICAgICAgc3RhZ2VNaXhpbkhhbmRsZVNlbmRBY3Rpb246IHtcbiAgICAgICAgdmFsdWU6IGhhbmRsZVNlbmRBY3Rpb24uYmluZChjb21wb25lbnQpLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIHN0YWdlVmFsdWU6IHtcbiAgICAgICAgZ2V0OiBnZXRTdGFnZVZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIHNldFN0YWdlVmFsdWU6IHtcbiAgICAgICAgdmFsdWU6IGRlZmluZVNldFN0YWdlVmFsdWUocGFydHMpLmJpbmQoY29tcG9uZW50KSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0dXBIYW5kbGVyOiBmdW5jdGlvbiBzZXR1cEhhbmRsZXIoY29tcG9uZW50KSB7XG4gICAgdmFyIG5vZGUgPSBfUmVhY3QyW1wiZGVmYXVsdFwiXS5maW5kRE9NTm9kZShjb21wb25lbnQpO1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBpbnZhcmlhbnQobm9kZSAhPSBudWxsLCBcIlN0YWdlTWl4aW46IHJlcXVpcmVzIHRvIGJlIHJlbmRlcmVkLlwiKTtcbiAgICB9XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKF9FVkVOVF9OQU1FLkVWRU5UX05BTUUsIGNvbXBvbmVudC5zdGFnZU1peGluSGFuZGxlU2VuZEFjdGlvbik7XG4gIH0sXG5cbiAgdGVhcmRvd25IYW5kbGVyOiBmdW5jdGlvbiB0ZWFyZG93bkhhbmRsZXIoY29tcG9uZW50KSB7XG4gICAgdmFyIG5vZGUgPSBfUmVhY3QyW1wiZGVmYXVsdFwiXS5maW5kRE9NTm9kZShjb21wb25lbnQpO1xuICAgIGlmIChub2RlICE9IG51bGwpIHtcbiAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihfRVZFTlRfTkFNRS5FVkVOVF9OQU1FLCBjb21wb25lbnQuc3RhZ2VNaXhpbkhhbmRsZVNlbmRBY3Rpb24pO1xuICAgIH1cbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07Il19
