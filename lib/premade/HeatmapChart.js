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

var _Legend = require('../Legend');

var _Legend2 = _interopRequireDefault(_Legend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeatmapChart = function (_React$Component) {
  _inherits(HeatmapChart, _React$Component);

  function HeatmapChart(props) {
    _classCallCheck(this, HeatmapChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeatmapChart).call(this, props));

    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);
    _this.colorScale = (0, _d2.setScale)('qunatile');

    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.onResize = _this.onResize.bind(_this);

    _this.updateDomain = _this.updateDomain.bind(_this);
    _this.updateRange = _this.updateRange.bind(_this);

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;

    _this.updateDomain(props, _this.state);
    _this.updateColorScales(props, _this.state);
    return _this;
  }

  _createClass(HeatmapChart, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateDomain(nextProps, this.state);
      this.updateColorScales(nextProps, this.state);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: 'updateDomain',
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
          if (this.xScale.type === 'ordinalBand') {
            xDomain = props.data[0].bins.map(function (d) {
              return d[props.xAccessor.key];
            });
          } else {
            xDomain = (0, _d.extent)(props.data[0].bins, function (d) {
              return d[props.xAccessor.key];
            });
            xDomain[1] = xDomain[1] + offset;
          }
        }

        // If yDomain is not predefined
        var yDomain = props.yDomain;
        if (yDomain.length === 0) {
          // NOTE: Computing offset so proper xDomain is given for time scales
          // Nth bin has a start time of it's key; so it's 'end time'
          // must be taken into consideration
          // let offset = props.data[1][props.yAccessor.key] -
          // props.data[0][props.yAccessor.key]
          if (this.yScale.type === 'ordinalBand') {
            yDomain = props.data.map(function (d) {
              return d[props.yAccessor.key];
            });
          } else {
            yDomain = [0.000001, (0, _d.max)(props.data, function (d) {
              return d[props.yAccessor.key];
            })];
            // yDomain[1] = yDomain[1] + offset
          }
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
    key: 'updateColorScales',
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
    key: 'updateRange',
    value: function updateRange(props, state) {
      this.yScale.range([this.refs.chart.chartHeight, 0]);
      if (props.yAxis.innerPadding && /ordinal/.test(this.yScale.type)) {
        this.yScale.paddingInner(props.yAxis.innerPadding);
      }

      if (props.yAxis.outerPadding && /ordinal/.test(this.yScale.type)) {
        this.yScale.paddingOuter(props.yAxis.outerPadding);
      }

      this.xScale.range([0, this.refs.chart.chartWidth]);
      if (props.xAxis.innerPadding && /ordinal/.test(this.xScale.type)) {
        this.xScale.paddingInner(props.xAxis.innerPadding);
      }

      if (props.xAxis.outerPadding && /ordinal/.test(this.xScale.type)) {
        this.xScale.paddingOuter(props.xAxis.outerPadding);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }
      this.props.onEnter(event, data, index);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }
      this.props.onLeave(event, data, index);
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
        _react2.default.createElement(_Heatmap2.default, _extends({ className: 'heatmap' }, (0, _react3.spreadRelated)(_Heatmap2.default, props), {
          xScale: this.xScale, yScale: this.yScale, colorScale: this.colorScale,
          onEnter: this.onEnter, onLeave: this.onLeave, onClick: this.onClick })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis' }, props.xAxis, { scale: this.xScale })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis' }, props.yAxis, { scale: this.yScale })),
        _react2.default.createElement(_Legend2.default, { colorScale: this.colorScale })
      );
    }
  }]);

  return HeatmapChart;
}(_react2.default.Component);

HeatmapChart.defaultProps = _extends({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11
}, _Chart2.default.defaultProps, _Heatmap2.default.defaultProps, {
  xAxis: {
    type: 'x',
    orient: 'bottom',
    innerPadding: null,
    outerPadding: null
  },
  yAxis: {
    type: 'y',
    orient: 'left',
    innerPadding: null,
    outerPadding: null
  }
});

HeatmapChart.propTypes = _extends({
  minColor: _react.PropTypes.string,
  maxColor: _react.PropTypes.string,
  numColorCat: _react.PropTypes.number
}, _Heatmap2.default.propTypes, _Chart2.default.propTypes, {
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

exports.default = HeatmapChart;