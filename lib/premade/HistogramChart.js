'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var _d2 = require('../util/d3');

var _react3 = require('../util/react');

var _Chart = require('../Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Axis = require('../Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Histogram = require('../Histogram');

var _Histogram2 = _interopRequireDefault(_Histogram);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistogramChart = function (_React$Component) {
  _inherits(HistogramChart, _React$Component);

  function HistogramChart(props) {
    _classCallCheck(this, HistogramChart);

    var _this = _possibleConstructorReturn(this, (HistogramChart.__proto__ || Object.getPrototypeOf(HistogramChart)).call(this, props));

    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);

    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;

    _this.onClick = _this.onClick.bind(_this);
    _this.onBrush = _this._onBrush.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.onResize = _this.onResize.bind(_this);

    _this.updateDomain = _this.updateDomain.bind(_this);
    _this.updateRange = _this.updateRange.bind(_this);

    _this.sortData = _this.sortData.bind(_this);
    _this.getMaxCount = _this.getMaxCount.bind(_this);
    _this.interval = null;

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;

    _this.updateDomain(props, _this.state);
    return _this;
  }

  _createClass(HistogramChart, [{
    key: 'componentWillReceiveProps',
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
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: 'sortData',
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
      });
      // Sort rest of bins in same manner

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
    key: 'getMaxCount',
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
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        var domainData = props.data;

        // Do sorting if set
        if (props.sortBy !== null || props.sortOrder !== null) {
          // Simple deep copy of data to prevent mutation of props
          domainData = this.sortData(JSON.parse(JSON.stringify(props.data)), props, state);
        }

        // Change y scale if altered
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
          this.interval = interval;
          // Add one more interval to the domain so all bins can be rendered property
          xDomain.push(new Date(xDomain[xDomain.length - 1].getTime() + this.interval));
          xDomain = [xDomain[0], xDomain[xDomain.length - 1]];
        }

        // Update scale if domains are new
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
    key: 'updateRange',
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
    key: '_onBrush',
    value: function _onBrush(data) {
      if (data && data.length === 2) {
        this.props.onBrush(data);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event, data) {
      this.props.onClick(event, data);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event, data) {
      if (data && this.tip) {
        this.tip.show(event, data);
      }
      this.props.onEnter(event, data);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event, data) {
      if (data && this.tip) {
        this.tip.hide(event, data);
      }
      this.props.onLeave(event, data);
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.updateRange(this.props, this.state);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      return _react2.default.createElement(
        _Chart2.default,
        _extends({ ref: 'chart' }, (0, _react3.spreadRelated)(_Chart2.default, props), { resizeHandler: this.onResize }),
        _react2.default.createElement(_Histogram2.default, _extends({ className: 'histogram' }, (0, _react3.spreadRelated)(_Histogram2.default, props), {
          brushID: props.brushID,
          xScale: this.xScale, yScale: this.yScale,
          onEnter: this.onEnter, onLeave: this.onLeave, onClick: this.onClick, onBrush: this.onBrush })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis' }, props.xAxis, { scale: this.xScale })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis' }, props.yAxis, { scale: this.yScale }))
      );
    }
  }]);

  return HistogramChart;
}(_react2.default.Component);

HistogramChart.defaultProps = _extends({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  yScaleType: 'linear',
  xScaleType: 'band',
  sortBy: null,
  sortOrder: null,
  sortTypes: []
}, _Chart2.default.defaultProps, _Histogram2.default.defaultProps, {
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

HistogramChart.propTypes = _extends({}, _Histogram2.default.propTypes, _Chart2.default.propTypes, {
  sortBy: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
  sortOrder: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
  sortTypes: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.bool]),
  onBrush: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  tipFunction: _propTypes2.default.func,
  xScaleType: _propTypes2.default.string,
  yScaleType: _propTypes2.default.string,
  xDomain: _propTypes2.default.array,
  yDomain: _propTypes2.default.array,
  xAccessor: _propTypes2.default.any,
  yAccessor: _propTypes2.default.any,
  xAxis: _propTypes2.default.object,
  yAxis: _propTypes2.default.object
});

exports.default = HistogramChart;