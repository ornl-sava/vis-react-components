"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var _d = require("d3");

var _d2 = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Heatmap =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Heatmap, _React$Component);

  function Heatmap(props) {
    var _this;

    _classCallCheck(this, Heatmap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Heatmap).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Heatmap, [{
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

      return _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g",
        className: this.props.className
      }, this.props.data.map(function (d, i) {
        var height = i === 0 ? _this2.props.chartHeight : _this2.props.yScale(_this2.props.data[i - 1][_this2.props.yAccessor.key]);
        height -= _this2.props.yScale(d[_this2.props.yAccessor.key]);
        return d.bins.map(function (e, j) {
          var width = j + 1 < d.bins.length ? _this2.props.xScale(d.bins[j + 1][_this2.props.xAccessor.key]) : _this2.props.chartWidth;
          width -= _this2.props.xScale(e[_this2.props.xAccessor.key]);
          return _react["default"].createElement(_SVGComponent["default"], {
            Component: "rect",
            key: i + '-' + j,
            data: e,
            index: i + '-' + j,
            x: _this2.props.xScale(e[_this2.props.xAccessor.key]),
            y: _this2.props.yScale(d[_this2.props.yAccessor.key]),
            width: width,
            height: height,
            fill: _this2.props.colorScale(e[_this2.props.xAccessor.value]),
            onEnter: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attrTween('fill', function () {
                  return (0, _d.interpolate)(_this2.props.colorScale.range()[0], props.fill);
                });
                return transition;
              }
            },
            onUpdate: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
                return transition;
              }
            },
            onMouseEnter: _this2.onEnter,
            onMouseLeave: _this2.onLeave,
            onClick: _this2.onClick
          });
        });
      }));
    }
  }]);

  return Heatmap;
}(_react["default"].Component);

Heatmap.defaultProps = {
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {} // xScale - tested to work with linear, log, pow, time, and ordinal band scales
  // yScale - tested to work with linear, log, pow, time, and ordinal band scales

};
Heatmap.propTypes = {
  colorScale: _propTypes["default"].any,
  xAccessor: _propTypes["default"].object,
  yAccessor: _propTypes["default"].object,
  chartHeight: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  className: _propTypes["default"].string,
  data: _propTypes["default"].array,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  xScale: _propTypes["default"].any,
  yScale: _propTypes["default"].any
};
var _default = Heatmap;
exports["default"] = _default;