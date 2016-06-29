'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextBar = require('./TextBar');

var _TextBar2 = _interopRequireDefault(_TextBar);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var layout = function layout(initRowNum, maxColLength, data) {
  var numCol = data.length / initRowNum;
  numCol = Math.ceil(numCol);
  // if the number of columns in row exceeds max re-run with more rows
  if (numCol > maxColLength) {
    var newInit = initRowNum + 1;
    return layout(newInit, maxColLength, data.length);
  }
  // setting up array with row column information
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

var ColorView = function (_React$Component) {
  _inherits(ColorView, _React$Component);

  _createClass(ColorView, [{
    key: '_onEnter',

    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {}
  }, {
    key: '_onLeave',
    value: function _onLeave(toolTipData, svgElement) {}
  }, {
    key: '_onClick',
    value: function _onClick(toolTipData) {
      // console.log('clicked', toolTipData)
      var index = toolTipData.label;
      var newClickArray = this.props.clickArray;
      console.log('clickArray', this.props.spread, '-', this.props.clickArray);
      // might want to move this up and make constant?
      // used to check if all the topics are selected
      var checkClick = function checkClick() {
        for (var i in newClickArray) {
          if (!newClickArray[i]) {
            return false;
          }
        }
        return true;
      };
      // if all are clicked the resets it to the only the one being clicked
      // else toggle on / off
      if (checkClick()) {
        for (var i in newClickArray) {
          newClickArray[i] = false;
        }
        newClickArray[index] = true;
        console.log('sweet beAns!');
      } else {
        newClickArray[index] = !newClickArray[index];
      }
      this.props.onBarClick(newClickArray);
    }
  }]);

  function ColorView(props) {
    _classCallCheck(this, ColorView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorView).call(this, props));

    _this.state = {
      dataUp: 0,
      currentID: []
    };
    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.prefScale = _d2.default.scale.category20();
    _this.onClick = _this._onClick.bind(_this);
    if (_this.props.spread === 'vertical') {
      _this.xScale = _this.props.xScale;
      _this.yScale = _this.props.yScale;
    } else {
      _this.xScale = _d2.default.scale.ordinal();
      _this.yScale = _d2.default.scale.ordinal();
    }
    _this.rData = [];
    return _this;
  }

  _createClass(ColorView, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.colorDomain == null) {
        console.log('probNoDataWillRProps');
        this.setState({ dataUp: 1 });
      }
      return true;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.spread === 'vertical') {
        this.xScale.domain([0, 1]);
        this.yScale.domain([nextProps.colorDomain.length + 2, 0.00001]);
      } else {
        this.rData = layout(2, 10, this.props.colorDomain);
        this.yScale.domain(Object.keys(this.rData));
        this.yScale.rangeRoundBands([0, this.props.chartHeight], this.props.padding, this.props.outerPadding);
      }
      this.prefScale.domain(nextProps.colorDomain);
      this.data = nextProps.colorDomain;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
    // console.log('willMountChartHeight', this.props.chartHeight)

    // React LifeCycle method - called after initial render

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // console.log('didMountChartHeight', this.props.chartHeight)
      if (this.props.colorDomain == null) {
        console.log('probNoDataDidMount');
        this.setState({ dataUp: 1 });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
    // add tool tip data here later so I don't have to call it in set up

  }, {
    key: 'buildABar',
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
    key: 'buildAText',
    value: function buildAText(fontSize, color) {
      return {
        textAnchor: 'middle',
        fontSize: fontSize,
        width: '10px'
      };
    }
  }, {
    key: 'trimText',
    value: function trimText(text, width, fontSize) {
      var ell = '...';
      var buff = 0.95;
      text.toString();
      // 12 is the supposed font size of the text
      if (text.length > width / fontSize * buff) {
        return text.slice(0, width / fontSize * buff - ell.length) + ell;
      }
      return text;
    }
  }, {
    key: 'renderTopics',
    value: function renderTopics(props) {
      var _this2 = this;

      var colorBars = [];
      if (this.props.spread === 'vertical') {
        (function () {
          var barHeight = _this2.yScale(1);
          var barWidth = props.chartWidth * 0.9;
          var fontSize = barHeight * 0.8;
          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
          // checking if ordinal or not
          if (typeof props.xScale.rangePoints === 'function') {
            _this2.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding);
          } else {
            _this2.xScale.range([0, props.chartWidth]);
          }
          colorBars = _this2.props.colorDomain.map(function (data, index) {
            if (data[0] == null) {
              data[0] = 'EMPTY';
            }
            var posY = _this2.yScale(index);
            var posX = (props.chartWidth - barWidth) / 2;
            var cName = data + '-' + index.toString();
            var color = '#ecf2f9';
            if (_this2.props.clickArray[data]) {
              color = _this2.prefScale(data);
            }
            var barStyle = { fill: color };
            var text = _this2.trimText(data, barWidth, fontSize);
            var bar = _this2.buildABar(cName, text, barHeight, barWidth, posX, posY, barStyle, barTxtStyle);
            bar.tooltipData = { label: data, counts: index };
            return _react2.default.createElement(_TextBar2.default, _extends({}, bar, { onClick: _this2.onClick, onEnter: _this2.onEnter, onLeave: _this2.onLeave, style: bar.barStyle }));
          });
        })();
      } else {
        (function () {
          console.log('lay', _this2.rData);
          var paddedHeight = _this2.props.chartHeight * (1.0 - _this2.props.padding).toFixed(2);
          var barHeight = Math.floor(paddedHeight / (_this2.rData.length + props.outerPadding * 2));
          var fontSize = barHeight * 0.4;
          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
          colorBars = _this2.rData.map(function (arr, index) {
            _this2.xScale.domain(Object.keys(arr));
            _this2.xScale.rangeRoundBands([0, _this2.props.chartWidth], _this2.props.padding, _this2.props.outerPadding);
            var paddedWidth = _this2.props.chartWidth * (1.0 - _this2.props.padding).toFixed(2);
            var barWidth = Math.floor(paddedWidth / (arr.length + props.outerPadding * 2));
            return arr.map(function (title, i) {
              var posY = _this2.yScale(index);
              var posX = _this2.xScale(i);
              var cName = title + '-r' + index.toString() + '-c' + i.toString();
              var text = _this2.trimText(title, barWidth, fontSize);
              var color = '#ecf2f9';
              if (_this2.props.clickArray[title]) {
                color = _this2.prefScale(title);
              }
              var barStyle = { fill: color };
              var bar = _this2.buildABar(cName, text, barHeight, barWidth, posX, posY, barStyle, barTxtStyle);
              bar.tooltipData = { label: title, counts: index };
              return _react2.default.createElement(_TextBar2.default, _extends({}, bar, { onClick: _this2.onClick, onEnter: _this2.onEnter, onLeave: _this2.onLeave, style: bar.barStyle }));
            });
          });
        })();
      }
      var svgBins = colorBars.map(function (barD, index) {
        var yPos = 0;
        var xPos = 0;
        return _react2.default.createElement(
          'g',
          { className: 'bin', key: props.className + '-' + index.toString() + '-' + _this2.props.spread, transform: 'translate(' + xPos + ',' + yPos + ')' },
          barD
        );
      });
      return _react2.default.createElement(
        'g',
        null,
        svgBins
      );
    }

    // gives text if loading data

  }, {
    key: 'renderLoadAnimation',
    value: function renderLoadAnimation(props) {
      var chartWidth = props.chartWidth;
      var chartHeight = props.chartHeight;

      var xPos = Math.floor(chartWidth / 2);
      var yPos = Math.floor(chartHeight / 2);
      var messageText = 'Loading data...';
      if (!props.loading) {
        if (props.status === 'Failed to fetch') {
          messageText = 'Can\'t connect to API URL';
        } else if (props.status !== 'OK') {
          messageText = 'Error retrieving data: ' + props.status;
        } else {
          messageText = 'No data returned!';
        }
      }
      return _react2.default.createElement(
        'g',
        { className: 'loading-message' },
        _react2.default.createElement(
          'text',
          { x: xPos, y: yPos },
          messageText
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var renderEl = null;
      if (this.props.colorDomain.length <= 0) {
        console.log('no data');
        renderEl = this.renderLoadAnimation(this.props);
      } else {
        renderEl = this.renderTopics(this.props);
      }
      return renderEl;
    }
  }]);

  return ColorView;
}(_react2.default.Component);

ColorView.defaultProps = {
  colorDomain: [],
  spread: 'vertical',
  padding: 0.1,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0
};

ColorView.propTypes = {
  colorDomain: _react.PropTypes.array,
  colorScale: _react.PropTypes.func,
  onBarClick: _react.PropTypes.func,
  clickArray: _react.PropTypes.object.isRequired,
  spread: _react.PropTypes.string.isRequired,
  className: _react.PropTypes.string.isRequired,
  loading: _react.PropTypes.bool,
  padding: _react.PropTypes.number.isRequired,
  outerPadding: _react.PropTypes.number.isRequired,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  status: _react.PropTypes.string
};

exports.default = ColorView;