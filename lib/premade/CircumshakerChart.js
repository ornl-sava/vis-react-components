'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Chart = require('../Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Circumshaker = require('../Circumshaker');

var _Circumshaker2 = _interopRequireDefault(_Circumshaker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { spreadRelated } from '../util/react'


var CircumshakerChart = function (_React$Component) {
  _inherits(CircumshakerChart, _React$Component);

  function CircumshakerChart(props) {
    _classCallCheck(this, CircumshakerChart);

    var _this = _possibleConstructorReturn(this, (CircumshakerChart.__proto__ || Object.getPrototypeOf(CircumshakerChart)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    return _this;
  }

  _createClass(CircumshakerChart, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
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
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Chart2.default,
        {
          header: this.props.header,
          height: this.props.height,
          margin: this.props.margin,
          width: this.props.width,
          resizeHandler: this.props.resizeHandler
        },
        _react2.default.createElement(_Circumshaker2.default, {
          chartHeight: this.props.height,
          chartWidth: this.props.width,
          data: this.props.data,
          className: 'circumshaker',
          childAccessor: this.props.childAccessor,
          keyAccessor: this.props.keyAccessor,
          maxDepth: this.props.maxDepth,
          nodeMaxSize: this.props.nodeMaxSize,
          nodeMinSize: this.props.nodeMinSize,
          selectedColorScale: this.selectedColorScale,
          unselectedColorScale: this.unselectedColorScale,
          valueAccessor: this.props.valueAccessor,
          colorFunction: this.props.colorFunction,
          onEnter: this.onEnter,
          onLeave: this.onLeave,
          onClick: this.onClick })
      );
    }
  }]);

  return CircumshakerChart;
}(_react2.default.Component);

CircumshakerChart.defaultProps = {
  // Circumshaker defaults
  keyAccessor: 'key',
  valueAccessor: 'value',
  childAccessor: 'children',
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  data: {},
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  // Chart defaults
  resizeHandler: function resizeHandler() {},
  header: function header() {
    return [];
  },
  margin: { top: 0, right: 10, bottom: 20, left: 80 },
  width: 0,
  height: 250

};

CircumshakerChart.propTypes = {
  // Circumshaker props
  keyAccessor: _propTypes2.default.string,
  valueAccessor: _propTypes2.default.string,
  childAccessor: _propTypes2.default.string,
  nodeMinSize: _propTypes2.default.number,
  nodeMaxSize: _propTypes2.default.number,
  maxDepth: _propTypes2.default.number,

  data: _propTypes2.default.object,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  colorFunction: _propTypes2.default.func,
  // Chart Props
  resizeHandler: _propTypes2.default.func,
  header: _propTypes2.default.func,
  margin: _propTypes2.default.object,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  tipFunction: _propTypes2.default.func
};

exports.default = CircumshakerChart;