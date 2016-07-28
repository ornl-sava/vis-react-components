'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Bar = require('./Bar');

var _Bar2 = _interopRequireDefault(_Bar);

var _BrushX = require('./BrushX');

var _BrushX2 = _interopRequireDefault(_BrushX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Histogram = function (_React$Component) {
  _inherits(Histogram, _React$Component);

  function Histogram(props) {
    _classCallCheck(this, Histogram);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Histogram).call(this, props));

    _this.onMouseLeave = _this._onMouseLeave.bind(_this);
    _this.renderBars = _this.renderBars.bind(_this);
    return _this;
  }

  _createClass(Histogram, [{
    key: '_onMouseLeave',
    value: function _onMouseLeave(event) {
      this.props.onLeave(event, {});
    }
  }, {
    key: 'getOverlay',
    value: function getOverlay(barData) {
      var props = this.props;
      var overlayData = [];
      for (var i = 0; i < barData.length; i++) {
        var overlayObj = _extends({}, barData[i][0]);
        overlayObj.className = '_overlay';
        overlayObj.brushed = props.brushed;
        overlayObj.key = overlayObj.className + '-' + overlayObj.data[props.xAccessor];
        overlayObj[props.yAccessor] = 1;
        overlayObj.tooltipData = {};
        overlayObj.data.y = barData[i].reduce(function (prev, curr) {
          return prev + curr.data[props.yAccessor];
        }, 0);
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
        overlayData.push(overlayObj);
      }
      var overlayBins = overlayData.map(function (overlayObj, i) {
        var yPos = 0;
        var xPos = props.xScale(barData[i][0].data[props.xAccessor]);
        return _react2.default.createElement(
          'g',
          { className: 'overlay-bin', key: 'overlay-' + i.toString(), transform: 'translate(' + xPos + ',' + yPos + ')' },
          _react2.default.createElement(_Bar2.default, _extends({}, overlayObj, { onEnter: props.onEnter, onLeave: props.onLeave }))
        );
      });

      return overlayBins;
    }
  }, {
    key: 'buildABar',
    value: function buildABar(bin, name, type, height, width, y) {
      var props = this.props;
      var keyVal = type.toString() + '-' + bin[props.xAccessor].toString();
      return {
        name: name,
        className: bin.className ? type + ' ' + bin.className : type,
        key: keyVal,
        height: height,
        data: _extends({ x: bin[props.xAccessor], y: bin[props.yAccessor] }, bin),
        width: width,
        y: y
      };
    }
  }, {
    key: 'renderBars',
    value: function renderBars() {
      var _this2 = this;

      var _props = this.props;
      var chartWidth = _props.chartWidth;
      var chartHeight = _props.chartHeight;

      var props = _objectWithoutProperties(_props, ['chartWidth', 'chartHeight']);

      var numBins = props.data[0].bins.length;
      var barWidth = /ordinal/.test(props.xScale.type) ? props.xScale.bandwidth() : chartWidth / numBins;

      var barData = transpose(props.data.map(function (histogram, index) {
        return histogram.bins.map(function (bin) {
          var scaledY = chartHeight - props.yScale(bin[props.yAccessor]);
          var barHeight = bin[props.yAccessor] > 0 ? Math.max(Math.floor(scaledY), 5) : 0;
          var yPos = chartHeight - barHeight;
          return _this2.buildABar(bin, props.data[index].name, props.data[index].type, barHeight, barWidth, yPos);
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
          }
          // If we are a stacked bar chart we need to reference the previously stored
          // calculation for 'y' in barData. Can't easily calculate this above
          if (props.type === 'stacked' && barIndex > 0 && data.className !== '_overlay') {
            data[props.yAccessor] = dataArr[barIndex - 1][props.yAccessor] - data.height;
          }
          return _react2.default.createElement(_Bar2.default, _extends({}, data, { onClick: props.onClick, onEnter: props.onEnter, onLeave: props.onLeave }));
        });
      });

      var svgBins = svgBars.map(function (bars, i) {
        var yPos = 0;
        var xPos = props.xScale(barData[i][0].data[props.xAccessor]);
        if (xPos == null) {
          // also catches undefined
          xPos = 0;
        }
        return _react2.default.createElement(
          'g',
          { className: 'bin', key: props.className + '-' + i.toString(), transform: 'translate(' + xPos + ',' + yPos + ')' },
          bars
        );
      });

      var el = _react2.default.createElement(
        'g',
        { onMouseLeave: this.onMouseLeave },
        _react2.default.createElement(
          'g',
          null,
          svgBins
        ),
        overlayBins
      );
      // let el = <g>{svgBins}</g>
      if (barData.length > 1 && props.brushed) {
        var interval = Math.abs(barData[1][0].data[props.xAccessor] - barData[0][0].data[props.xAccessor]);
        el = _react2.default.createElement(
          'g',
          { onMouseLeave: this.onMouseLeave },
          _react2.default.createElement(
            _BrushX2.default,
            { width: props.xScale.range()[1], height: props.yScale.range()[0], interval: interval, scale: props.xScale },
            svgBins
          ),
          overlayBins
        );
      }
      return el;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.data.length > 0) {
        return this.renderBars();
      } else {
        return _react2.default.createElement('g', null);
      }
    }
  }]);

  return Histogram;
}(_react2.default.Component);

Histogram.defaultProps = {
  addOverlay: true,
  data: [],
  xAccessor: 'x',
  yAccessor: 'y',
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Histogram.propTypes = {
  addOverlay: _react.PropTypes.bool,
  brushed: _react.PropTypes.bool,
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  className: _react.PropTypes.string,
  data: _react.PropTypes.array,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  type: _react.PropTypes.string,
  xAccessor: _react.PropTypes.string.isRequired,
  xScale: _react.PropTypes.any,
  yAccessor: _react.PropTypes.string.isRequired,
  yScale: _react.PropTypes.any
};

exports.default = Histogram;