"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("d3");

var _d2 = require("../util/d3");

var _react2 = require("../util/react");

var _Chart = _interopRequireDefault(require("../Chart"));

var _Axis = _interopRequireDefault(require("../Axis"));

var _Tooltip = _interopRequireDefault(require("../Tooltip"));

var _Heatmap = _interopRequireDefault(require("../Heatmap"));

var _Legend = _interopRequireDefault(require("../Legend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeatmapChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HeatmapChart, _React$Component);

  function HeatmapChart(props) {
    var _this;

    _classCallCheck(this, HeatmapChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeatmapChart).call(this, props));
    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);
    _this.colorScale = (0, _d2.setScale)('quantile');
    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.updateDomain = _this.updateDomain.bind(_assertThisInitialized(_this));
    _this.updateRange = _this.updateRange.bind(_assertThisInitialized(_this));
    _this.tip = props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;

    _this.updateDomain(props, _this.state);

    _this.updateColorScales(props, _this.state);

    return _this;
  }

  _createClass(HeatmapChart, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updateDomain(nextProps, this.state);
      this.updateColorScales(nextProps, this.state);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: "updateDomain",
    value: function updateDomain(props, state) {
      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        // If xDomain is not predefined
        // NOTE: When determining domain for x the first bin is Used
        // Each bin should have matching x domain keys
        var xDomain = props.xDomain;

        if (xDomain.length === 0) {
          // NOTE: Computing offset so proper xDomain is given for time scales
          // Nth bin has a start time of it's key; so it's 'end time'
          // must be taken into consideration
          var offset = props.data[0].bins[1][props.xAccessor.key] - props.data[0].bins[0][props.xAccessor.key];

          if (this.xScale.type === 'band') {
            xDomain = props.data[0].bins.map(function (d) {
              return d[props.xAccessor.key];
            });
          } else {
            xDomain = (0, _d.extent)(props.data[0].bins, function (d) {
              return d[props.xAccessor.key];
            });
            xDomain[1] = xDomain[1] + offset;
          }
        } // If yDomain is not predefined


        var yDomain = props.yDomain;

        if (yDomain.length === 0) {
          // NOTE: Computing offset so proper xDomain is given for time scales
          // Nth bin has a start time of it's key; so it's 'end time'
          // must be taken into consideration
          // let offset = props.data[1][props.yAccessor.key] -
          // props.data[0][props.yAccessor.key]
          if (this.yScale.type === 'band') {
            yDomain = props.data.map(function (d) {
              return d[props.yAccessor.key];
            });
          } else {
            yDomain = [0.000001, (0, _d.max)(props.data, function (d) {
              return d[props.yAccessor.key];
            })]; // yDomain[1] = yDomain[1] + offset
          }
        } // Update scale if domains are new


        if (xDomain !== this.xDomain) {
          this.xScale.domain(xDomain);
          this.xDomain = xDomain;
        }

        if (yDomain !== this.yDomain) {
          this.yScale.domain(yDomain);
          this.yDomain = yDomain;
        }
      }
    }
  }, {
    key: "updateColorScales",
    value: function updateColorScales(props, state) {
      // Generate color scale
      var colorDomain = [];
      var colorRange = [];

      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        var yMax = (0, _d.max)(props.data, function (d, i) {
          return (0, _d.max)(d.bins, function (e, j) {
            return e[props.xAccessor.value];
          });
        });
        var tempColorScale = (0, _d2.setScale)('linear').domain([0, yMax]).range([props.minColor, props.maxColor]).interpolate(_d.interpolateHcl);
        colorDomain = [0, 1];
        colorRange = [props.minColor];
        var colorDomainBand = yMax / (props.numColorCat - 1);

        for (var i = 2; i < props.numColorCat + 1; i++) {
          var value = colorDomain[i - 1] + colorDomainBand;
          if (i === 2) value--;
          colorDomain.push(value);
          colorRange.push(tempColorScale(value));
        }
      }

      this.colorScale.domain(colorDomain).range(colorRange);
    }
  }, {
    key: "updateRange",
    value: function updateRange(props, state) {
      this.yScale.range([this.refs.chart.chartHeight, 0]);

      if (props.yAxis.innerPadding && (0, _d2.isOrdinalScale)(this.yScale.type)) {
        this.yScale.paddingInner(props.yAxis.innerPadding);
      }

      if (props.yAxis.outerPadding && (0, _d2.isOrdinalScale)(this.yScale.type)) {
        this.yScale.paddingOuter(props.yAxis.outerPadding);
      }

      this.xScale.range([0, this.refs.chart.chartWidth]);

      if (props.xAxis.innerPadding && (0, _d2.isOrdinalScale)(this.xScale.type)) {
        this.xScale.paddingInner(props.xAxis.innerPadding);
      }

      if (props.xAxis.outerPadding && (0, _d2.isOrdinalScale)(this.xScale.type)) {
        this.xScale.paddingOuter(props.xAxis.outerPadding);
      }
    }
  }, {
    key: "onClick",
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: "onEnter",
    value: function onEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }

      this.props.onEnter(event, data, index);
    }
  }, {
    key: "onLeave",
    value: function onLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }

      this.props.onLeave(event, data, index);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.updateRange(this.props, this.state);
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return _react["default"].createElement(_Chart["default"], _extends({
        ref: "chart"
      }, (0, _react2.spreadRelated)(_Chart["default"], props), {
        resizeHandler: this.onResize
      }), _react["default"].createElement(_Heatmap["default"], _extends({
        className: "heatmap"
      }, (0, _react2.spreadRelated)(_Heatmap["default"], props), {
        xScale: this.xScale,
        yScale: this.yScale,
        colorScale: this.colorScale,
        onEnter: this.onEnter,
        onLeave: this.onLeave,
        onClick: this.onClick
      })), _react["default"].createElement(_Axis["default"], _extends({
        className: "x axis"
      }, props.xAxis, {
        scale: this.xScale
      })), _react["default"].createElement(_Axis["default"], _extends({
        className: "y axis"
      }, props.yAxis, {
        scale: this.yScale
      })), _react["default"].createElement(_Legend["default"], {
        colorScale: this.colorScale
      }));
    }
  }]);

  return HeatmapChart;
}(_react["default"].Component);

HeatmapChart.defaultProps = _objectSpread({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11
}, _Chart["default"].defaultProps, _Heatmap["default"].defaultProps, {
  xAxis: {
    type: 'x',
    orient: 'bottom',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  },
  yAxis: {
    type: 'y',
    orient: 'left',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  }
});
HeatmapChart.propTypes = _objectSpread({
  minColor: _propTypes["default"].string,
  maxColor: _propTypes["default"].string,
  numColorCat: _propTypes["default"].number
}, _Heatmap["default"].propTypes, _Chart["default"].propTypes, {
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  tipFunction: _propTypes["default"].func,
  xScaleType: _propTypes["default"].string,
  yScaleType: _propTypes["default"].string,
  xDomain: _propTypes["default"].array,
  yDomain: _propTypes["default"].array,
  xAccessor: _propTypes["default"].any,
  yAccessor: _propTypes["default"].any,
  xAxis: _propTypes["default"].object,
  yAxis: _propTypes["default"].object
});
var _default = HeatmapChart;
exports["default"] = _default;