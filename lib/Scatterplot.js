'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTransitionGroup = require('react-transition-group');

var _d = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scatterplot = function (_React$Component) {
  _inherits(Scatterplot, _React$Component);

  function Scatterplot(props) {
    _classCallCheck(this, Scatterplot);

    var _this = _possibleConstructorReturn(this, (Scatterplot.__proto__ || Object.getPrototypeOf(Scatterplot)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    return _this;
  }

  _createClass(Scatterplot, [{
    key: 'onClick',
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event, data, index) {
      this.props.onEnter(event, data, index);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event, data, index) {
      this.props.onLeave(event, data, index);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          keyFunction = _props.keyFunction,
          props = _objectWithoutProperties(_props, ['keyFunction']);

      return _react2.default.createElement(
        _reactTransitionGroup.TransitionGroup,
        { component: 'g', className: props.className },
        this.props.data.map(function (d, i) {
          return _react2.default.createElement(_SVGComponent2.default, { Component: 'circle', key: keyFunction(d, i),
            data: d,
            index: i,
            onUpdate: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d.setEase)('linear')).attr('r', props.r).attr('cx', props.cx).attr('cy', props.cy);
                return transition;
              }
            },
            r: props.radius,
            cx: props.xScale(d[props.xAccessor]),
            cy: props.yScale(d[props.yAccessor]),
            fill: props.colorScale(d[props.colorAccessor]),
            onMouseEnter: _this2.onEnter,
            onMouseLeave: _this2.onLeave,
            onClick: _this2.onClick });
        })
      );
    }
  }]);

  return Scatterplot;
}(_react2.default.Component);

Scatterplot.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  colorAccessor: 'y',
  colorScale: function colorScale() {
    return '';
  },
  keyFunction: function keyFunction(d, i) {
    return i;
  },
  radius: 5,
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}

  // xScale - tested to work with linear, log, pow, time, and ordinal point scales
  // yScale - tested to work with linear, log, pow, time, and ordinal point scales
  // keyFunction - returning unique data based ids is required for animations to work in an expected manner
};Scatterplot.propTypes = {
  chartHeight: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  className: _propTypes2.default.string,
  radius: _propTypes2.default.number,
  xAccessor: _propTypes2.default.string,
  yAccessor: _propTypes2.default.string,
  colorScale: _propTypes2.default.any,
  colorAccessor: _propTypes2.default.string,
  keyFunction: _propTypes2.default.func,
  xScale: _propTypes2.default.any,
  yScale: _propTypes2.default.any,
  data: _propTypes2.default.array,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func
};

exports.default = Scatterplot;