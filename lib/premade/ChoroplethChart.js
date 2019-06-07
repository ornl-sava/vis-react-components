"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("d3");

var _d2 = require("../util/d3");

var _react2 = require("../util/react");

var _Chart = _interopRequireDefault(require("../Chart"));

var _Tooltip = _interopRequireDefault(require("../Tooltip"));

var _Choropleth = _interopRequireDefault(require("../Choropleth"));

var _Legend = _interopRequireDefault(require("../Legend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ChoroplethChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ChoroplethChart, _React$Component);

  function ChoroplethChart(props) {
    var _this;

    _classCallCheck(this, ChoroplethChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChoroplethChart).call(this, props));
    _this.selectedColorScale = (0, _d2.setScale)('quantile');
    _this.unselectedColorScale = (0, _d2.setScale)('quantile');
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.onMove = _this.onMove.bind(_assertThisInitialized(_this));
    _this.updateColorScales = _this.updateColorScales.bind(_assertThisInitialized(_this));
    _this.tip = props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').useMouseCoordinates(true).offset([-12, 0]).html(props.tipFunction) : props.tipFunction;

    _this.updateColorScales(props, _this.state);

    return _this;
  }

  _createClass(ChoroplethChart, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updateColorScales(nextProps, this.state);
    }
  }, {
    key: "updateColorScales",
    value: function updateColorScales(props, state) {
      // Generate scale to determine class for coloring
      var tempSelectedColorScale = (0, _d2.setScale)('linear').domain([0, props.numColorCat]).range([props.selectedMinColor, props.selectedMaxColor]).interpolate(_d.interpolateHcl);
      var tempUnselectedColorScale = (0, _d2.setScale)('linear').domain([0, props.numColorCat]).range([props.unselectedMinColor, props.unselectedMaxColor]).interpolate(_d.interpolateHcl);
      var colorDomain = [0];
      props.data.forEach(function (d) {
        var datum = d[props.valueField];
        if (datum > 0) colorDomain.push(datum);
      });
      var selectedColorRange = [];
      var unselectedColorRange = [];
      (0, _d.range)(props.numColorCat).map(function (i) {
        selectedColorRange.push(tempSelectedColorScale(i));
        unselectedColorRange.push(tempUnselectedColorScale(i));
      });
      this.selectedColorScale.domain(colorDomain).range(selectedColorRange);
      this.unselectedColorScale.domain(colorDomain).range(unselectedColorRange);
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
    key: "onMove",
    value: function onMove(event, data) {
      if (data && this.tip) {
        this.tip.show(event, data);
      }

      this.props.onEnter(event, data);
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return _react["default"].createElement(_Chart["default"], _extends({
        ref: "chart"
      }, (0, _react2.spreadRelated)(_Chart["default"], props)), _react["default"].createElement(_Choropleth["default"], _extends({
        className: "circumshaker"
      }, (0, _react2.spreadRelated)(_Choropleth["default"], props), {
        onEnter: this.onEnter,
        onLeave: this.onLeave,
        onClick: this.onClick,
        onMove: this.onMove,
        unselectedColorScale: this.unselectedColorScale,
        selectedColorScale: this.selectedColorScale
      })), _react["default"].createElement(_Legend["default"], {
        colorScale: this.selectedColorScale
      }));
    }
  }]);

  return ChoroplethChart;
}(_react["default"].Component);

ChoroplethChart.defaultProps = _objectSpread({
  // Premade default
  data: [],
  selectedMinColor: '#eff3ff',
  selectedMaxColor: '#2171b5',
  unselectedMinColor: '#f7f7f7',
  unselectedMaxColor: '#636363',
  numColorCat: 20
}, _Chart["default"].defaultProps, _Choropleth["default"].defaultProps);
ChoroplethChart.propTypes = _objectSpread({
  selectedMinColor: _propTypes["default"].string,
  selectedMaxColor: _propTypes["default"].string,
  unselectedMinColor: _propTypes["default"].string,
  unselectedMaxColor: _propTypes["default"].string,
  numColorCat: _propTypes["default"].number
}, _Choropleth["default"].propTypes, _Chart["default"].propTypes, {
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  tipFunction: _propTypes["default"].func
});
var _default = ChoroplethChart;
exports["default"] = _default;