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

var d3 = _interopRequireWildcard(_d);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

var _BrushX = require('./BrushX');

var _BrushX2 = _interopRequireDefault(_BrushX);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SummaryTimeline = function (_React$Component) {
  _inherits(SummaryTimeline, _React$Component);

  function SummaryTimeline(props) {
    _classCallCheck(this, SummaryTimeline);

    var _this = _possibleConstructorReturn(this, (SummaryTimeline.__proto__ || Object.getPrototypeOf(SummaryTimeline)).call(this, props));

    if (props.brushed && props.brushID === 'default') {
      console.warn('SummaryTimeline is set to be brushed but no brushID is provided! The brushID should be set to the data-name of the underlying class object');
    }
    return _this;
  }

  _createClass(SummaryTimeline, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var data = this.props.data;

      // let width = this.props.chartWidth ? this.props.chartWidth : this.props.width
      // let height = this.props.chartHeight ? this.props.chartHeight : this.props.height

      // var x = d3.scaleTime()
      //   .domain(d3.extent(data, (d) => { return d.date }))
      //   .rangeRound([0, width])

      // var yMin = d3.min(data, (d) => { return d.min })
      // var yMin = d3.min(data, (d) => { return Math.min(d.innerRangeMin, d.outerRangeMin) })
      // // var yMax = d3.max(data, (d) => { return d.max })
      // var yMax = d3.max(data, (d) => { return Math.max(d.innerRangeMax, d.outerRangeMax) })
      // var y = d3.scaleLinear()
      //   .domain([yMin, yMax])
      //   .rangeRound([height, 0])

      // console.log('SummaryTimeline.render()')
      // console.log('opacityScale: ' + this.props.opacityScale)
      // var avgMin = d3.min(data, (d) => { return d.avg })
      // var avgMax = d3.max(data, (d) => { return d.avg })
      //
      // var opacityScale = d3.scaleLinear()
      //   .domain([avgMin, avgMax])
      //   .range([0.20, 0.90])

      // console.log('bgColor: ' + this.props.bgColor)
      // var meanLine = d3.line()
      //   .curve(d3.curveStepAfter)
      //   .x((d) => { return x(d.date) })
      //   .y((d) => { return y(d.avg) })(data)
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

      if (this.props.showRange1Area) {
        var stdevRangeArea = d3.area().curve(d3.curveStepAfter)
        // .x((d) => { return x(d.date) })
        .x(function (d) {
          return _this2.props.xScale(d.date);
        }).y0(function (d) {
          return _this2.props.yScale(d.innerRangeMin);
        }).y1(function (d) {
          return _this2.props.yScale(d.innerRangeMax);
        })(data);
      }
      if (this.props.showRange2Area) {
        var extentRangeArea = d3.area().curve(d3.curveStepAfter)
        // .x((d) => { return x(d.date) })
        .x(function (d) {
          return _this2.props.xScale(d.date);
        }).y0(function (d) {
          return _this2.props.yScale(d.outerRangeMin);
        }).y1(function (d) {
          return _this2.props.yScale(d.outerRangeMax);
        })(data);
      }
      var pathTransition = { func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d).attr('fill', props.fill);
          return transition;
        } };

      var _props = this.props,
          keyFunction = _props.keyFunction,
          props = _objectWithoutProperties(_props, ['keyFunction']);

      var interval = Math.abs(data[1].date - data[0].date);

      return _react2.default.createElement(
        _BrushX2.default,
        {
          brushID: props.brushID,
          hideBrushSelection: false,
          width: props.xScale.range()[1],
          height: props.yScale.range()[0],
          interval: interval,
          scale: props.xScale,
          onBrush: props.onBrush },
        _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          { component: 'g' },
          this.props.showRange2Area && _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
            key: 'extentRange2',
            fill: this.props.range2FillColor,
            d: extentRangeArea,
            onUpdate: pathTransition
          }),
          this.props.showRange1Area && _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
            key: 'extentRange1',
            fill: this.props.range1FillColor,
            d: stdevRangeArea,
            onUpdate: pathTransition
          }),
          this.props.data.map(function (d, i) {
            var opacityValue = 1.0;
            if (props.useOpacityScale && d.opacityValue !== undefined) {
              opacityValue = props.opacityScale(d.opacityValue);
            }
            return _react2.default.createElement(_SVGComponent2.default, { Component: 'circle', key: keyFunction(d, i),
              data: d,
              index: i,
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('r', props.r).attr('cx', props.cx).attr('cy', props.cy).style('fill-opacity', props.fillOpacity);
                  return transition;
                }
              },
              r: props.meanCircleRadius,
              cx: props.xScale(d.date),
              cy: props.yScale(d.avg),
              fillOpacity: opacityValue,
              fill: _this2.props.meanFillColor,
              stroke: 'none' });
          })
        )
      );
    }
  }]);

  return SummaryTimeline;
}(_react2.default.Component);

// <SVGComponent Component='path'
//   key='mean'
//   fill='none'
//   stroke='darkgray'
//   strokeLinejoin='round'
//   strokeLinecap='round'
//   strokeWidth={1.5}
//   d={meanLine}
//   onUpdate={pathTransition}
// />

SummaryTimeline.defaultProps = {
  keyFunction: function keyFunction(d, i) {
    return i;
  },
  range1FillColor: '#9ecae1',
  range2FillColor: '#c6dbef',
  meanFillColor: 'black',
  meanCircleRadius: 1.0,
  useOpacityScale: true,
  showRange1Area: true,
  showRange2Area: true,
  brushID: 'default',
  onBrush: function onBrush() {}
};

SummaryTimeline.propTypes = {
  useOpacityScale: _propTypes2.default.bool,
  showRange1Area: _propTypes2.default.bool,
  showRange2Area: _propTypes2.default.bool,
  bgColor: _propTypes2.default.string,
  range1FillColor: _propTypes2.default.string,
  range2FillColor: _propTypes2.default.string,
  meanCircleRadius: _propTypes2.default.number,
  meanFillColor: _propTypes2.default.string,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  chartHeight: _propTypes2.default.number,
  data: _propTypes2.default.array,
  keyFunction: _propTypes2.default.func,
  opacityScale: _propTypes2.default.any,
  xScale: _propTypes2.default.any,
  yScale: _propTypes2.default.any,
  brushed: _propTypes2.default.bool,
  brushID: _propTypes2.default.string,
  onBrush: _propTypes2.default.func
};

exports.default = SummaryTimeline;