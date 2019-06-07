"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("d3");

var _react2 = require("./util/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Set prop types here so internal class methods can access prop types
var SVGComponentPropTypes = {
  // Container props
  Component: _propTypes["default"].any,
  className: _propTypes["default"].string,
  id: _propTypes["default"].string,
  data: _propTypes["default"].any,
  index: _propTypes["default"].any,
  children: _propTypes["default"].any,
  // Container enter/exit/update for animations
  onEnter: _propTypes["default"].any,
  onUpdate: _propTypes["default"].any,
  onExit: _propTypes["default"].any,
  // Container action handlers
  onClick: _propTypes["default"].func,
  onMouseEnter: _propTypes["default"].func,
  onMouseLeave: _propTypes["default"].func,
  onContextMenu: _propTypes["default"].func,
  onDoubleClick: _propTypes["default"].func,
  onMouseDown: _propTypes["default"].func,
  onMouseUp: _propTypes["default"].func,
  onMouseMove: _propTypes["default"].func,
  onMouseOut: _propTypes["default"].func,
  onMouseOver: _propTypes["default"].func
};

var SVGComponent =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SVGComponent, _React$Component);

  function SVGComponent(props) {
    var _this;

    _classCallCheck(this, SVGComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SVGComponent).call(this, props)); // Need state that doesn't rely on setState triggers

    _this.simpleState = _extends((0, _react2.spreadExclude)(props, SVGComponentPropTypes));
    _this.animate = _this.animate.bind(_assertThisInitialized(_this));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onMouseEnter = _this.onMouseEnter.bind(_assertThisInitialized(_this));
    _this.onMouseLeave = _this.onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onContextMenu = _this.onContextMenu.bind(_assertThisInitialized(_this));
    _this.onDoubleClick = _this.onDoubleClick.bind(_assertThisInitialized(_this));
    _this.onMouseDown = _this.onMouseDown.bind(_assertThisInitialized(_this));
    _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_this));
    _this.onMouseOver = _this.onMouseOver.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SVGComponent, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      // End transition early
      // Fire animation callback
      if (this.animating) {
        (0, _d.select)(this.refs.node).transition().duration(0);
        this.callback();
        this.animating = false;
      }

      return true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounting = true;
    }
  }, {
    key: "componentWillAppear",
    value: function componentWillAppear(callback) {
      this.animate(callback, this.props, 'onEnter');
    }
  }, {
    key: "componentWillEnter",
    value: function componentWillEnter(callback) {
      this.animate(callback, this.props, 'onEnter');
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {
      this.animate(function () {}, nextProps, 'onUpdate');
    }
  }, {
    key: "componentWillLeave",
    value: function componentWillLeave(callback) {
      this.animate(callback, this.props, 'onExit');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.animating = false;
    }
  }, {
    key: "animate",
    value: function animate(callback, props, type) {
      var _this2 = this;

      this.callback = callback;
      this.animating = true;
      var node = (0, _d.select)(this.refs.node);
      node.transition().call(function (transition) {
        props[type].func(transition, props);
      }).on('end', function () {
        if (!_this2.unmounting) {
          _this2.simpleState = _extends((0, _react2.spreadExclude)(props, SVGComponentPropTypes)); // console.log(callback)

          callback();
        }
      });
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      this.props.onClick(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(event) {
      this.props.onMouseEnter(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave(event) {
      this.props.onMouseLeave(event, this.props.data, this.props.index);
    }
  }, {
    key: "onContextMenu",
    value: function onContextMenu(event) {
      this.props.onContextMenu(event, this.props.data, this.props.index);
    }
  }, {
    key: "onDoubleClick",
    value: function onDoubleClick(event) {
      this.props.onDoubleClick(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      this.props.onMouseDown(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(event) {
      this.props.onMouseUp(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      this.props.onMouseMove(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut(event) {
      this.props.onMouseOut(event, this.props.data, this.props.index);
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(event) {
      this.props.onMouseOver(event, this.props.data, this.props.index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          Component = _this$props.Component,
          props = _objectWithoutProperties(_this$props, ["Component"]);

      return _react["default"].createElement(Component, _extends({
        ref: "node",
        className: props.className,
        id: props.id
      }, this.simpleState, {
        onClick: this.onClick,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onContextMenu: this.onContextMenu,
        onDoubleClick: this.onDoubleClick,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        onMouseOver: this.onMouseOver
      }), this.props.children);
    }
  }]);

  return SVGComponent;
}(_react["default"].Component);

SVGComponent.defaultProps = {
  Component: 'g',
  id: '',
  className: '',
  data: null,
  index: null,
  onEnter: {
    func: function func() {}
  },
  onUpdate: {
    func: function func() {}
  },
  onExit: {
    func: function func() {}
  },
  onClick: function onClick() {},
  onMouseEnter: function onMouseEnter() {},
  onMouseLeave: function onMouseLeave() {},
  onContextMenu: function onContextMenu() {},
  onDoubleClick: function onDoubleClick() {},
  onMouseDown: function onMouseDown() {},
  onMouseUp: function onMouseUp() {},
  onMouseMove: function onMouseMove() {},
  onMouseOut: function onMouseOut() {},
  onMouseOver: function onMouseOver() {}
};
SVGComponent.propTypes = SVGComponentPropTypes;
var _default = SVGComponent;
exports["default"] = _default;