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

var _d = require('d3');

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Heatmap = function (_React$Component) {
  _inherits(Heatmap, _React$Component);

  function Heatmap(props) {
    _classCallCheck(this, Heatmap);

    var _this = _possibleConstructorReturn(this, (Heatmap.__proto__ || Object.getPrototypeOf(Heatmap)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    return _this;
  }

  _createClass(Heatmap, [{
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

      var props = this.props;
      return _react2.default.createElement(
        _reactTransitionGroup.TransitionGroup,
        { component: 'g', className: props.className },
        props.data.map(function (d, i) {
          var height = i === 0 ? props.chartHeight : props.yScale(props.data[i - 1][props.yAccessor.key]);
          height -= props.yScale(d[props.yAccessor.key]);
          return d.bins.map(function (e, j) {
            var width = j + 1 < d.bins.length ? props.xScale(d.bins[j + 1][props.xAccessor.key]) : props.chartWidth;
            width -= props.xScale(e[props.xAccessor.key]);
            return _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
              key: i + '-' + j,
              data: e,
              index: i + '-' + j,
              x: props.xScale(e[props.xAccessor.key]),
              y: props.yScale(d[props.yAccessor.key]),
              width: width,
              height: height,
              fill: props.colorScale(e[props.xAccessor.value]),
              onEnter: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attrTween('fill', function () {
                    return (0, _d.interpolate)(_this2.props.colorScale.range()[0], props.fill);
                  });
                  return transition;
                }
              },
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
                  return transition;
                }
              },
              onMouseEnter: _this2.onEnter,
              onMouseLeave: _this2.onLeave,
              onClick: _this2.onClick });
          });
        })
      );
    }
  }]);

  return Heatmap;
}(_react2.default.Component);

Heatmap.defaultProps = {
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}

  // xScale - tested to work with linear, log, pow, time, and ordinal band scales
  // yScale - tested to work with linear, log, pow, time, and ordinal band scales
};Heatmap.propTypes = {
  colorScale: _propTypes2.default.any,
  xAccessor: _propTypes2.default.object,
  yAccessor: _propTypes2.default.object,
  chartHeight: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  className: _propTypes2.default.string,
  data: _propTypes2.default.array,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  xScale: _propTypes2.default.any,
  yScale: _propTypes2.default.any
};

exports.default = Heatmap;