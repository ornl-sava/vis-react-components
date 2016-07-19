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

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Bar from './Bar'


var lineMaker = function lineMaker(d) {
  d3.line().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  });
};

var diagMaker = function diagMaker(d) {
  return 'M' + d[1].x + ',' + d[1].y + 'C' + (d[1].x + d[0].x) / 2 + ',' + d[1].y + ' ' + (d[1].x + d[0].x) / 2 + ',' + d[0].y + ' ' + d[0].x + ',' + d[0].y;
};

var TopicFlow = function (_React$Component) {
  _inherits(TopicFlow, _React$Component);

  _createClass(TopicFlow, [{
    key: '_onEnter',

    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {
      var props = this.props;
      props.onEnter(toolTipData, svgElement);
      // console.log('story', toolTipData)
      this.setState({ selectedTopics: toolTipData.label, move: false, selectedT: toolTipData.story.concat(toolTipData.adjI) });
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(toolTipData, svgElement) {
      var props = this.props;
      props.onLeave(toolTipData, svgElement);
      this.setState({ selectedTopics: [], move: false, selectedT: [] });
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      console.log('moving');
      // this.moveTopics()
      this.setState({ moveX: this.state.moveX - 50, move: true });
    }
  }, {
    key: '_onBarClick',
    value: function _onBarClick(tooltipData) {}
  }]);

  function TopicFlow(props) {
    _classCallCheck(this, TopicFlow);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TopicFlow).call(this, props));

    _this.state = {
      dataUp: 0,
      currentID: [],
      selectedTopics: [],
      selectedT: [],
      moveX: 0,
      move: false
    };
    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.onClick = _this._onClick.bind(_this);
    _this.onBarClick = _this._onBarClick.bind(_this);
    _this.statArr = [];
    _this.prefScale = d3.scaleOrdinal(d3.schemeCategory20);
    _this.bins = [];
    _this.lineData = [];
    _this.barData = [];
    _this.topics = [];
    _this.barWidth = 0;
    return _this;
  }

  _createClass(TopicFlow, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.data.length <= 0) {
        console.log('probNoDataWillRProps');
        this.setState({ dataUp: 1 });
      }
      return true;
      // return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      // nextProps.colorView.state
      // this.setState[{dataUp: 0}]
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var xDomain = Object.keys(nextProps.data);
      this.props.xScale.domain(xDomain);
      this.props.yScale.domain([nextProps.maxTopics + 2, 0.00001]);
      this.statArr = new Array(nextProps.data.length);
      for (var i = 0; i < nextProps.data.length; i++) {
        this.statArr[i] = new Array(nextProps.data[i].length);
      }
      this.prefScale.domain(nextProps.colorDomain);
      this.bins = this.initTopics(nextProps);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
    // console.log('willMountChartHeight', this.props.chartHeight)

    // React LifeCycle method - called after initial render

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}

    // right now rx and ry are not being passed down into bar

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
        textStyle: txtStyle
      };
    }
  }, {
    key: 'buildAText',
    value: function buildAText(fontSize, color) {
      return {
        textAnchor: 'start',
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
      // console.log('textLength', text.length)
      // 12 is the supposed font size of the text
      if (text.length > width / fontSize * buff) {
        return text.slice(0, width / fontSize * buff - ell.length) + ell;
        // return text.substring(0, width / 12 - ell.length * buff) + ell
      }
      return text;
    }
  }, {
    key: 'initTopics',
    value: function initTopics(props) {
      var _this2 = this;

      var paddedWidth = props.chartWidth * (1 - props.padding).toFixed(2);
      var barWidth = Math.ceil(paddedWidth / (props.numTData + props.outerPadding * 2));
      this.barWidth = barWidth;
      var barHeight = 20;
      var barData = [];
      var lineData = [];
      // XSCALE IS ORDINAL
      props.xScale.range([0, props.chartWidth]);
      props.xScale.paddingInner(props.outerPadding);
      props.xScale.paddingOuter(props.padding);
      console.log('tFAdjList', props.adjacencyList);
      // GETTING TOPIC BAR INFORMATION
      var svgTopicBars = props.adjacencyList.map(function (dataArr, i) {
        if (dataArr.hour < props.numTData) {
          var data = dataArr.events;
          if (data[0] == null) {
            data[0] = 'EMPTY';
          }
          var posY = _this2.props.yScale(dataArr.topicID);
          var posX = props.xScale(dataArr.hour);
          var fontSize = 12;
          // CLASSNAME NEEDS SIMPLE NAMES
          var cName = data[0].toString().split(/:|-/, 1) + '-' + i.toString();
          var topicColor = { stroke: _this2.prefScale(data[0].split(/:|-/, 1)[0]) };
          if (_this2.state.currentID === data[0]) {
            cName += ' Selected';
            topicColor = { stroke: '#e67300' };
          }
          // TRIMMING TEXT IF BEYOND BARS
          var text = _this2.trimText(data[0], barWidth, fontSize);
          // SETTING TEXT STYLE
          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
          var bar = _this2.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle);
          bar.tooltipData = { label: bar.data[0], counts: bar.data.length, story: dataArr.story, topicID: dataArr.topicID, hour: dataArr.hour, prevStory: dataArr.prevStory, adjI: i };
          barData.push(bar);
        }
      });
      console.log('BarData', barData.length);
      // GETTING CONNECTING LINE INFORMATION (EDGES)
      barData.map(function (data, index) {
        var story = data.tooltipData.prevStory;
        // let hour = data.tooltipData.hour
        var dataMatch = [];
        // console.log('hour', hour, 'story', story, 'id', data.tooltipData.topicID)
        if (story[0] != null) {
          (function () {
            var arrIndex = [];
            story.map(function (s, i) {
              dataMatch = [{ x: data.x, y: data.y + barHeight / 2 }, { x: barData[s].x + barWidth, y: barData[s].y + barHeight / 2 }];
              if (_this2.props.lineType === 'curved') {
                arrIndex = lineData.push(diagMaker(dataMatch));
              } else {
                arrIndex = lineData.push(lineMaker(dataMatch));
              }
              data.tooltipData.lineIndex = arrIndex - 1;
            });
          })();
        }
      });
      this.barData = barData;
      this.lineData = lineData;
      return svgTopicBars;
    }
  }, {
    key: 'renderTopics',
    value: function renderTopics() {
      var _this3 = this;

      var svgBins = [];

      var _loop = function _loop(i) {
        var key = 'bar-' + i;
        var nData = [];
        if (_this3.state.selectedTopics[0] != null) {
          // if (this.state.selectedTopics.toString() === this.barData[i].data[0].toString())
          // console.log(this.state.selectedT)
          if (_this3.state.selectedT.indexOf(i) >= 0) {
            nData = JSON.parse(JSON.stringify(_this3.barData[i]));
            nData.sel = true;
            nData.barStyle.stroke = '#00ccff';
            nData.barStyle.strokeWidth = 8;
          }
        }
        var cData = function cData(data) {
          var lineInfo = [];
          if (data.tooltipData.lineIndex != null) {
            lineInfo = _react2.default.createElement('path', { className: data.data[0] + ' lineMatch -' + i, d: _this3.lineData[data.tooltipData.lineIndex], style: data.barStyle });
          }
          return _react2.default.createElement(
            'g',
            { className: 'bin', key: key },
            _react2.default.createElement(_TextBar2.default, _extends({}, data, { onEnter: _this3.onEnter, onLeave: _this3.onLeave, onClick: _this3.onBarClick })),
            lineInfo
          );
        };
        // IF TOPICS SELECTED BY LEGEND KEY
        if (_this3.props.clickArray[_this3.barData[i].data[0].toString().split(/:|-/, 1)]) {
          if (nData.sel) {
            // PUSHES MOUSED OVER TOPICS TO THE FRONT
            svgBins.push(cData(nData));
          } else {
            svgBins.unshift(cData(_this3.barData[i]));
          }
        } else {
          // GREYS OUT TOPIC BARS NOT SELECTED BY LEGEND KEY
          nData = JSON.parse(JSON.stringify(_this3.barData[i]));
          nData.barStyle.stroke = '#e2e2eb';
          nData.barStyle.strokeOpacity = 0.6;
          nData.textStyle.fill = '#e2e2eb';
          nData.textStyle.fillOpacity = 0.6;
          // console.log('nData', nData)
          svgBins.unshift(cData(nData));
        }
      };

      for (var i = 0; i < this.barData.length; i++) {
        _loop(i);
      }
      return _react2.default.createElement(
        'g',
        null,
        svgBins
      );
    }
  }, {
    key: 'moveTopics',
    value: function moveTopics() {
      return _react2.default.createElement(
        'g',
        { transform: 'translate(' + this.state.moveX + ',' + 0 + ')' },
        this.topics
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
      if (this.state.move) {
        renderEl = this.moveTopics();
      } else {
        if (this.props.data.length <= 0) {
          console.log('probably no data');
          renderEl = this.renderLoadAnimation(this.props);
        } else {
          this.topics = this.renderTopics();
          renderEl = this.moveTopics();
        }
      }
      return renderEl;
    }
  }]);

  return TopicFlow;
}(_react2.default.Component);

TopicFlow.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: [],
  adjacencyList: []
};

TopicFlow.propTypes = {
  className: _react.PropTypes.string.isRequired,
  loading: _react.PropTypes.bool,
  padding: _react.PropTypes.number.isRequired,
  outerPadding: _react.PropTypes.number.isRequired,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  data: _react.PropTypes.any.isRequired,
  status: _react.PropTypes.string,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  numTData: _react.PropTypes.number.isRequired,
  barHeight: _react.PropTypes.number.isRequired,
  maxTopics: _react.PropTypes.number.isRequired,
  colorDomain: _react.PropTypes.array,
  lineType: _react.PropTypes.string.isRequired,
  clickArray: _react.PropTypes.any.isRequired,
  adjacencyList: _react.PropTypes.array.isRequired
};

exports.default = TopicFlow;