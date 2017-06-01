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

var _SummaryTimeline = require('../SummaryTimeline');

var _SummaryTimeline2 = _interopRequireDefault(_SummaryTimeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SummaryTimelineChart = function (_React$Component) {
  _inherits(SummaryTimelineChart, _React$Component);

  function SummaryTimelineChart(props) {
    _classCallCheck(this, SummaryTimelineChart);

    var _this = _possibleConstructorReturn(this, (SummaryTimelineChart.__proto__ || Object.getPrototypeOf(SummaryTimelineChart)).call(this, props));

    _this.xScale = (0, _d2.setScale)(props.xScaleType);
    _this.yScale = (0, _d2.setScale)(props.yScaleType);

    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.onResize = _this.onResize.bind(_this);

    _this.updateDomain = _this.updateDomain.bind(_this);
    _this.updateRange = _this.updateRange.bind(_this);

    _this.updateDomain(props, _this.state);
    return _this;
  }

  _createClass(SummaryTimelineChart, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
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
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      if (props.data.length > 0) {
        this.xDomain = (0, _d.extent)(props.data, function (d) {
          return d.date;
        });
        var yMin = (0, _d.min)(props.data, function (d) {
          return d.min;
        });
        var yMax = (0, _d.max)(props.data, function (d) {
          return d.max;
        });
        this.yDomain = [yMin, yMax];

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
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
        _react2.default.createElement(_SummaryTimeline2.default, _extends({ className: 'summaryTimeline' }, (0, _react3.spreadRelated)(_SummaryTimeline2.default, props))),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis' }, props.xAxis, { scale: this.xScale })),
        _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis' }, props.yAxis, { scale: this.yScale }))
      );
    }
  }]);

  return SummaryTimelineChart;
}(_react2.default.Component);

SummaryTimelineChart.defaultProps = _extends({
  // Premade default
  data: [],
  xDomain: [],
  yDomain: []
}, _Chart2.default.defaultProps, _SummaryTimeline2.default.defaultProps, {
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
});

SummaryTimelineChart.propTypes = _extends({}, _SummaryTimeline2.default.propTypes, _Chart2.default.propTypes, {
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

exports.default = SummaryTimelineChart;