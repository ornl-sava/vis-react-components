'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = require('../util/d3');

var _react3 = require('../util/react');

var _Chart = require('../Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Choropleth = require('../Choropleth');

var _Choropleth2 = _interopRequireDefault(_Choropleth);

var _Legend = require('../Legend');

var _Legend2 = _interopRequireDefault(_Legend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChoroplethChart = function (_React$Component) {
  _inherits(ChoroplethChart, _React$Component);

  function ChoroplethChart(props) {
    _classCallCheck(this, ChoroplethChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChoroplethChart).call(this, props));

    _this.selectedColorScale = (0, _d2.setScale)('qunatile');
    _this.unselectedColorScale = (0, _d2.setScale)('qunatile');

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.onMove = _this.onMove.bind(_this);
    _this.onResize = _this.onResize.bind(_this);

    _this.updateColorScales = _this.updateColorScales.bind(_this);

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').useMouseCoordinates(true).offset([-12, 0]).html(props.tipFunction) : props.tipFunction;

    _this.updateColorScales(props, _this.state);
    return _this;
  }

  _createClass(ChoroplethChart, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.tip.destroy();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateColorScales(nextProps, this.state);
    }
  }, {
    key: 'updateColorScales',
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
    key: 'onMove',
    value: function onMove(event, data) {
      if (data && this.tip) {
        this.tip.show(event, data);
      }
      this.props.onEnter(event, data);
    }
  }, {
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        _Chart2.default,
        _extends({ ref: 'chart' }, (0, _react3.spreadRelated)(_Chart2.default, props), { resizeHandler: this.onResize }),
        _react2.default.createElement(_Choropleth2.default, _extends({ className: 'circumshaker' }, (0, _react3.spreadRelated)(_Choropleth2.default, props), {
          onEnter: this.onEnter, onLeave: this.onLeave, onClick: this.onClick, onMove: this.onMove,
          unselectedColorScale: this.unselectedColorScale, selectedColorScale: this.selectedColorScale })),
        _react2.default.createElement(_Legend2.default, { colorScale: this.selectedColorScale })
      );
    }
  }]);

  return ChoroplethChart;
}(_react2.default.Component);

ChoroplethChart.defaultProps = _extends({
  // Premade default
  data: []
}, _Chart2.default.defaultProps, _Choropleth2.default.defaultProps);

ChoroplethChart.propTypes = _extends({}, _Choropleth2.default.propTypes, _Chart2.default.propTypes, {
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tipFunction: _react.PropTypes.func
});

exports.default = ChoroplethChart;