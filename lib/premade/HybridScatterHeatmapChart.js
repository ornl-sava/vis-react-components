'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = require('../util/d3');

var _react3 = require('../util/react');

var _Chart = require('../Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Axis = require('../Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Heatmap = require('../Heatmap');

var _Heatmap2 = _interopRequireDefault(_Heatmap);

var _Scatterplot = require('../Scatterplot');

var _Scatterplot2 = _interopRequireDefault(_Scatterplot);

var _ColumnMarkers = require('../ColumnMarkers');

var _ColumnMarkers2 = _interopRequireDefault(_ColumnMarkers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HybridScatterHeatmapChart = function (_React$Component) {
  _inherits(HybridScatterHeatmapChart, _React$Component);

  function HybridScatterHeatmapChart(props) {
    _classCallCheck(this, HybridScatterHeatmapChart);

    var _this = _possibleConstructorReturn(this, (HybridScatterHeatmapChart.__proto__ || Object.getPrototypeOf(HybridScatterHeatmapChart)).call(this, props));

    _this.xScale = (0, _d2.setScale)(props.xScaleType); // Shared time scale
    _this.syScale = (0, _d2.setScale)(props.yScaleType); // Scatterplot scale
    _this.hyScale = (0, _d2.setScale)('linear'); // Heatmap scale
    _this.scatterColorScale = (0, _d2.setScale)('linear');
    _this.heatmapColorScale = (0, _d2.setScale)('quantile');

    _this.scatterSet = (0, _d.set)();

    _this.state = {
      scatterData: [],
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2 // Factor to expand range by
    };

    _this.endTime = _this.props.startTime - _this.props.timeWindow;

    _this.onColumnMarkerClick = _this.onColumnMarkerClick.bind(_this);

    _this.onHeatmapClick = _this.onHeatmapClick.bind(_this);
    _this.onHeatmapEnter = _this.onHeatmapEnter.bind(_this);
    _this.onHeatmapLeave = _this.onHeatmapLeave.bind(_this);

    _this.onScatterplotClick = _this.onScatterplotClick.bind(_this);
    _this.onScatterplotEnter = _this.onScatterplotEnter.bind(_this);
    _this.onScatterplotLeave = _this.onScatterplotLeave.bind(_this);

    _this.onResize = _this.onResize.bind(_this);

    _this.updateDomain = _this.updateDomain.bind(_this);
    _this.updateRange = _this.updateRange.bind(_this);
    _this.updateScatterData = _this.updateScatterData.bind(_this);

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;

    _this.updateDomain(props, _this.state);
    _this.generateColorScale(props, _this.state);
    return _this;
  }

  _createClass(HybridScatterHeatmapChart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      this.updateDomain(nextProps, nextState);
      this.updateRange(nextProps, nextState);
      this.generateColorScale(nextProps, nextState);

      return true;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateScatterData(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: 'generateColorScale',
    value: function generateColorScale(props, state) {
      // Get min/max for scatterplot color scale range
      var yMax = -Infinity;
      var yMin = Infinity;
      if (props.yDomain !== null) {
        yMin = props.yDomain[0];
        yMax = props.yDomain[1];
      } else {
        for (var i = 0; i < props.data.length; i++) {
          for (var j = 0; j < props.data[i].bins.length; j++) {
            for (var k = 0; k < props.data[i].bins[j].data.length; k++) {
              if (props.data[i].bins[j].data[k][props.scatterYAccessor] > yMax) {
                yMax = props.data[i].bins[j].data[k][props.scatterYAccessor];
              }
              if (props.data[i].bins[j].data[k][props.scatterYAccessor] < yMin) {
                yMin = props.data[i].bins[j].data[k][props.scatterYAccessor];
              }
            }
          }
        }
      }

      // Set scatter color scale
      this.scatterColorScale.domain([yMin, yMax]).range([props.scatterMinColor, props.scatterMaxColor]).interpolate(_d.interpolateHcl);

      // Generate temp linear color scale for heatmap color scale
      var tempColorScale = (0, _d2.setScale)('linear').domain([0, props.heatmapNumColorCat]).range([props.heatmapMinColor, props.heatmapMaxColor]).interpolate(_d.interpolateHcl);

      // Generate heatmap color scale range
      var colorRange = [];
      for (var _i = 0; _i < props.heatmapNumColorCat + 1; _i++) {
        colorRange.push(tempColorScale(_i));
      }

      // Generate heatmap color scale domain
      var colorDomain = [0, 1];
      for (var _i2 = 0; _i2 < props.data.length; _i2++) {
        for (var _j = 0; _j < props.data[_i2].bins.length; _j++) {
          var value = props.data[_i2].bins[_j][props.heatmapXAccessor.value];
          colorDomain.push(value === 0 ? 1 : value);
        }
      }

      // Set heatmap color scale
      this.heatmapColorScale.domain(colorDomain).range(colorRange);
    }
  }, {
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        var horzLength = props.data[0].bins.length;
        var originalTimeSlice = props.timeWindow / horzLength;
        var expandedTimeSlice = originalTimeSlice * state.domainExpansionFactor;

        // Compute new end time for expanded slice
        var timeWindow = 0;
        for (var i = 0; i < horzLength; i++) {
          if (state.expandedSectionNumbers.indexOf(i) > -1) {
            timeWindow += expandedTimeSlice;
          } else {
            timeWindow += originalTimeSlice;
          }
        }

        // Push on domain 'slices'
        this.endTime = props.startTime - timeWindow;
        var xDomain = [this.endTime];
        for (var _i3 = 0; _i3 < horzLength - 1; _i3++) {
          var previous = xDomain[xDomain.length - 1];
          if (state.expandedSectionNumbers.indexOf(_i3) > -1) {
            xDomain.push(previous + expandedTimeSlice);
          } else {
            xDomain.push(previous + originalTimeSlice);
          }
        }
        xDomain.push(props.startTime);

        // Update window of time for x scale
        this.xScale.domain(xDomain);

        var yMax = 1;
        var yMin = 0;
        if (props.yDomain !== null) {
          yMin = props.yDomain[0];
          yMax = props.yDomain[1];
        } else {
          for (var _i4 = 0; _i4 < props.data.length; _i4++) {
            for (var j = 0; j < props.data[_i4].bins.length; j++) {
              for (var k = 0; k < props.data[_i4].bins[j].data.length; k++) {
                if (props.data[_i4].bins[j].data[k][props.scatterYAccessor] > yMax) {
                  yMax = props.data[_i4].bins[j].data[k][props.scatterYAccessor];
                }
              }
            }
          }
        }

        // Update scatter y scale domain
        this.syScale.domain([yMin, yMax]);

        // Update heatmap y scale domain
        this.hyScale.domain([0, props.data.length]);
      }
    }
  }, {
    key: 'updateRange',
    value: function updateRange(props, state) {
      var chartWidth = this.refs.chart.chartWidth;
      var chartHeight = this.refs.chart.chartHeight;
      var horzLength = props.data[0].bins.length;

      var originalBlockSize = chartWidth * (1 / horzLength);
      var expandedBlockSize = originalBlockSize * state.rangeExpansionFactor;
      var newBlockSize = (chartWidth - state.expandedSectionNumbers.length * expandedBlockSize) / (horzLength - state.expandedSectionNumbers.length);
      var xRange = [0];

      for (var i = 0; i < horzLength - 1; i++) {
        var previous = xRange[xRange.length - 1];
        if (state.expandedSectionNumbers.indexOf(i) > -1) {
          xRange.push(previous + expandedBlockSize);
        } else {
          xRange.push(previous + newBlockSize);
        }
      }
      xRange.push(chartWidth);

      this.xScale.range(xRange);
      this.syScale.range([chartHeight, 0]);
      this.hyScale.range([chartHeight, 0]);
    }
  }, {
    key: 'updateScatterData',
    value: function updateScatterData(props, state) {
      // Flatten expanded bins
      var scatterData = [];
      var heatmapKeys = this.scatterSet.values();
      for (var i = 0; i < heatmapKeys.length; i++) {
        var key = heatmapKeys[i].split('-');
        var points = props.data[key[0]].bins[key[1]].data;
        for (var j = 0; j < points.length; j++) {
          scatterData.push(points[j]);
        }
      }

      this.setState({
        scatterData: scatterData
      });
    }

    // This onClick is private to premade

  }, {
    key: 'onColumnMarkerClick',
    value: function onColumnMarkerClick(event, data, index) {
      if (event.shiftKey) {
        var heatmap = this.refs.heatmap;
        for (var i = 0; i < this.props.data.length; i++) {
          var bin = heatmap.refs[i + '-' + index];
          console.log(index, bin);
        }
      } else {
        var _i5 = this.state.expandedSectionNumbers.indexOf(index);
        var toExpand = null;
        if (_i5 > -1) {
          toExpand = this.state.expandedSectionNumbers;
          toExpand.splice(_i5, 1);
        } else {
          var chartWidth = this.refs.chart.chartWidth;
          var horzLength = this.props.data[0].bins.length;

          var originalBlockSize = chartWidth * (1 / horzLength);
          var expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor;
          var pending = (this.state.expandedSectionNumbers.length + 1) * expandedBlockSize;
          if (pending >= chartWidth || this.state.expandedSectionNumbers.length + 1 === horzLength) {
            toExpand = this.state.expandedSectionNumbers;
          } else {
            toExpand = this.state.expandedSectionNumbers.concat(index).sort(function (a, b) {
              return a - b;
            });
          }
        }
        this.setState({
          expandedSectionNumbers: toExpand
        });
      }
    }
  }, {
    key: 'onHeatmapClick',
    value: function onHeatmapClick(event, data, index) {
      // Flip fill opacity
      var fillOpacity = event.target.getAttribute('fill-opacity') !== null ? 1 - event.target.getAttribute('fill-opacity') : 0;
      event.target.setAttribute('fill-opacity', fillOpacity);

      // Add heatmap index to scatter set
      if (this.scatterSet.has(index)) {
        this.scatterSet.remove(index);
      } else {
        this.scatterSet.add(index);
      }
      this.updateScatterData(this.props);

      this.props.onHeatmapClick(event, data, index);
    }
  }, {
    key: 'onHeatmapEnter',
    value: function onHeatmapEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }
      this.props.onHeatmapEnter(event, data, index);
    }
  }, {
    key: 'onHeatmapLeave',
    value: function onHeatmapLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }
      this.props.onHeatmapLeave(event, data, index);
    }
  }, {
    key: 'onScatterplotClick',
    value: function onScatterplotClick(event, data, index) {
      this.props.onScatterplotClick(event, data, index);
    }
  }, {
    key: 'onScatterplotEnter',
    value: function onScatterplotEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }
      this.props.onScatterplotEnter(event, data, index);
    }
  }, {
    key: 'onScatterplotLeave',
    value: function onScatterplotLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }
      this.props.onScatterplotLeave(event, data, index);
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.updateRange(this.props, this.state);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var data = _props.data;

      var props = _objectWithoutProperties(_props, ['data']);

      return _react2.default.createElement(
        _Chart2.default,
        _extends({ ref: 'chart' }, (0, _react3.spreadRelated)(_Chart2.default, props), { resizeHandler: this.onResize }),
        _react2.default.createElement(_ColumnMarkers2.default, { data: data, xAccessor: props.heatmapXAccessor,
          colorScale: this.heatmapColorScale, xScale: this.xScale, onClick: this.onColumnMarkerClick }),
        _react2.default.createElement(_Heatmap2.default, { ref: 'heatmap', className: 'heatmap', data: data,
          xScale: this.xScale, yScale: this.hyScale, colorScale: this.heatmapColorScale,
          xAccessor: props.heatmapXAccessor, yAccessor: props.heatmapYAccessor,
          onEnter: this.onHeatmapEnter, onLeave: this.onHeatmapLeave, onClick: this.onHeatmapClick }),
        _react2.default.createElement(_Scatterplot2.default, { ref: 'scatter', className: 'scatter', data: this.state.scatterData, keyFunction: props.scatterKeyFunction,
          xScale: this.xScale, yScale: this.syScale, colorScale: this.scatterColorScale,
          xAccessor: props.scatterXAccessor, yAccessor: props.scatterYAccessor,
          onEnter: this.onScatterplotEnter, onLeave: this.onScatterplotLeave, onClick: this.onScatterplotClick }),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis' }, props.xAxis, { scale: this.xScale })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis' }, props.yAxis, { scale: this.syScale }))
      );
    }
  }]);

  return HybridScatterHeatmapChart;
}(_react2.default.Component);

// Manually define and ovveride scatterplot/heatmap accessors


HybridScatterHeatmapChart.defaultProps = _extends({
  // Premade default
  data: [],
  xDomain: null,
  yDomain: null,
  yScaleType: 'linear',
  xScaleType: 'time',
  scatterMinColor: '#F1F5E9',
  scatterMaxColor: '#7C9B27',
  heatmapMinColor: '#eff3ff',
  heatmapMaxColor: '#2171b5',
  heatmapNumColorCat: 11,
  heatmapXAccessor: _Heatmap2.default.defaultProps.xAccessor,
  heatmapYAccessor: _Heatmap2.default.defaultProps.yAccessor,
  scatterXAccessor: _Scatterplot2.default.defaultProps.xAccessor,
  scatterYAccessor: _Scatterplot2.default.defaultProps.yAccessor,
  scatterKeyFunction: _Scatterplot2.default.defaultProps.keyFunction,
  onHeatmapClick: function onHeatmapClick() {},
  onHeatmapEnter: function onHeatmapEnter() {},
  onHeatmapLeave: function onHeatmapLeave() {},
  onScatterplotClick: function onScatterplotClick() {},
  onScatterplotEnter: function onScatterplotEnter() {},
  onScatterplotLeave: function onScatterplotLeave() {}
}, _Chart2.default.defaultProps, {
  margin: { top: 20, right: 10, bottom: 20, left: 80 },
  // Spread scatter & heatmap default
  // ...Heatmap.defaultProps,
  // ...Scatterplot.defaultProps,
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

// xScaleType - tested to work with time and utc scales
// yScaleType - tested to work with linear scales
// yDomain - can gain a bit of a speedup by manually setting the yDomain
HybridScatterHeatmapChart.propTypes = _extends({
  startTime: _react.PropTypes.number.isRequired,
  timeWindow: _react.PropTypes.number.isRequired,
  scatterMinColor: _react.PropTypes.string,
  scatterMaxColor: _react.PropTypes.string,
  heatmapMinColor: _react.PropTypes.string,
  heatmapMaxColor: _react.PropTypes.string,
  heatmapNumColorCat: _react.PropTypes.number
}, _Heatmap2.default.propTypes, _Scatterplot2.default.propTypes, _Chart2.default.propTypes, {
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tipFunction: _react.PropTypes.func,
  xScaleType: _react.PropTypes.string,
  yScaleType: _react.PropTypes.string,
  xDomain: _react.PropTypes.array,
  yDomain: _react.PropTypes.array,
  xAccessor: _react.PropTypes.any,
  yAccessor: _react.PropTypes.any,
  xAxis: _react.PropTypes.object,
  yAxis: _react.PropTypes.object
});

exports.default = HybridScatterHeatmapChart;