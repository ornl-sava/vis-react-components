"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var _d = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Scatterplot =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Scatterplot, _React$Component);

  function Scatterplot(props) {
    var _this;

    _classCallCheck(this, Scatterplot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scatterplot).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Scatterplot, [{
    key: "onClick",
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: "onEnter",
    value: function onEnter(event, data, index) {
      this.props.onEnter(event, data, index);
    }
  }, {
    key: "onLeave",
    value: function onLeave(event, data, index) {
      this.props.onLeave(event, data, index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          keyFunction = _this$props.keyFunction,
          props = _objectWithoutProperties(_this$props, ["keyFunction"]);

      return _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g",
        className: props.className
      }, this.props.data.map(function (d, i) {
        return _react["default"].createElement(_SVGComponent["default"], {
          Component: "circle",
          key: keyFunction(d, i),
          data: d,
          index: i,
          onUpdate: {
            func: function func(transition, props) {
              transition.delay(0).duration(500).ease((0, _d.setEase)('linear')).attr('r', props.r).attr('cx', props.cx).attr('cy', props.cy);
              return transition;
            }
          },
          r: props.radius,
          cx: props.xScale(d[props.xAccessor]),
          cy: props.yScale(d[props.yAccessor]),
          fill: props.colorScale(d[props.colorAccessor]),
          onMouseEnter: _this2.onEnter,
          onMouseLeave: _this2.onLeave,
          onClick: _this2.onClick
        });
      }));
    }
  }]);

  return Scatterplot;
}(_react["default"].Component);

Scatterplot.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  colorAccessor: 'y',
  colorScale: function colorScale() {
    return '';
  },
  keyFunction: function keyFunction(d, i) {
    return i;
  },
  radius: 5,
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {} // xScale - tested to work with linear, log, pow, time, and ordinal point scales
  // yScale - tested to work with linear, log, pow, time, and ordinal point scales
  // keyFunction - returning unique data based ids is required for animations to work in an expected manner

};
Scatterplot.propTypes = {
  chartHeight: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  className: _propTypes["default"].string,
  radius: _propTypes["default"].number,
  xAccessor: _propTypes["default"].string,
  yAccessor: _propTypes["default"].string,
  colorScale: _propTypes["default"].any,
  colorAccessor: _propTypes["default"].string,
  keyFunction: _propTypes["default"].func,
  xScale: _propTypes["default"].any,
  yScale: _propTypes["default"].any,
  data: _propTypes["default"].array,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func
};
var _default = Scatterplot;
exports["default"] = _default;