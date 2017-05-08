'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SummaryTimeline = function (_React$Component) {
  _inherits(SummaryTimeline, _React$Component);

  function SummaryTimeline() {
    _classCallCheck(this, SummaryTimeline);

    return _possibleConstructorReturn(this, (SummaryTimeline.__proto__ || Object.getPrototypeOf(SummaryTimeline)).apply(this, arguments));
  }

  _createClass(SummaryTimeline, [{
    key: 'render',
    value: function render() {
      var data = this.props.data;

      var width = this.props.chartWidth ? this.props.chartWidth : this.props.width;
      var height = this.props.chartHeight ? this.props.chartHeight : this.props.height;

      var x = d3.scaleTime().domain(d3.extent(data, function (d) {
        return d.date;
      })).rangeRound([0, width]);

      var yMin = d3.min(data, function (d) {
        return d.min;
      });
      var yMax = d3.max(data, function (d) {
        return d.max;
      });
      var y = d3.scaleLinear().domain([yMin, yMax]).rangeRound([height, 0]);

      var meanLine = d3.line().curve(d3.curveStepAfter).x(function (d) {
        return x(d.date);
      }).y(function (d) {
        return y(d.mean);
      })(data);
      // var stdevMinLine = d3.line()
      //   .x((d) => { return x(d.date) })
      //   .y((d) => { return y(d.stdevMin) })(data)
      // var stdevMaxLine = d3.line()
      //   .x((d) => { return x(d.date) })
      //   .y((d) => { return y(d.stdevMax) })(data)
      // var maxLine = d3.line()
      //   .x((d) => { return x(d.date) })
      //   .y((d) => { return y(d.max) })(data)
      // var minLine = d3.line()
      //   .x((d) => { return x(d.date) })
      //   .y((d) => { return y(d.min) })(data)

      var stdevRangeArea = d3.area().curve(d3.curveStepAfter).x(function (d) {
        return x(d.date);
      }).y0(function (d) {
        return y(d.stdevMin);
      }).y1(function (d) {
        return y(d.stdevMax);
      })(data);
      var extentRangeArea = d3.area().curve(d3.curveStepAfter).x(function (d) {
        return x(d.date);
      }).y0(function (d) {
        return y(d.min);
      }).y1(function (d) {
        return y(d.max);
      })(data);

      var pathTransition = { func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d).attr('fill', props.fill);
          return transition;
        } };

      return _react2.default.createElement(
        _reactAddonsTransitionGroup2.default,
        { component: 'g' },
        _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
          key: 'extentRange',
          fill: '#c6dbef',
          d: extentRangeArea,
          onUpdate: pathTransition
        }),
        _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
          key: 'stdevRange',
          fill: '#9ecae1',
          d: stdevRangeArea,
          onUpdate: pathTransition
        }),
        _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
          key: 'mean',
          fill: 'none',
          stroke: 'black',
          strokeLinejoin: 'round',
          strokeLinecap: 'round',
          strokeWidth: 1.5,
          d: meanLine,
          onUpdate: pathTransition
        })
      );
    }
  }]);

  return SummaryTimeline;
}(_react2.default.Component);

SummaryTimeline.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  chartHeight: _react.PropTypes.number,
  data: _react.PropTypes.array
};

exports.default = SummaryTimeline;