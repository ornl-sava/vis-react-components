"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("d3");

var _d2 = require("./util/d3");

var _TextBar = _interopRequireDefault(require("./TextBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var layout = function layout(initRowNum, maxColLength, data) {
  var numCol = data.length / initRowNum;
  numCol = Math.ceil(numCol); // if the number of columns in row exceeds max re-run with more rows

  if (numCol > maxColLength) {
    var newInit = initRowNum + 1;
    return layout(newInit, maxColLength, data.length);
  } // setting up array with row column information


  var rowData = [];

  for (var i = 0; i < data.length; i += numCol) {
    if (i + numCol > data.length) {
      rowData.push(data.length - i);
    } else {
      rowData.push(numCol);
    }
  }

  var cIndex = 0;
  var outData = [];

  for (var _i = 0; _i < rowData.length; _i++) {
    outData.push([]);

    for (var j = 0; j < rowData[_i]; j++) {
      // outData[i].push('pot' + cIndex)
      outData[_i].push(data[cIndex]);

      cIndex++;
    }
  }

  return outData;
};

var ColorView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ColorView, _React$Component);

  _createClass(ColorView, [{
    key: "_onEnter",
    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {}
  }, {
    key: "_onLeave",
    value: function _onLeave(toolTipData, svgElement) {}
  }, {
    key: "_onClick",
    value: function _onClick(toolTipData) {
      // console.log('clicked', toolTipData)
      var index = toolTipData.label;

      var newClickArray = _extends({}, this.clickArray);

      if (index === 'CLEAR') {
        for (var i in newClickArray) {
          newClickArray[i] = false;
        }

        this.colorDomain[toolTipData.counts] = 'ALL';
      } else if (index === 'ALL') {
        for (var _i2 in newClickArray) {
          newClickArray[_i2] = true;
        }

        this.colorDomain[toolTipData.counts] = 'CLEAR';
      } else {
        newClickArray[index] = !newClickArray[index];
      }

      this.props.onBarClick(newClickArray);
    }
  }]);

  function ColorView(props) {
    var _this;

    _classCallCheck(this, ColorView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorView).call(this, props));
    _this.state = {
      dataUp: 0,
      currentID: []
    };

    if (props.spread === 'vertical') {
      _this.xScale = (0, _d2.setScale)('band');
      _this.yScale = (0, _d2.setScale)('band');
    } else {
      _this.xScale = (0, _d2.setScale)('ordinal');
      _this.yScale = (0, _d2.setScale)('ordinal');
    }

    _this.updateDR = _this.updateDR.bind(_assertThisInitialized(_this));
    _this.onEnter = _this._onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this._onLeave.bind(_assertThisInitialized(_this));
    _this.prefScale = (0, _d.scaleOrdinal)(_d.schemeCategory20);
    _this.onClick = _this._onClick.bind(_assertThisInitialized(_this));
    _this.rData = []; // this.colorDomain = JSON.parse(JSON.stringify(this.props.colorDomain))
    // this.colorDomain.push('CLEAR')

    _this.colorDomain = props.colorDomain.concat(['OTHER', 'CLEAR']);
    _this.clickArray = _extends(props.clickArray, {
      OTHER: true
    }); // this.updateDR(props)

    return _this;
  }

  _createClass(ColorView, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.colorDomain == null) {
        console.log('probNoDataWillRProps');
        this.setState({
          dataUp: 1
        });
      }

      return true;
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.colorDomain !== this.props.colorDomain) {
        this.colorDomain = nextProps.colorDomain.concat(['OTHER', 'CLEAR']);
        this.clickArray = _extends(nextProps.clickArray, {
          OTHER: true
        });
      } else {
        this.clickArray = _extends(nextProps.clickArray);
      } // this.updateDR(nextProps)

    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {} // console.log('willMountChartHeight', this.props.chartHeight)
    // React LifeCycle method - called after initial render

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // console.log('didMountChartHeight', this.props.chartHeight)
      if (this.props.colorDomain == null) {
        console.log('probNoDataDidMount');
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "updateDR",
    value: function updateDR() {
      this.prefScale.domain(this.props.colorDomain);

      if (this.props.spread === 'vertical') {
        this.xScale.domain([0, 1]);
        this.yScale.domain((0, _d.range)(this.props.colorDomain.length + 2, -1, -1)).range([this.props.chartHeight, 0]);
      } else {
        this.rData = layout(2, 10, this.props.colorDomain);
        this.yScale.domain(Object.keys(this.rData));
        this.yScale.rangeRoundBands([0, this.props.chartHeight], this.props.padding, this.props.outerPadding);
      }
    } // add tool tip data here later so I don't have to call it in set up

  }, {
    key: "buildABar",
    value: function buildABar(bin, text, height, width, x, y, barStyle, txtStyle) {
      return {
        className: text,
        text: text,
        height: height,
        data: bin,
        width: width,
        rx: height / 4,
        ry: height / 4,
        x: x,
        y: y,
        barStyle: barStyle,
        textStyle: txtStyle,
        stroke: 'black',
        strokeWidth: '2px'
      };
    }
  }, {
    key: "buildAText",
    value: function buildAText(fontSize, color) {
      return {
        textAnchor: 'middle',
        fontSize: fontSize,
        width: '10px'
      };
    }
  }, {
    key: "trimText",
    value: function trimText(text, width, fontSize) {
      var ell = '...';
      var buff = 0.95;
      text.toString(); // 12 is the supposed font size of the text

      if (text.length > width / fontSize * buff) {
        return text.slice(0, width / fontSize * buff - ell.length) + ell;
      }

      return text;
    }
  }, {
    key: "renderTopics",
    value: function renderTopics() {
      var _this2 = this;

      var colorBars = [];

      if (this.props.spread === 'vertical') {
        var barHeight = this.yScale(1) - this.yScale(0);
        var barWidth = this.props.chartWidth * 0.9;
        var fontSize = barHeight * 0.8;
        var barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black'); // checking if ordinal or not

        if (typeof this.xScale.rangePoints === 'function') {
          this.xScale.rangeRoundBands([0, this.props.chartWidth], this.props.padding, this.props.outerPadding);
        } else {
          this.xScale.range([0, this.props.chartWidth]);
        }

        colorBars = this.colorDomain.map(function (data, index) {
          if (data[0] == null) {
            data[0] = 'EMPTY';
          }

          var posY = _this2.yScale(index);

          var posX = (_this2.props.chartWidth - barWidth) / 2;
          var cName = data + '-' + index.toString();
          var color = '#ecf2f9';

          if (data === 'CLEAR') {
            posY = _this2.yScale(index + 1);
            color = 'red';
          } else if (data === 'ALL') {
            posY = _this2.yScale(index + 1);
            color = 'green';
          } else if (_this2.props.clickArray[data]) {
            color = _this2.prefScale(data);
          }

          var barStyle = {
            fill: color,
            fillOpacity: 0.5
          };

          var text = _this2.trimText(data, barWidth, fontSize);

          var bar = _this2.buildABar(cName, text, barHeight, barWidth, posX, posY, barStyle, barTxtStyle);

          bar.tooltipData = {
            label: data,
            counts: index
          };
          return _react["default"].createElement(_TextBar["default"], _extends({}, bar, {
            onClick: _this2.onClick,
            onEnter: _this2.onEnter,
            onLeave: _this2.onLeave,
            style: bar.barStyle
          }));
        });
      } else {
        var paddedHeight = this.props.chartHeight * (1.0 - this.props.padding).toFixed(2);

        var _barHeight = Math.floor(paddedHeight / (this.rData.length + this.props.outerPadding * 2));

        var _fontSize = _barHeight * 0.4;

        var _barTxtStyle = this.buildAText(_fontSize.toString() + 'px', 'black');

        colorBars = this.rData.map(function (arr, index) {
          _this2.xScale.domain(Object.keys(arr));

          _this2.xScale.rangeRoundBands([0, _this2.props.chartWidth], _this2.props.padding, _this2.props.outerPadding);

          var paddedWidth = _this2.props.chartWidth * (1.0 - _this2.props.padding).toFixed(2);

          var barWidth = Math.floor(paddedWidth / (arr.length + _this2.props.outerPadding * 2));
          return arr.map(function (title, i) {
            var posY = _this2.yScale(index);

            var posX = _this2.xScale(i);

            var cName = title + '-r' + index.toString() + '-c' + i.toString();

            var text = _this2.trimText(title, barWidth, _fontSize);

            var color = '#ecf2f9';

            if (_this2.props.clickArray[title]) {
              color = _this2.prefScale(title);
            }

            var barStyle = {
              fill: color
            };

            var bar = _this2.buildABar(cName, text, _barHeight, barWidth, posX, posY, barStyle, _barTxtStyle);

            bar.tooltipData = {
              label: title,
              counts: index
            };
            return _react["default"].createElement(_TextBar["default"], _extends({}, bar, {
              onClick: _this2.onClick,
              onEnter: _this2.onEnter,
              onLeave: _this2.onLeave,
              style: bar.barStyle
            }));
          });
        });
      }

      var svgBins = colorBars.map(function (barD, index) {
        var yPos = 0;
        var xPos = 0;
        return _react["default"].createElement("g", {
          className: "bin",
          key: _this2.props.className + '-' + index.toString() + '-' + _this2.props.spread,
          transform: 'translate(' + xPos + ',' + yPos + ')'
        }, barD);
      });
      return _react["default"].createElement("g", {
        className: "colorView"
      }, svgBins);
    }
  }, {
    key: "render",
    value: function render() {
      var renderEl = null;

      if (this.props.colorDomain.length <= 0) {
        console.log('no data');
      } else {
        this.updateDR();
        renderEl = this.renderTopics(this.props);
      }

      return renderEl;
    }
  }]);

  return ColorView;
}(_react["default"].Component);

ColorView.defaultProps = {
  colorDomain: [],
  spread: 'vertical',
  padding: 0.1,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0
};
ColorView.propTypes = {
  className: _propTypes["default"].string,
  colorDomain: _propTypes["default"].array,
  onBarClick: _propTypes["default"].func,
  clickArray: _propTypes["default"].any.isRequired,
  spread: _propTypes["default"].string.isRequired,
  padding: _propTypes["default"].number.isRequired,
  outerPadding: _propTypes["default"].number.isRequired,
  chartHeight: _propTypes["default"].number.isRequired,
  chartWidth: _propTypes["default"].number.isRequired
};
var _default = ColorView;
exports["default"] = _default;