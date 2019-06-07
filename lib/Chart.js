"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _d = require("d3");

var _Header = _interopRequireDefault(require("./Header"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Chart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    var _this;

    _classCallCheck(this, Chart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Chart).call(this, props));
    _this.chartWidth = props.width;
    _this.chartHeight = props.height;

    if (props.addResizeListener) {
      props.addResizeListener(_this.resizeChart.bind(_assertThisInitialized(_this)));
    }

    _this.rootElement = _react["default"].createRef();
    return _this;
  }

  _createClass(Chart, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._handleResize = (0, _lodash["default"])(this.resizeChart.bind(this), 50);
      window.addEventListener('resize', this._handleResize, false);

      this._handleResize(); // Lets call take place after component has mounted

    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._handleResize, false);
    }
  }, {
    key: "resizeChart",
    value: function resizeChart() {
      if (!this.rootElement.current) return;
      var props = this.props;
      var rootRect = this.rootElement.current.getBoundingClientRect();
      var svg = (0, _d.select)(this.refs.svgRoot);
      this.chartWidth = props.width === 0 ? rootRect.width - props.margin.left - props.margin.right : Math.min(rootRect.width - props.margin.left - props.margin.right, props.width - props.margin.left - props.margin.right);
      this.chartHeight = props.height - props.margin.top - props.margin.bottom;
      svg.attr('width', props.width === 0 ? rootRect.width : props.width).attr('height', props.height);
      if (props.resizeHandler) props.resizeHandler();
      this.forceUpdate();
    }
  }, {
    key: "renderChildren",
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
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height,
          props = _objectWithoutProperties(_this$props, ["width", "height"]);

      var left = props.margin.left;
      var top = props.margin.top;
      return _react["default"].createElement("div", {
        ref: this.rootElement,
        className: props.className,
        style: {
          position: 'relative'
        },
        "data-name": "chart-root"
      }, this.chartWidth === 0 || this.chartHeight === 0 ? null : _react["default"].createElement(_Header["default"], {
        chart: this,
        components: this.props.header
      }), _react["default"].createElement("svg", {
        ref: "svgRoot",
        width: width,
        height: height
      }, _react["default"].createElement("g", {
        className: "vis-component",
        transform: 'translate(' + left + ',' + top + ')'
      }, this.chartWidth === 0 || this.chartHeight === 0 ? null : this.renderChildren())));
    }
  }]);

  return Chart;
}(_react["default"].Component);

Chart.defaultProps = {
  margin: {
    top: 0,
    right: 10,
    bottom: 20,
    left: 80
  },
  width: 0,
  height: 250
};
Chart.propTypes = {
  resizeHandler: _propTypes["default"].func,
  addResizeListener: _propTypes["default"].func,
  header: _propTypes["default"].func,
  children: _propTypes["default"].any,
  className: _propTypes["default"].string,
  margin: _propTypes["default"].object,
  width: _propTypes["default"].number,
  height: _propTypes["default"].number
};
var _default = Chart;
exports["default"] = _default;