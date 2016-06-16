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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  _createClass(Chart, [{
    key: '_onEnter',
    value: function _onEnter(tooltipData, svgElement) {
      this.tip.show(tooltipData, svgElement);
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(tooltipData, svgElement) {
      this.tip.hide(tooltipData, svgElement);
    }
  }]);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, props));

    _this.yScale = _d2.default.scale.linear();
    if (props.xScaleType === 'ordinal') {
      _this.xScale = _d2.default.scale.ordinal();
      _this.xScale.rangeRoundBands([0, props.width]);
    } else if (props.xScaleType === 'temporal') {
      _this.xScale = _d2.default.time.scale.utc();
    } else {
      _this.xScale = _d2.default.scale.linear();
    }
    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.tip = (0, _d3Tip2.default)().attr('class', 'd3-tip').html(props.tipFunction);
    _this.state = { chartWidth: 0, chartHeight: 0 };
    return _this;
  }

  _createClass(Chart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading;
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
    }
  }, {
    key: 'resizeChart',
    value: function resizeChart() {
      var props = this.props;
      var rootRect = this.refs.rootElement.getBoundingClientRect();
      var svg = _d2.default.select(this.refs.svgRoot);
      var container = _d2.default.select(this.refs.container);
      var chartWidth = Math.min(rootRect.width - props.margin.left - props.margin.right, props.width - props.margin.left - props.margin.right);
      var chartHeight = props.height - props.margin.top - props.margin.bottom;
      this.yScale.range([chartHeight, 0.00001]);

      svg.attr('width', props.width).attr('height', props.height);
      svg.call(this.tip);

      container.select('.reset').attr('x', chartWidth - 40).attr('y', -props.margin.top + 1);

      this.setState({ chartWidth: chartWidth, chartHeight: chartHeight });
      this.forceUpdate();
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
        onEnter: this.onEnter,
        onLeave: this.onLeave
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var left = props.margin.left;
      var top = props.margin.top;
      var child = this.renderChild();
      return _react2.default.createElement(
        'div',
        { ref: 'rootElement', className: props.className },
        _react2.default.createElement(
          'svg',
          { ref: 'svgRoot' },
          _react2.default.createElement(
            'g',
            { ref: 'container', className: 'container', transform: 'translate(' + left + ',' + top + ')' },
            child,
            _react2.default.createElement(
              'g',
              { className: 'axis' },
              _react2.default.createElement(
                'text',
                { y: -props.margin.top + 1, dy: '0.71em' },
                props.title.replace(/_/g, ' ')
              ),
              _react2.default.createElement(
                'text',
                { className: 'reset', y: -props.margin.top + 1, x: this.state.chartWidth - 20, dy: '0.71em' },
                'reset'
              )
            ),
            _react2.default.createElement(_Axis2.default, _extends({ className: 'y axis', type: 'y', orient: 'left', data: props.data, scale: this.yScale }, this.state)),
            _react2.default.createElement(_Axis2.default, _extends({ className: 'x axis', type: 'x', orient: 'bottom', data: props.data, scale: this.xScale }, this.state))
          )
        )
      );
    }
  }]);

  return Chart;
}(_react2.default.Component);

Chart.defaultProps = {
  data: [],
  title: '',
  margin: { top: 15, right: 10, bottom: 20, left: 80 },
  width: 400,
  height: 250,
  rangePadding: 25,
  xScaleType: 'ordinal',
  yScaleType: 'linear',
  tipFunction: function tipFunction(d) {
    console.log(d);
  }
};

Chart.propTypes = {
  title: _react.PropTypes.string,
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
  data: _react.PropTypes.array,
  status: _react.PropTypes.string,
  tipFunction: _react.PropTypes.func
};

exports.default = Chart;