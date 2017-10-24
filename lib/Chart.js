'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _d = require('d3');

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));

    _this.chartWidth = props.width;
    _this.chartHeight = props.height;
    return _this;
  }

  _createClass(Chart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._handleResize = (0, _lodash2.default)(this.resizeChart.bind(this), 50);
      window.addEventListener('resize', this._handleResize, false);
      this._handleResize(); // Lets call take place after component has mounted
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._handleResize, false);
    }
  }, {
    key: 'resizeChart',
    value: function resizeChart() {
      if (!this.refs.rootElement) return;
      var props = this.props;
      var rootRect = this.refs.rootElement.getBoundingClientRect();
      var svg = (0, _d.select)(this.refs.svgRoot);

      this.chartWidth = props.width === 0 ? rootRect.width - props.margin.left - props.margin.right : Math.min(rootRect.width - props.margin.left - props.margin.right, props.width - props.margin.left - props.margin.right);

      this.chartHeight = props.height - props.margin.top - props.margin.bottom;

      svg.attr('width', props.width === 0 ? rootRect.width : props.width).attr('height', props.height);

      if (props.resizeHandler) props.resizeHandler();
      this.forceUpdate();
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _this2 = this;

      return _react.Children.map(this.props.children, function (e, i) {
        return (0, _react.cloneElement)(e, {
          margin: _this2.props.margin,
          chartWidth: _this2.chartWidth,
          chartHeight: _this2.chartHeight
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          props = _objectWithoutProperties(_props, ['width', 'height']);

      var left = props.margin.left;
      var top = props.margin.top;
      return _react2.default.createElement(
        'div',
        { ref: 'rootElement', className: props.className, style: { position: 'relative' }, 'data-name': 'chart-root' },
        this.chartWidth === 0 || this.chartHeight === 0 ? null : _react2.default.createElement(_Header2.default, { chart: this, components: this.props.header }),
        _react2.default.createElement(
          'svg',
          { ref: 'svgRoot', width: width, height: height },
          _react2.default.createElement(
            'g',
            { className: 'vis-component', transform: 'translate(' + left + ',' + top + ')' },
            this.chartWidth === 0 || this.chartHeight === 0 ? null : this.renderChildren()
          )
        )
      );
    }
  }]);

  return Chart;
}(_react2.default.Component);

Chart.defaultProps = {
  margin: { top: 0, right: 10, bottom: 20, left: 80 },
  width: 0,
  height: 250
};

Chart.propTypes = {
  resizeHandler: _propTypes2.default.func,
  header: _propTypes2.default.func,
  children: _propTypes2.default.any,
  className: _propTypes2.default.string,
  margin: _propTypes2.default.object,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number
};

exports.default = Chart;