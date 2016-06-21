'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _d3Tip = require('d3-tip');

var _d3Tip2 = _interopRequireDefault(_d3Tip);

var _Axis = require('./Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  _createClass(Chart, [{
    key: '_onEnter',
    value: function _onEnter(tooltipData, svgElement) {
      if (tooltipData && this.tip) {
        this.tip.show(tooltipData, svgElement);
      }
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(tooltipData, svgElement) {
      if (tooltipData && this.tip) {
        this.tip.hide(tooltipData, svgElement);
      }
    }
  }]);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, props));

    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.tip = props.tipFunction ? (0, _d3Tip2.default)().attr('class', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    _this.setXScale = _this.setXScale.bind(_this);
    _this.setYScale = _this.setYScale.bind(_this);
    _this.state = {
      chartWidth: props.width,
      chartHeight: props.width,
      xScaleType: props.xScaleType,
      yScaleType: props.yScaleType
    };

    _this.setXScale(_this.state);
    _this.setYScale(_this.state);
    return _this;
  }

  _createClass(Chart, [{
    key: 'setXScale',
    value: function setXScale(state) {
      // Setup xScale
      if (state.xScaleType === 'ordinal') {
        this.xScale = _d2.default.scale.ordinal();
        this.xScale.rangeRoundBands([0, state.chartWidth]);
      } else if (state.xScaleType === 'temporal') {
        this.xScale = _d2.default.time.scale.utc();
      } else if (state.xScaleType === 'log') {
        this.xScale = _d2.default.scale.log();
      } else if (state.xScaleType === 'power') {
        this.xScale = _d2.default.scale.pow().exponent(0.5);
      } else {
        this.xScale = _d2.default.scale.linear();
      }
    }
  }, {
    key: 'setYScale',
    value: function setYScale(state) {
      // Setup yScale
      if (state.yScaleType === 'ordinal') {
        this.yScale = _d2.default.scale.ordinal();
        this.yScale.rangeRoundBands([state.chartHeight, 0]);
      } else if (state.yScaleType === 'temporal') {
        this.yScale = _d2.default.time.scale.utc();
      } else if (state.yScaleType === 'log') {
        this.yScale = _d2.default.scale.log();
      } else if (state.yScaleType === 'power') {
        this.yScale = _d2.default.scale.pow().exponent(0.5);
      } else {
        this.yScale = _d2.default.scale.linear();
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var newData = nextProps.data.length !== this.props.data.length;
      var loading = nextProps.loading !== this.props.loading;
      var newXScale = nextState.xScaleType !== this.state.xScaleType;
      var newYScale = nextState.yScaleType !== this.state.yScaleType;
      var newSortOrder = nextState.fieldSortOrder !== this.state.fieldSortOrder;
      var newSortKey = nextState.fieldSortBy !== this.state.fieldSortBy;
      if (newXScale) {
        this.setXScale(nextState);
        this.resizeChart();
      }
      if (newYScale) {
        this.setYScale(nextState);
        this.resizeChart();
      }
      return newData || loading || newYScale || newSortOrder || newSortKey;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
    // React LifeCycle method - called after initial render

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._handleResize = (0, _lodash2.default)(this.resizeChart.bind(this), 500);
      window.addEventListener('resize', this._handleResize, false);
      this.resizeChart();
      if (this.tip) {
        _d2.default.select(this.refs.svgRoot).call(this.tip);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._handleResize, false);
    }
  }, {
    key: 'resizeChart',
    value: function resizeChart() {
      var _this2 = this;

      var props = this.props;
      var rootRect = this.refs.rootElement.getBoundingClientRect();
      var svg = _d2.default.select(this.refs.svgRoot);
      // let container = d3.select(this.refs.container)
      var chartWidth = props.width === 0 ? rootRect.width - props.margin.left - props.margin.right : Math.min(rootRect.width - props.margin.left - props.margin.right, props.width - props.margin.left - props.margin.right);
      var chartHeight = props.height - props.margin.top - props.margin.bottom;
      svg.attr('width', props.width === 0 ? rootRect.width : props.width).attr('height', props.height);

      // container.select('.reset')
      //   .attr('x', chartWidth - 40)
      //   .attr('y', -props.margin.top + 1)
      if (props.yScaleType === 'ordinal') {
        this.yScale.rangeRoundBands([chartHeight, 0]);
      } else {
        this.yScale.range([chartHeight, 0]);
      }

      if (props.xScaleType === 'ordinal') {
        this.xScale.rangeRoundBands([0, chartWidth]);
      } else {
        this.xScale.range([0, chartWidth]);
      }

      this.setState({ chartWidth: chartWidth, chartHeight: chartHeight }, function () {
        _this2.forceUpdate();
      });
    }

    // We can pass down properties from Chart to children React components

  }, {
    key: 'renderChild',
    value: function renderChild() {
      return (0, _react.cloneElement)(_react.Children.only(this.props.children), {
        data: this.props.data,
        loading: this.props.loading,
        status: this.props.status,
        chartWidth: this.state.chartWidth,
        chartHeight: this.state.chartHeight,
        ref: 'child',
        xScale: this.xScale,
        xScaleType: this.props.xScaleType,
        yScale: this.yScale,
        yScaleType: this.props.yScaleType,
        onEnter: this.onEnter,
        onLeave: this.onLeave
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var margin = props.margin;
      var left = props.margin.left;
      var top = props.margin.top;
      var child = this.renderChild();
      return _react2.default.createElement(
        'div',
        { ref: 'rootElement', className: props.className, style: { position: 'relative' } },
        _react2.default.createElement(
          'svg',
          { ref: 'svgRoot' },
          _react2.default.createElement(
            'g',
            { ref: 'container', className: 'container', transform: 'translate(' + left + ',' + top + ')' },
            child,
            _react2.default.createElement(
              'g',
              { className: 'chart-title' },
              _react2.default.createElement(
                'text',
                { y: -props.margin.top + 1, dy: '0.71em' },
                props.title.replace(/_/g, ' ')
              )
            ),
            props.xAxis ? _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis', margin: margin }, props.xAxis, { data: props.data, scale: this.xScale }, this.state)) : undefined,
            props.yAxis ? _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis', margin: margin }, props.yAxis, { data: props.data, scale: this.yScale }, this.state)) : undefined,
            props.legend ? _react2.default.createElement(_Legend2.default, { margin: margin, width: this.state.chartWidth, height: this.state.chartHeight, component: this.refs.child }) : undefined
          )
        ),
        props.settings ? _react2.default.createElement(_Settings2.default, { settings: props.settings, chart: this }) : undefined
      );
    }
  }]);

  return Chart;
}(_react2.default.Component);

Chart.defaultProps = {
  className: '',
  settings: false,
  data: {},
  title: '',
  xAxis: {
    type: 'x',
    orient: 'bottom',
    tickValues: false
  },
  yAxis: {
    type: 'y',
    orient: 'left'
  },
  legend: false,
  margin: { top: 15, right: 10, bottom: 20, left: 80 },
  width: 0,
  height: 250,
  rangePadding: 25,
  xScaleType: 'ordinal',
  yScaleType: 'linear',
  tipFunction: null
};

Chart.propTypes = {
  title: _react.PropTypes.string,
  xAxis: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.bool]),
  yAxis: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.bool]),
  legend: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.bool]),
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  loading: _react.PropTypes.bool,
  margin: _react.PropTypes.object,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  xScaleType: _react.PropTypes.string,
  xDomain: _react.PropTypes.array,
  yScaleType: _react.PropTypes.string,
  rangePadding: _react.PropTypes.number,
  data: _react.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),
  status: _react.PropTypes.string,
  tipFunction: _react.PropTypes.func
};

exports.default = Chart;