"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Chart = _interopRequireDefault(require("../Chart"));

var _Tooltip = _interopRequireDefault(require("../Tooltip"));

var _Circumshaker = _interopRequireDefault(require("../Circumshaker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CircumshakerChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CircumshakerChart, _React$Component);

  function CircumshakerChart(props) {
    var _this;

    _classCallCheck(this, CircumshakerChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CircumshakerChart).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.tip = props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    return _this;
  }

  _createClass(CircumshakerChart, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: "onClick",
    value: function onClick(event, data) {
      this.props.onClick(event, data);
    }
  }, {
    key: "onEnter",
    value: function onEnter(event, data) {
      if (data && this.tip) {
        this.tip.show(event, data);
      }

      this.props.onEnter(event, data);
    }
  }, {
    key: "onLeave",
    value: function onLeave(event, data) {
      if (data && this.tip) {
        this.tip.hide(event, data);
      }

      this.props.onLeave(event, data);
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(_Chart["default"], {
        header: this.props.header,
        height: this.props.height,
        margin: this.props.margin,
        width: this.props.width,
        resizeHandler: this.props.resizeHandler
      }, _react["default"].createElement(_Circumshaker["default"], {
        chartHeight: this.props.height,
        chartWidth: this.props.width,
        data: this.props.data,
        className: "circumshaker",
        childAccessor: this.props.childAccessor,
        keyAccessor: this.props.keyAccessor,
        maxDepth: this.props.maxDepth,
        forcedSeparation: this.props.forcedSeparation,
        nodeMaxSize: this.props.nodeMaxSize,
        nodeMinSize: this.props.nodeMinSize,
        selectedColorScale: this.selectedColorScale,
        unselectedColorScale: this.unselectedColorScale,
        valueAccessor: this.props.valueAccessor,
        colorFunction: this.props.colorFunction,
        onEnter: this.onEnter,
        onLeave: this.onLeave,
        onClick: this.onClick
      }));
    }
  }]);

  return CircumshakerChart;
}(_react["default"].Component);

CircumshakerChart.defaultProps = {
  // Circumshaker defaults
  keyAccessor: 'key',
  valueAccessor: 'value',
  childAccessor: 'children',
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  forcedSeparation: 10,
  data: {},
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  // Chart defaults
  resizeHandler: function resizeHandler() {},
  header: function header() {
    return [];
  },
  margin: {
    top: 0,
    right: 10,
    bottom: 20,
    left: 80
  },
  width: 0,
  height: 250
};
CircumshakerChart.propTypes = {
  // Circumshaker props
  keyAccessor: _propTypes["default"].string,
  valueAccessor: _propTypes["default"].string,
  childAccessor: _propTypes["default"].string,
  nodeMinSize: _propTypes["default"].number,
  nodeMaxSize: _propTypes["default"].number,
  maxDepth: _propTypes["default"].number,
  forcedSeparation: _propTypes["default"].number,
  data: _propTypes["default"].object,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  colorFunction: _propTypes["default"].func,
  // Chart Props
  resizeHandler: _propTypes["default"].func,
  header: _propTypes["default"].func,
  margin: _propTypes["default"].object,
  width: _propTypes["default"].number,
  height: _propTypes["default"].number,
  tipFunction: _propTypes["default"].func
};
var _default = CircumshakerChart;
exports["default"] = _default;