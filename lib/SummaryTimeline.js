"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var d3 = _interopRequireWildcard(require("d3"));

var _d2 = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

var _BrushX = _interopRequireDefault(require("./BrushX"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SummaryTimeline =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SummaryTimeline, _React$Component);

  function SummaryTimeline(props) {
    var _this;

    _classCallCheck(this, SummaryTimeline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SummaryTimeline).call(this, props));

    if (props.brushed && props.brushID === 'default') {
      console.warn('SummaryTimeline is set to be brushed but no brushID is provided! The brushID should be set to the data-name of the underlying class object');
    }

    return _this;
  }

  _createClass(SummaryTimeline, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var data = this.props.data;

      if (this.props.showRange1Area) {
        var stdevRangeArea = d3.area().curve(d3.curveStepAfter).x(function (d) {
          return _this2.props.xScale(d.date);
        }).y0(function (d) {
          return _this2.props.yScale(d.innerRangeMin);
        }).y1(function (d) {
          return _this2.props.yScale(d.innerRangeMax);
        })(data);
      }

      if (this.props.showRange2Area) {
        var extentRangeArea = d3.area().curve(d3.curveStepAfter).x(function (d) {
          return _this2.props.xScale(d.date);
        }).y0(function (d) {
          return _this2.props.yScale(d.outerRangeMin);
        }).y1(function (d) {
          return _this2.props.yScale(d.outerRangeMax);
        })(data);
      }

      var pathTransition = {
        func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d).attr('fill', props.fill);
          return transition;
        }
      };

      var _this$props = this.props,
          keyFunction = _this$props.keyFunction,
          props = _objectWithoutProperties(_this$props, ["keyFunction"]);

      var interval = Math.abs(data[1].date - data[0].date);
      return _react["default"].createElement(_BrushX["default"], {
        brushID: props.brushID,
        hideBrushSelection: false,
        width: props.xScale.range()[1],
        height: props.yScale.range()[0],
        interval: interval,
        scale: props.xScale,
        onBrush: props.onBrush
      }, _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g"
      }, this.props.showRange2Area && _react["default"].createElement(_SVGComponent["default"], {
        Component: "path",
        key: "extentRange2",
        fill: this.props.range2FillColor,
        d: extentRangeArea,
        onUpdate: pathTransition
      }), this.props.showRange1Area && _react["default"].createElement(_SVGComponent["default"], {
        Component: "path",
        key: "extentRange1",
        fill: this.props.range1FillColor,
        d: stdevRangeArea,
        onUpdate: pathTransition
      }), this.props.data.map(function (d, i) {
        var opacityValue = 1.0;

        if (props.useOpacityScale && d.opacityValue !== undefined) {
          opacityValue = props.opacityScale(d.opacityValue);
        }

        return _react["default"].createElement(_SVGComponent["default"], {
          Component: "circle",
          key: keyFunction(d, i),
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
          stroke: "none"
        });
      })));
    }
  }]);

  return SummaryTimeline;
}(_react["default"].Component);

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
  useOpacityScale: _propTypes["default"].bool,
  showRange1Area: _propTypes["default"].bool,
  showRange2Area: _propTypes["default"].bool,
  bgColor: _propTypes["default"].string,
  range1FillColor: _propTypes["default"].string,
  range2FillColor: _propTypes["default"].string,
  meanCircleRadius: _propTypes["default"].number,
  meanFillColor: _propTypes["default"].string,
  width: _propTypes["default"].number,
  height: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  chartHeight: _propTypes["default"].number,
  data: _propTypes["default"].array,
  keyFunction: _propTypes["default"].func,
  opacityScale: _propTypes["default"].any,
  xScale: _propTypes["default"].any,
  yScale: _propTypes["default"].any,
  brushed: _propTypes["default"].bool,
  brushID: _propTypes["default"].string,
  onBrush: _propTypes["default"].func
};
var _default = SummaryTimeline;
exports["default"] = _default;