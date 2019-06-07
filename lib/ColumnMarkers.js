"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// NOTE: Fills top margin with rect column markers
// Requires a top margin greater than 5px, xScale, and the data
// Expects 2D data like heatmap
var ColumnMarkers =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ColumnMarkers, _React$Component);

  function ColumnMarkers() {
    _classCallCheck(this, ColumnMarkers);

    return _possibleConstructorReturn(this, _getPrototypeOf(ColumnMarkers).apply(this, arguments));
  }

  _createClass(ColumnMarkers, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          data = _this$props.data,
          onClick = _this$props.onClick,
          xScale = _this$props.xScale,
          xAccessor = _this$props.xAccessor,
          colorScale = _this$props.colorScale,
          chartWidth = _this$props.chartWidth,
          margin = _this$props.margin;
      var y = -margin.top;
      var height = margin.top - 2 > 5 ? margin.top - 2 : 5;
      return _react["default"].createElement("g", {
        className: className
      }, data[0].bins.map(function (d, i) {
        // Get width of column
        var width = i + 1 < data[0].bins.length ? xScale(data[0].bins[i + 1][xAccessor.key]) : chartWidth;
        width -= xScale(d[xAccessor.key]); // Get total value for column

        var total = 0;

        for (var j = 0; j < data.length; j++) {
          total += data[j].bins[i][xAccessor.key];
        }

        return _react["default"].createElement(_SVGComponent["default"], {
          Component: "rect",
          key: i,
          data: d,
          index: i,
          x: xScale(d[xAccessor.key]),
          y: y,
          fill: colorScale(total),
          width: width,
          height: height,
          onClick: onClick,
          onUpdate: {
            func: function func(transition, props) {
              transition.delay(0).duration(500).ease((0, _d.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
              return transition;
            }
          }
        });
      }));
    }
  }]);

  return ColumnMarkers;
}(_react["default"].Component);

ColumnMarkers.defaultProps = {
  data: [],
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: function onClick() {},
  className: 'columnMarker',
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  chartWidth: 0
};
ColumnMarkers.propTypes = {
  data: _propTypes["default"].array,
  colorScale: _propTypes["default"].any,
  xScale: _propTypes["default"].any,
  xAccessor: _propTypes["default"].any,
  onClick: _propTypes["default"].func,
  className: _propTypes["default"].string,
  margin: _propTypes["default"].object,
  chartWidth: _propTypes["default"].number
};
var _default = ColumnMarkers;
exports["default"] = _default;