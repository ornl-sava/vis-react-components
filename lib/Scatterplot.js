'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scatterplot = function (_React$Component) {
  _inherits(Scatterplot, _React$Component);

  function Scatterplot(props) {
    _classCallCheck(this, Scatterplot);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scatterplot).call(this, props));

    _this.xDomain = [];
    _this.yDomain = [];

    _this.onClick = _this.onClick.bind(_this);
    _this.onMouseEnter = _this.onMouseEnter.bind(_this);
    _this.onMouseLeave = _this.onMouseLeave.bind(_this);
    _this.renderLoadAnimation = _this.renderLoadAnimation.bind(_this);
    _this.renderScatterplot = _this.renderScatterplot.bind(_this);

    _this.updateDomain(props, _this.state);
    return _this;
  }

  _createClass(Scatterplot, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateDomain(nextProps, this.state);
    }
  }, {
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      if (props.data.length > 0) {
        var xDomain = props.xDomain;
        if (xDomain.length === 0) {
          if (/ordinal/.test(props.xScaleType)) {
            xDomain = props.data.map(function (d) {
              return d[props.xField];
            });
          } else {
            xDomain = _d2.default.extent(props.data, function (d) {
              return d[props.xField];
            });
          }
        }

        var yDomain = props.yDomain;
        if (yDomain.length === 0) {
          if (/ordinal/.test(props.yScaleType)) {
            yDomain = props.data.map(function (d) {
              return d[props.yField];
            });
          } else {
            yDomain = _d2.default.extent(props.data, function (d) {
              return d[props.yField];
            });
          }
        }

        this.props.xScale.domain(xDomain);
        this.props.yScale.domain(yDomain);

        this.xDomain = xDomain;
        this.yDomain = yDomain;
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      this.props.onClick(event);
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(event) {
      var node = event.target;
      this.props.onEnter(this.tooltipData(node), node);
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(event) {
      var node = event.target;
      this.props.onLeave(this.tooltipData(node), node);
    }
  }, {
    key: 'tooltipData',
    value: function tooltipData(node) {
      var key = node.getAttribute('data-key');
      var value = node.getAttribute('data-value');
      return {
        key: key,
        value: value
      };
    }
  }, {
    key: 'renderScatterplot',
    value: function renderScatterplot() {
      var _this2 = this;

      var props = this.props;
      return _react2.default.createElement(
        'g',
        { className: 'scatterplot' },
        this.props.data.map(function (d, i) {
          var circleProps = {
            'data-key': d[props.xField],
            'data-value': d[props.yField],
            'r': props.radius,
            'cx': props.xScale(d[props.xField]),
            'cy': props.yScale(d[props.yField]),
            'onMouseEnter': _this2.onMouseEnter,
            'onMouseLeave': _this2.onMouseLeave,
            'onClick': _this2.onClick
          };
          return _react2.default.createElement('circle', _extends({ key: i }, circleProps));
        })
      );
    }
  }, {
    key: 'renderLoadAnimation',
    value: function renderLoadAnimation() {
      var _props = this.props;
      var chartWidth = _props.chartWidth;
      var chartHeight = _props.chartHeight;

      var props = _objectWithoutProperties(_props, ['chartWidth', 'chartHeight']);

      var xPos = Math.floor(chartWidth / 2);
      var yPos = Math.floor(chartHeight / 2);
      var messageText = 'Loading data...';
      if (!props.loading) {
        if (props.status === 'Failed to fetch') {
          messageText = 'Can\'t connect to API URL';
        } else if (props.status !== 'OK') {
          messageText = 'Error retrieving data: ' + props.status;
        } else {
          messageText = 'No data returned!';
        }
      }
      return _react2.default.createElement(
        'g',
        { className: 'loading-message' },
        _react2.default.createElement(
          'text',
          { x: xPos, y: yPos },
          messageText
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var renderEl = null;
      renderEl = this.renderLoadAnimation(this.props);
      if (this.props.data.length > 0 && this.props.chartWidth !== 0) {
        renderEl = this.renderScatterplot(this.props);
      }
      return renderEl;
    }
  }]);

  return Scatterplot;
}(_react2.default.Component);

Scatterplot.defaultProps = {
  chartHeight: 0,
  chartWidth: 0,
  xField: 'x',
  yField: 'y',
  xDomain: [],
  yDomain: [],
  radius: 5,
  data: [],
  loading: false,
  status: '',
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Scatterplot.propTypes = {
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  radius: _react.PropTypes.number,
  xDomain: _react.PropTypes.array,
  yDomain: _react.PropTypes.array,
  xField: _react.PropTypes.string,
  yField: _react.PropTypes.string,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  data: _react.PropTypes.array,
  loading: _react.PropTypes.bool,
  status: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func
};

exports.default = Scatterplot;