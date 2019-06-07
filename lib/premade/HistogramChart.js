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

var _Histogram = _interopRequireDefault(require("../Histogram"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HistogramChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HistogramChart, _React$Component);

  function HistogramChart(props) {
    var _this;

    _classCallCheck(this, HistogramChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HistogramChart).call(this, props));
    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);
    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onBrush = _this._onBrush.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.updateDomain = _this.updateDomain.bind(_assertThisInitialized(_this));
    _this.updateRange = _this.updateRange.bind(_assertThisInitialized(_this));
    _this.sortData = _this.sortData.bind(_assertThisInitialized(_this));
    _this.getMaxCount = _this.getMaxCount.bind(_assertThisInitialized(_this));
    _this.interval = null;
    _this.tip = props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;

    _this.updateDomain(props, _this.state);

    return _this;
  }

  _createClass(HistogramChart, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.xScaleType !== nextProps.xScaleType) {
        console.log('Updating scale from : ' + this.props.xScaleType + ' ==> ' + nextProps.xScaleType);
        this.xScale = (0, _d2.setScale)(nextProps.xScaleType);
      }

      if (this.props.yScaleType !== nextProps.yScaleType) {
        this.yScale = (0, _d2.setScale)(nextProps.yScaleType);
      }

      this.updateDomain(nextProps, this.state);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: "sortData",
    value: function sortData(data, props, state) {
      var sortArr = [];
      var sortOrder = props.sortOrder === 'ascending' || props.sortOrder === 'asc' || props.sortOrder == null ? 'ascending' : 'descending';
      var sortBy = props.sortBy === 'x' || props.sortBy == null ? 'x' : 'y';
      data[0].bins.sort(function (a, b) {
        var i = 0;

        if (sortBy === 'x' || sortBy == null) {
          if (sortOrder) {
            i = (0, _d.ascending)(a[props.xAccessor], b[props.xAccessor]);
          } else {
            i = (0, _d.descending)(a[props.xAccessor], b[props.xAccessor]);
          }
        } else {
          var useBin = props.sortTypes.indexOf(data[0].type) > -1 || props.sortTypes.length === 0;
          var ya = useBin ? a[props.yAccessor] : 0;
          var yb = useBin ? b[props.yAccessor] : 0;

          for (var j = 1; j < data.length; j++) {
            var _useBin = props.sortTypes.indexOf(data[j].type) > -1 || props.sortTypes.length === 0;

            if (_useBin) {
              data[j].bins.forEach(function (d, i) {
                if (d[props.xAccessor] === a[props.xAccessor]) {
                  ya += d[props.yAccessor];
                }

                if (d[props.xAccessor] === b[props.xAccessor]) {
                  yb += d[props.yAccessor];
                }
              });
            }
          }

          i = sortOrder === 'ascending' ? ya - yb : yb - ya;
        }

        sortArr.push(i);
        return i;
      }); // Sort rest of bins in same manner

      var _loop = function _loop(i) {
        var j = 0;
        data[i].bins.sort(function (a, b) {
          return sortArr[j++];
        });
      };

      for (var i = 1; i < data.length; i++) {
        _loop(i);
      }

      return data;
    }
  }, {
    key: "getMaxCount",
    value: function getMaxCount(dataArr) {
      var max = 0;
      var props = this.props;

      if (props.type === 'stacked') {
        var xArr = dataArr.reduce(function (prev, datum, histogramIndex) {
          if (histogramIndex > 0) {
            datum.bins.map(function (bin, index) {
              prev[index] += bin[props.yAccessor];
            });
          }

          return prev;
        }, dataArr[0].bins.map(function (bin) {
          return bin[props.yAccessor];
        }));
        max = Math.max.apply(Math, _toConsumableArray(xArr));
      } else {
        max = dataArr.reduce(function (oldMax, datum) {
          var localMax = Math.max.apply(Math, _toConsumableArray(datum.bins.map(function (bin) {
            return bin[props.yAccessor];
          })));
          return localMax > oldMax ? localMax : oldMax;
        }, 0);
      }

      return max;
    }
  }, {
    key: "updateDomain",
    value: function updateDomain(props, state) {
      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        var domainData = props.data; // Do sorting if set

        if (props.sortBy !== null || props.sortOrder !== null) {
          // Simple deep copy of data to prevent mutation of props
          domainData = this.sortData(JSON.parse(JSON.stringify(props.data)), props, state);
        } // Change y scale if altered


        if (props.yScaleType !== this.props.yScaleType) {
          this.yScale = (0, _d2.setScale)(props.yScaleType);
          this.updateRange(props, state);
        }

        var yDomain = [0.00001, this.getMaxCount(props.data) * 1.1];
        var xDomain = domainData[0].bins.map(function (bin) {
          return bin[props.xAccessor];
        });

        if (this.xScale.type === 'linear' || this.xScaleType === 'log' || this.xScale.type === 'pow') {
          this.interval = xDomain[1] - xDomain[0];
          xDomain = [xDomain[0], xDomain[xDomain.length - 1] + this.interval];
        } else if (this.xScale.type === 'time' || this.xScale.type === 'utc') {
          var interval = xDomain[1].getTime() - xDomain[0].getTime();
          this.interval = interval; // Add one more interval to the domain so all bins can be rendered property

          xDomain.push(new Date(xDomain[xDomain.length - 1].getTime() + this.interval));
          xDomain = [xDomain[0], xDomain[xDomain.length - 1]];
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
      }), _react["default"].createElement(_Histogram["default"], _extends({
        className: "histogram"
      }, (0, _react2.spreadRelated)(_Histogram["default"], props), {
        brushID: props.brushID,
        xScale: this.xScale,
        yScale: this.yScale,
        onEnter: this.onEnter,
        onLeave: this.onLeave,
        onClick: this.onClick,
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

  return HistogramChart;
}(_react["default"].Component);

HistogramChart.defaultProps = _objectSpread({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  yScaleType: 'linear',
  xScaleType: 'band',
  sortBy: null,
  sortOrder: null,
  sortTypes: []
}, _Chart["default"].defaultProps, _Histogram["default"].defaultProps, {
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
HistogramChart.propTypes = _objectSpread({}, _Histogram["default"].propTypes, _Chart["default"].propTypes, {
  sortBy: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  sortOrder: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  sortTypes: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].bool]),
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
var _default = HistogramChart;
exports["default"] = _default;