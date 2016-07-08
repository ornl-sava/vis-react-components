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

var d3 = _interopRequireWildcard(_d);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Axis = require('./Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
        this.tip.show(svgElement, tooltipData);
      }
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(tooltipData, svgElement) {
      if (tooltipData && this.tip) {
        this.tip.hide(svgElement, tooltipData);
      }
    }
  }]);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, props));

    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    _this.setScale = _this.setScale.bind(_this);
    _this.state = {
      chartWidth: props.width,
      chartHeight: props.width
    };

    _this.xScale = _this.setScale(_this.props.xScaleType, [0, _this.state.chartWidth]);
    _this.yScale = _this.setScale(_this.props.yScaleType, [_this.state.chartHeight, 0]);
    return _this;
  }

  _createClass(Chart, [{
    key: 'setScale',
    value: function setScale(scaleType, range) {
      // Setup xScale
      var scale = null;
      if (/ordinal/.test(scaleType)) {
        // scale = d3.scaleOrdinal()
        if (scaleType === 'ordinalBand') {
          // scale.rangeRoundBands(range)
          scale = d3.scaleBand();
        } else {
          scale = d3.scalePoint();
        }
      } else if (scaleType === 'temporal') {
        scale = d3.scaleTime();
      } else if (scaleType === 'log') {
        scale = d3.scaleLog();
      } else if (scaleType === 'power') {
        scale = d3.scalePow().exponent(0.5);
      } else {
        scaleType = 'linear';
        scale = d3.scaleLinear();
      }
      scale.type = scaleType;
      return scale;
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var newData = nextProps.data.length !== this.props.data.length;
      var loading = nextProps.loading !== this.props.loading;
      var newSettings = nextProps.settings !== this.props.settings;
      var newSortBy = nextProps.sortBy !== this.props.sortBy;
      var newSortOrder = nextProps.sortOrder !== this.props.sortOrder;
      var newSortTypes = nextProps.sortTypes !== this.props.sortTypes;
      var newXScale = nextProps.xScaleType !== this.props.xScaleType;
      var newYScale = nextProps.yScaleType !== this.props.yScaleType;
      if (newXScale) {
        this.xScale = this.setScale(nextProps.xScaleType, [0, nextState.chartWidth]);
        this.resizeChart();
      }
      if (newYScale) {
        this.yScale = this.setScale(nextProps.yScaleType, [nextState.chartHeight, 0]);
        this.resizeChart();
      }
      return newData || loading || newYScale || newSettings || newSortBy || newSortOrder || newSortTypes;
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
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._handleResize, false);
      this.tip.destroy();
    }
  }, {
    key: 'resizeChart',
    value: function resizeChart() {
      var _this2 = this;

      var props = this.props;
      var rootRect = this.refs.rootElement.getBoundingClientRect();
      var svg = d3.select(this.refs.svgRoot);
      // let container = d3.select(this.refs.container)
      var chartWidth = props.width === 0 ? rootRect.width - props.margin.left - props.margin.right : Math.min(rootRect.width - props.margin.left - props.margin.right, props.width - props.margin.left - props.margin.right);
      var chartHeight = props.height - props.margin.top - props.margin.bottom;
      svg.attr('width', props.width === 0 ? rootRect.width : props.width).attr('height', props.height);

      // container.select('.reset')
      //   .attr('x', chartWidth - 40)
      //   .attr('y', -props.margin.top + 1)
      this.yScale.range([chartHeight, 0]);
      this.xScale.range([0, chartWidth]);

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
        yScale: this.yScale,
        sortBy: this.props.sortBy,
        sortOrder: this.props.sortOrder,
        sortTypes: this.props.sortTypes,
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
            'defs',
            null,
            _react2.default.createElement(
              'clipPath',
              { id: 'clip' },
              _react2.default.createElement('rect', { width: this.state.chartWidth, height: this.state.chartHeight })
            )
          ),
          _react2.default.createElement(
            'g',
            { ref: 'container', className: 'container', transform: 'translate(' + left + ',' + top + ')' },
            _react2.default.createElement(
              'g',
              { className: 'component', clipPath: props.clipPath ? 'url(#clip)' : '' },
              child
            ),
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
            props.legend && props.data.length > 0 ? _react2.default.createElement(_Legend2.default, { margin: margin, scaleAccessor: props.scaleAccessor, width: this.state.chartWidth, height: this.state.chartHeight, component: this.refs.child }) : undefined
          )
        ),
        props.settings ? _react2.default.createElement(_Settings2.default, { settings: props.settings, chart: this }) : undefined
      );
    }
  }]);

  return Chart;
}(_react2.default.Component);

Chart.defaultProps = {
  sortBy: null,
  sortOrder: null,
  sortTypes: [],
  className: '',
  settings: false,
  clipPath: false,
  data: {},
  title: '',
  xAxis: {
    type: 'x',
    orient: 'bottom'
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
  xScaleType: 'ordinalBand',
  yScaleType: 'linear',
  tipFunction: null
};

Chart.propTypes = {
  title: _react.PropTypes.string,
  clipPath: _react.PropTypes.bool,
  scaleAccessor: _react.PropTypes.string,
  sortBy: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
  sortOrder: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
  sortTypes: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.bool]),
  settings: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.bool]),
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