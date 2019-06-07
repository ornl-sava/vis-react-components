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

var _SummaryTimeline = _interopRequireDefault(require("../SummaryTimeline"));

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

var SummaryTimelineChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SummaryTimelineChart, _React$Component);

  function SummaryTimelineChart(props) {
    var _this;

    _classCallCheck(this, SummaryTimelineChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SummaryTimelineChart).call(this, props));
    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);
    _this.opacityScale = (0, _d2.setScale)('linear');
    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onBrush = _this._onBrush.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.updateDomain = _this.updateDomain.bind(_assertThisInitialized(_this));
    _this.updateRange = _this.updateRange.bind(_assertThisInitialized(_this));

    _this.updateDomain(props, _this.state);

    _this.updateColorScales(props, _this.state);

    return _this;
  }

  _createClass(SummaryTimelineChart, [{
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
    key: "updateColorScales",
    value: function updateColorScales(props, state) {
      var opacityDomain = [];
      var opacityRange = [];

      if (props.data.length > 0) {
        var domainMin = (0, _d.min)(props.data, function (d) {
          return d.opacityValue;
        });
        var domainMax = (0, _d.max)(props.data, function (d) {
          return d.opacityValue;
        });
        opacityDomain = [domainMin, domainMax];
        opacityRange = [0.20, 0.90];
      }

      this.opacityScale.domain(opacityDomain).range(opacityRange);
    }
  }, {
    key: "updateDomain",
    value: function updateDomain(props, state) {
      // console.log('SummaryTimelineChart.updateDomain()')
      if (props.data.length > 0) {
        this.xDomain = (0, _d.extent)(props.data, function (d) {
          return d.date;
        });
        var yMin = Infinity;
        var yMax = -Infinity;

        if (props.showRange1Area && props.showRange2Area) {
          // console.log('Showing both ranges')
          yMin = (0, _d.min)(props.data, function (d) {
            return Math.min(d.avg, Math.min(d.innerRangeMin, d.outerRangeMin));
          });
          yMax = (0, _d.max)(props.data, function (d) {
            return Math.max(d.avg, Math.max(d.innerRangeMax, d.outerRangeMax));
          });
        } else if (props.showRange1Area && !props.showRange2Area) {
          // console.log('Showing only range 1 area')
          yMin = (0, _d.min)(props.data, function (d) {
            return Math.min(d.avg, d.innerRangeMin);
          });
          yMax = (0, _d.max)(props.data, function (d) {
            return Math.max(d.avg, d.innerRangeMax); // return d.innerRangeMax
          });
        } else if (!props.showRange1Area && props.showRange2Area) {
          // console.log('Showing only range 2 area')
          yMin = (0, _d.min)(props.data, function (d) {
            return Math.min(d.avg, d.outerRangeMin); // return d.outerRangeMin
          });
          yMax = (0, _d.max)(props.data, function (d) {
            return Math.max(d.avg, d.outerRangeMax); // return d.outerRangeMax
          });
        } else {
          // console.log('Showing neither range, just avg points')
          yMin = (0, _d.min)(props.data, function (d) {
            return d.avg;
          });
          yMax = (0, _d.max)(props.data, function (d) {
            return d.avg;
          });
        } // let yMin = min(props.data, (d) => { return Math.min(d.innerRangeMin, d.outerRangeMin) })
        // let yMax = max(props.data, (d) => { return Math.max(d.innerRangeMax, d.outerRangeMax) })


        this.yDomain = [yMin, yMax];
        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
      }
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
    key: "_onBrush",
    value: function _onBrush(data) {
      if (data && data.length === 2) {
        this.props.onBrush(data);
      }
    }
  }, {
    key: "onClick",
    value: function onClick(event, data) {
      this.props.onClick(event, data);
    }
  }, {
    key: "onEnter",
    value: function onEnter(event, data) {
      if (data && this.tip) {
        this.tip.show(event, data);
      }

      this.props.onEnter(event, data);
    }
  }, {
    key: "onLeave",
    value: function onLeave(event, data) {
      if (data && this.tip) {
        this.tip.hide(event, data);
      }

      this.props.onLeave(event, data);
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
      }), _react["default"].createElement(_SummaryTimeline["default"], _extends({
        className: "summaryTimeline"
      }, (0, _react2.spreadRelated)(_SummaryTimeline["default"], props), {
        opacityScale: this.opacityScale,
        xScale: this.xScale,
        yScale: this.yScale,
        onBrush: this.onBrush
      })), _react["default"].createElement(_Axis["default"], _extends({
        className: "x axis"
      }, props.xAxis, {
        scale: this.xScale
      })), _react["default"].createElement(_Axis["default"], _extends({
        className: "y axis"
      }, props.yAxis, {
        scale: this.yScale
      })));
    }
  }]);

  return SummaryTimelineChart;
}(_react["default"].Component);

SummaryTimelineChart.defaultProps = _objectSpread({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
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
  },
  xScaleType: 'time',
  yScaleType: 'linear'
}, _Chart["default"].defaultProps, _SummaryTimeline["default"].defaultProps);
SummaryTimelineChart.propTypes = _objectSpread({}, _SummaryTimeline["default"].propTypes, _Chart["default"].propTypes, {
  onBrush: _propTypes["default"].func,
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
var _default = SummaryTimelineChart;
exports["default"] = _default;