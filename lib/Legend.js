"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d2 = require("d3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Legend =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Legend, _React$Component);

  function Legend() {
    _classCallCheck(this, Legend);

    return _possibleConstructorReturn(this, _getPrototypeOf(Legend).apply(this, arguments));
  }

  _createClass(Legend, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          colorScale = _this$props.colorScale,
          chartWidth = _this$props.chartWidth,
          chartHeight = _this$props.chartHeight,
          margin = _this$props.margin,
          numBoxes = _this$props.numBoxes,
          positionFunction = _this$props.positionFunction,
          orient = _this$props.orient,
          numberFormat = _this$props.numberFormat,
          numLabels = _this$props.numLabels;

      if (colorScale === null || colorScale.range().length === 0) {
        return _react["default"].createElement("g", null);
      } // note: non-default values for numBoxes and numLabels currently only supported for linear scales


      var _positionFunction = positionFunction(margin, chartHeight, chartWidth),
          _positionFunction2 = _slicedToArray(_positionFunction, 2),
          x = _positionFunction2[0],
          y = _positionFunction2[1];

      var displayColors = [];

      if (numBoxes > 1) {
        var min = colorScale.domain()[0];
        var max = colorScale.domain()[colorScale.domain().length - 1];
        var increment = (max - min) / (numBoxes - 1);

        for (var i = 0; i < numBoxes; i++) {
          displayColors.push(colorScale(min + i * increment));
        }
      } else {
        displayColors = colorScale.range();
      }

      var legendBlockWidth = (orient === 'vertical' ? chartHeight : chartWidth) / displayColors.length;
      var legendHeight = 4;
      var labelScale = (0, _d2.scaleLinear)().domain([0, numLabels - 1]).range([colorScale.domain()[0], colorScale.domain()[colorScale.domain().length - 1]]);

      if (orient === 'vertical') {
        var yScale = (0, _d2.scaleLinear)().domain([0, numLabels - 1]).range([15, displayColors.length * legendBlockWidth]);
        return _react["default"].createElement("g", {
          className: "legend",
          transform: 'translate(' + x + ',' + y + ')'
        }, displayColors.map(function (d, i) {
          return _react["default"].createElement("rect", {
            key: i,
            x: 0,
            y: i * legendBlockWidth,
            width: legendHeight,
            height: legendBlockWidth,
            fill: d
          });
        }), (0, _d2.range)(numLabels).map(function (i) {
          return _react["default"].createElement("text", {
            key: 'label ' + i,
            x: 5,
            y: yScale(i)
          }, numberFormat(labelScale(i)));
        }));
      } else {
        var xScale = (0, _d2.scaleLinear)().domain([0, numLabels - 1]).range([0, displayColors.length * legendBlockWidth]);

        var getAnchor = function getAnchor(i) {
          if (i === 0) {
            return 'start';
          }

          if (i === numLabels - 1) {
            return 'end';
          }

          return 'middle';
        };

        return _react["default"].createElement("g", {
          className: "legend",
          transform: 'translate(' + x + ',' + y + ')'
        }, displayColors.map(function (d, i) {
          return _react["default"].createElement("rect", {
            key: i,
            x: i * legendBlockWidth,
            y: 0,
            width: legendBlockWidth,
            height: legendHeight,
            fill: d
          });
        }), (0, _d2.range)(numLabels).map(function (i) {
          return _react["default"].createElement("text", {
            key: 'label ' + i,
            x: xScale(i),
            y: 15,
            textAnchor: getAnchor(i)
          }, numberFormat(labelScale(i)));
        }));
      }
    }
  }]);

  return Legend;
}(_react["default"].Component);

Legend.defaultProps = {
  colorScale: null,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  chartHeight: 0,
  chartWidth: 0,
  positionFunction: function positionFunction(margin, chartHeight, chartWidth) {
    // legend in bottom margin of Chart
    var x = 0;
    var y = chartHeight + margin.top + margin.bottom / 2;
    return [x, y];
  },
  orient: 'horizontal',
  numberFormat: function numberFormat(n) {
    return (0, _d2.format)(',')(Math.round(n));
  },
  numLabels: 2
};
Legend.propTypes = {
  colorScale: _propTypes["default"].any,
  margin: _propTypes["default"].object,
  chartHeight: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  numBoxes: _propTypes["default"].number,
  positionFunction: _propTypes["default"].func,
  orient: _propTypes["default"].string,
  numberFormat: _propTypes["default"].func,
  numLabels: _propTypes["default"].number
};
var _default = Legend;
exports["default"] = _default;