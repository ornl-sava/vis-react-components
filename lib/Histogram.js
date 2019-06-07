"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var _Bar = _interopRequireDefault(require("./Bar"));

var _d = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

var _BrushX = _interopRequireDefault(require("./BrushX"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Copied from http://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
// Used that version to be concise
// need to test with jagged arrays
var transpose = function transpose(a) {
  return a[0].map(function (_, c) {
    return a.map(function (r) {
      return r[c];
    });
  });
};

var Histogram =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Histogram, _React$Component);

  function Histogram(props) {
    var _this;

    _classCallCheck(this, Histogram);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Histogram).call(this, props));
    _this.onMouseLeave = _this._onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onMouseEnter = _this._onMouseEnter.bind(_assertThisInitialized(_this)); // this.onMouseDown = this._onMouseDown.bind(this)

    if (props.brushed && props.brushID === 'default') {
      console.warn('Histogram is set to be be brushed, but no brushID is provided!');
      console.warn('brushID should be set to the data-name of the underlying bar');
    }

    _this.renderBars = _this.renderBars.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Histogram, [{
    key: "_onMouseLeave",
    value: function _onMouseLeave(event, data, index) {
      this.props.onLeave(event, {});
    }
  }, {
    key: "_onMouseEnter",
    value: function _onMouseEnter(event, data, index) {
      if (data) {
        this.props.onEnter(event, this.props.data);
      }
    } // _onMouseDown (event, data, index) {
    //   if (data) {
    //     // console.log('Bar :: mousedown')
    //     if (this.props.brushed) {
    //       let newEvent = new MouseEvent('mousedown', event)
    //       let target = select('.selection')
    //       let leftMargin = select('.overlay').node().getBoundingClientRect().left
    //       let selectionWidth = parseFloat(target.attr('width'))
    //       let min = parseFloat(target.attr('x')) + leftMargin
    //       let max = parseFloat(target.attr('x')) + selectionWidth + leftMargin
    //       // console.log('min: ' + min + ', max: ' + max)
    //       if (target.style('display') === 'none' ||
    //       event.pageX < min || event.pageX > max) {
    //         target = select('.overlay').node()
    //       } else {
    //         target = target.node()
    //       }
    //       target.dispatchEvent(newEvent)
    //     }
    //   }
    // }

  }, {
    key: "getOverlay",
    value: function getOverlay(barData) {
      var props = this.props;
      var overlayData = [];

      for (var i = 0; i < barData.length; i++) {
        var overlayObj = _extends({}, barData[i][0]);

        overlayObj.className = '_overlay';
        overlayObj.brushed = props.brushed;
        overlayObj.key = overlayObj.className + '-' + overlayObj.data[props.xAccessor];
        overlayObj[props.yAccessor] = 1;
        overlayObj.tooltipData = {}; // NOTE: Okay to delete? Was causing bad data mutations
        // overlayObj.data.y = barData[i].reduce((prev, curr) => { return prev + curr.data[props.yAccessor] }, 0)

        overlayObj.tooltipData.label = barData[i][0].data[props.xAccessor];
        overlayObj.tooltipData.stackNames = barData[i].map(function (bar) {
          return bar.name;
        });
        overlayObj.tooltipData.stackCounts = barData[i].map(function (bar) {
          return bar.data[props.yAccessor];
        });
        overlayObj.tooltipData.yPos = barData[i][0][props.yAccessor];
        overlayObj.tooltipData.xPos = props.xScale(barData[i][0].data[props.xAccessor]);
        overlayObj.height = props.yScale.range()[0];
        overlayObj.x = props.xScale(barData[i][0].data[props.xAccessor]);
        overlayObj.y = 0;
        overlayData.push(overlayObj);
      }

      var overlayBins = overlayData.map(function (overlayObj, i) {
        // let yPos = 0
        // let xPos = props.xScale(barData[i][0].data[props.xAccessor])
        return _react["default"].createElement("g", {
          className: "overlay-bin",
          key: overlayObj.name + '-overlay-' + i
        }, _react["default"].createElement(_Bar["default"], _extends({}, overlayObj, {
          onClick: props.onClick,
          onEnter: props.onEnter,
          onLeave: props.onLeave
        })));
      });
      return overlayBins;
    }
  }, {
    key: "buildABar",
    value: function buildABar(bin, name, type, height, width, y, x) {
      var props = this.props;
      var keyVal = type.toString() + '-' + bin[props.xAccessor].toString();
      keyVal = keyVal.replace(/ /g, '-');
      return {
        name: name,
        className: 'histogram-bar ' + (bin.className ? type + ' ' + bin.className : type),
        key: keyVal,
        height: height,
        data: _objectSpread({
          x: bin[props.xAccessor],
          y: bin[props.yAccessor]
        }, bin),
        width: width,
        y: y,
        x: x
      };
    }
  }, {
    key: "renderBars",
    value: function renderBars() {
      var _this2 = this;

      var _this$props = this.props,
          chartWidth = _this$props.chartWidth,
          chartHeight = _this$props.chartHeight,
          props = _objectWithoutProperties(_this$props, ["chartWidth", "chartHeight"]);

      var numBins = props.data[0].bins.length;
      var barWidth = (0, _d.isOrdinalScale)(props.xScale.type) ? props.xScale.bandwidth() : chartWidth / numBins;
      var barData = transpose(props.data.map(function (histogram, index) {
        return histogram.bins.map(function (bin) {
          var scaledY = chartHeight - props.yScale(bin[props.yAccessor]);
          var barHeight = bin[props.yAccessor] > 0 ? Math.max(Math.floor(scaledY), 5) : 0;
          var yPos = chartHeight - barHeight;
          var xPos = props.xScale(bin[props.xAccessor]);

          if (xPos == null) {
            // also catches undefined
            xPos = 0;
          }

          return _this2.buildABar(bin, props.data[index].name, props.data[index].type, barHeight, barWidth, yPos, xPos);
        });
      }));
      var overlayBins = [];

      if (props.addOverlay === true) {
        overlayBins = this.getOverlay(barData);
      }

      var svgBars = barData.map(function (dataArr, index) {
        return dataArr.map(function (data, barIndex) {
          if (!data) {
            return null;
          } // If we are a stacked bar chart we need to reference the previously stored
          // calculation for 'y' in barData. Can't easily calculate this above


          if (props.type === 'stacked' && barIndex > 0 && data.className !== '_overlay') {
            data[props.yAccessor] = dataArr[barIndex - 1][props.yAccessor] - data.height;
          }

          return _react["default"].createElement(_SVGComponent["default"], _extends({
            Component: "rect"
          }, data, {
            onMouseEnter: _this2.onMouseEnter,
            onMouseLeave: _this2.onMouseLeave,
            onMouseDown: _this2.onMouseDown,
            onUpdate: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x);
                return transition;
              }
            }
          }));
        });
      });
      var svgBins = svgBars.map(function (bars, i) {
        var key = props.className + '-' + barData[i][0].data[props.xAccessor];
        return _react["default"].createElement("g", {
          className: "bin",
          key: key
        }, bars);
      });

      var el = _react["default"].createElement("g", {
        onMouseLeave: this.onMouseLeave
      }, _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g"
      }, svgBins), overlayBins); // let el = <g>{svgBins}</g>


      if (barData.length > 1 && props.brushed) {
        var interval = Math.abs(barData[1][0].data[props.xAccessor] - barData[0][0].data[props.xAccessor]);
        el = _react["default"].createElement("g", {
          onMouseLeave: this.onMouseLeave
        }, _react["default"].createElement(_BrushX["default"], {
          brushID: props.brushID,
          width: props.xScale.range()[1],
          height: props.yScale.range()[0],
          interval: interval,
          scale: props.xScale,
          onBrush: props.onBrush
        }, _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
          component: "g"
        }, svgBins)), overlayBins);
      }

      return el;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.data.length > 0) {
        return this.renderBars();
      } else {
        return _react["default"].createElement("g", null);
      }
    }
  }]);

  return Histogram;
}(_react["default"].Component);

Histogram.defaultProps = {
  addOverlay: true,
  data: [],
  xAccessor: 'x',
  yAccessor: 'y',
  brushID: 'default',
  onBrush: function onBrush() {},
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {} // xScale - tested to work with linear, time, and ordinal band scales
  // yScale - tested to work with continous linear, log, and power scales
  // type - 'stacked' does not work with tested log or power scales

};
Histogram.propTypes = {
  addOverlay: _propTypes["default"].bool,
  brushed: _propTypes["default"].bool,
  brushID: _propTypes["default"].string,
  chartHeight: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  className: _propTypes["default"].string,
  data: _propTypes["default"].array,
  onBrush: _propTypes["default"].func,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  type: _propTypes["default"].string,
  xAccessor: _propTypes["default"].string.isRequired,
  xScale: _propTypes["default"].any,
  yAccessor: _propTypes["default"].string.isRequired,
  yScale: _propTypes["default"].any
};
var _default = Histogram;
exports["default"] = _default;