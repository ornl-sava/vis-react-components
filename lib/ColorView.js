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
  console.log('lData', data);
  var numCol = data.length / initRowNum;
  numCol = Math.ceil(numCol);
  console.log('numCol', numCol);
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
  console.log('rData', rowData);
  var cIndex = 0;
  var outData = [];
  console.log('outData', outData);
  for (var _i = 0; _i < rowData.length; _i++) {
    outData.push([]);
    for (var j = 0; j < rowData[_i]; j++) {
      console.log('cData', data[cIndex]);
      outData[_i].push('pot' + cIndex);
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
      this.props.xScale.domain([0, 1]);
      this.props.yScale.domain([nextProps.colorDomain.length + 2, 0.00001]);
      this.prefScale.domain(nextProps.colorDomain);
      console.log('topFlowPref', nextProps.colorDomain);
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
  }, {
    key: 'addOverlay',
    value: function addOverlay(barData, index) {
      if (barData.data.length <= 0) {
        barData.data[0] = 'EMPTY';
      }
      var overlayObj = _extends({}, barData);
      // console.log('addOverlayBarDataName', barData)
      overlayObj.className = 'overlay';
      overlayObj.key = overlayObj.className;
      overlayObj.y = 1;
      overlayObj.tooltipData = {};
      overlayObj.tooltipData.label = barData.data;
      overlayObj.tooltipData.counts = index;
      return overlayObj;
    }
    // add tool tip data here later so I don't have to call it in set up

  }, {
    key: 'buildABar',
    value: function buildABar(bin, name, text, height, width, x, y, barStyle, txtStyle) {
      return {
        className: name,
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
      var buff = 1.5;
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

      console.log('lay', layout(2, 10, this.props.colorDomain));
      // let rData = layout(2, 10, this.props.colorDomain)
      // let cIndex = 0
      /* this.props.yScale = d3.scale.ordinal()
      this.props.yScale.domain = rData.length
      this.props.yScale.rangeRoundBands([0, props.chartHeight])*/
      var barWidth = props.chartWidth * 0.4;
      var barHeight = props.yScale(1);
      // checking if ordinal or not
      if (typeof props.xScale.rangePoints === 'function') {
        props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding);
      } else {
        props.xScale.range([0, props.chartWidth]);
      }
      var colorBars = this.props.colorDomain.map(function (data, index) {
        if (data[0] == null) {
          data[0] = 'EMPTY';
        }
        var posY = _this2.props.yScale(index);
        var posX = props.xScale(0.2);
        var cName = data + '-' + index.toString();
        var color = '#ecf2f9';
        if (_this2.props.clickArray[data]) {
          color = _this2.prefScale(data);
        }
        var fontSize = barHeight * 0.8;
        // let text = this.trimText(data, barWidth, fontSize)
        // console.log(text)
        var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
        var barStyle = { fill: color };
        var bar = _this2.buildABar(data, cName, cName, barHeight, barWidth, posX, posY, barStyle, barTxtStyle);
        var barOverlay = null;
        if (props.addOverlay) {
          barOverlay = _this2.addOverlay(bar, index);
        }
        return _react2.default.createElement(_TextBar2.default, _extends({}, bar, { onClick: _this2.onClick, tooltipData: barOverlay.tooltipData, onEnter: _this2.onEnter, onLeave: _this2.onLeave, style: bar.barStyle }));
      });
      var svgBins = colorBars.map(function (barD, index) {
        var yPos = 0;
        var xPos = 0;
        return _react2.default.createElement(
          'g',
          { className: 'bin', key: props.className + '-' + index.toString(), transform: 'translate(' + xPos + ',' + yPos + ')' },
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
      if (this.props.data.length <= 0) {
        console.log('probably no data');
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
  addOverlay: true,
  data: [],
  padding: 0.2,
  outerPadding: 0.4,
  width: 400,
  height: 250,
  rangePadding: 25,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60
};

ColorView.propTypes = {
  addOverlay: _react.PropTypes.bool,
  className: _react.PropTypes.string.isRequired,
  height: _react.PropTypes.number,
  loading: _react.PropTypes.bool,
  padding: _react.PropTypes.number.isRequired,
  outerPadding: _react.PropTypes.number.isRequired,
  xDomain: _react.PropTypes.array,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  rangePadding: _react.PropTypes.number,
  data: _react.PropTypes.object,
  status: _react.PropTypes.string,
  tipFunction: _react.PropTypes.func,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  numTData: _react.PropTypes.number.isRequired,
  barHeight: _react.PropTypes.number.isRequired,
  maxTopics: _react.PropTypes.number.isRequired,
  colorDomain: _react.PropTypes.array,
  colorScale: _react.PropTypes.func,
  onBarClick: _react.PropTypes.func,
  clickArray: _react.PropTypes.array.isRequired
};

exports.default = ColorView;