"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var d3 = _interopRequireWildcard(require("d3"));

var _d2 = require("./util/d3");

var _TextBar = _interopRequireDefault(require("./TextBar"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var TopicFlow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TopicFlow, _React$Component);

  _createClass(TopicFlow, [{
    key: "_onEnter",
    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(event, data) {
      this.props.onEnter(event, data);
      data.bar._barStyle = data.bar.barStyle;
      data.bar.barStyle = {
        stroke: '#00ccff',
        strokeWidth: 7
      };
      data.bar.className = data.bar.className + ' selected ';
      data.story.map(function (d, i) {
        d.bar._barStyle = d.bar.barStyle;
        d.bar.barStyle = {
          stroke: '#00ccff',
          strokeWidth: 7
        };
        d.bar.className = d.bar.className + ' selected ';
      });
      this.forceUpdate(); // this.setState({selectedTopics: toolTipData.label, selectedT: toolTipData.story.concat(toolTipData.adjI)})
    }
  }, {
    key: "_onLeave",
    value: function _onLeave(event, data) {
      this.props.onLeave(event, data);
      data.bar.barStyle = data.bar._barStyle;
      data.bar.className = data.bar.className.replace('selected ', '');
      data.story.map(function (d, i) {
        d.bar.barStyle = d.bar._barStyle;
        d.bar.className = d.bar.className.replace('selected ', '');
      });
      this.forceUpdate(); // this.setState({selectedTopics: [], selectedT: []})
    } // _onClick () {
    //   // console.log('moving')
    //   // this.moveTopics()
    //   // this.moveX += 50
    //   // this.refs.svgBins.style.transform = 'translate(' + this.moveX + ',' + 0 + ')'
    // }

  }, {
    key: "_onBarClick",
    value: function _onBarClick(event, data) {
      // console.log('click', data)
      this.props.onBarClick(event, data);
    }
  }]);

  function TopicFlow(props) {
    var _this;

    _classCallCheck(this, TopicFlow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TopicFlow).call(this, props));
    _this.state = {
      dataUp: false,
      currentID: [],
      selectedTopics: [],
      selectedT: []
    };
    _this.xScale = (0, _d2.setScale)('band');
    _this.yScale = (0, _d2.setScale)('band');
    _this.prefScale = d3.scaleOrdinal(d3.schemeCategory20);
    _this.updateDomain = _this.updateDomain.bind(_assertThisInitialized(_this));
    _this.updateRange = _this.updateRange.bind(_assertThisInitialized(_this));

    _this.updateDomain(props);

    _this.updateRange(props);

    _this.onEnter = _this._onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this._onLeave.bind(_assertThisInitialized(_this)); // this.onClick = this._onClick.bind(this)

    _this.onBarClick = _this._onBarClick.bind(_assertThisInitialized(_this));
    _this.lineData = [];
    _this.barData = [];
    _this.topics = [];
    _this.barWidth = 0;
    _this.moveX = 0;

    _this.initTopics(props);

    return _this;
  }

  _createClass(TopicFlow, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      // console.log('TF-nextProps', nextProps)
      if (nextProps.clickArray !== this.props.clickArray) {
        this.deActivate(nextProps);
      } else {
        this.initTopics(nextProps);
      }
    }
  }, {
    key: "updateDomain",
    value: function updateDomain(props) {
      var yDomain = [];
      props.timeBins.map(function (data, index) {
        if (data.topics.length > yDomain.length) {
          yDomain = d3.range(0, data.topics.length, 1);
        }
      });
      var xDomain = Object.keys(props.timeBins); // console.log('TF-xDomain', xDomain)

      this.xScale.domain(xDomain);
      this.yScale.domain(yDomain);
      this.prefScale.domain(props.colorDomain);
    }
  }, {
    key: "updateRange",
    value: function updateRange(props) {
      this.xScale.range([0, props.chartWidth]).paddingInner(props.padding).paddingOuter(props.outerPadding);
      this.yScale.range([0, props.chartHeight]);
    }
  }, {
    key: "buildABar",
    value: function buildABar(bin, cName, text, height, width, x, y, barStyle, txtStyle, id) {
      return {
        className: cName,
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
        'data-id': id
      };
    }
  }, {
    key: "buildAText",
    value: function buildAText(fontSize, color) {
      return {
        textAnchor: 'start',
        fontSize: fontSize,
        width: '10px'
      };
    }
  }, {
    key: "trimText",
    value: function trimText(text, width, fontSize) {
      var ell = '...';
      var buff = 1.5;
      text.toString(); // console.log('textLength', text.length)
      // 12 is the supposed font size of the text

      if (text.length > width / fontSize * buff) {
        return text.slice(0, width / fontSize * buff - ell.length) + ell; // return text.substring(0, width / 12 - ell.length * buff) + ell
      }

      return text;
    }
  }, {
    key: "initTopics",
    value: function initTopics(props) {
      var _this2 = this;

      // console.log('initTopics')
      var barWidth = this.xScale.bandwidth();
      this.barWidth = barWidth;
      var barHeight = props.barHeight;
      var barBuff = barHeight / 2;
      var barData = [];
      var lineData = []; // GETTING TOPIC BAR INFORMATION

      var svgTopicBars = props.timeBins.map(function (dataArr, i) {
        var y = 0;
        dataArr.topics.map(function (data, index) {
          var events = data.events;

          if (events == null) {
            events = ['EMPTY'];
          }

          y = (barHeight + barBuff) * index;

          var posX = _this2.xScale(i);

          var fontSize = 12; // CLASSNAME NEEDS SIMPLE NAMES

          var prefix = events[0].toString().split(/:|-/, 1)[0];
          var cName = prefix + '-' + i.toString();
          var barStyle = {
            stroke: _this2.prefScale(prefix),
            strokeWidth: 3 // TRIMMING TEXT IF BEYOND BARS

          };

          var text = _this2.trimText(events[0], barWidth, fontSize); // SETTING TEXT STYLE


          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');

          var bar = _this2.buildABar(data, cName, text, barHeight, barWidth, posX, y, barStyle, barTxtStyle, [i, index]); // bar.tooltipData = {label: events[0], counts: events.length, story: dataArr.story, topicID: dataArr.topicID, hour: dataArr.hour, prevStory: dataArr.prevStory, adjI: i}


          barData.push(bar);
          data.bar = bar;
          data.bar._barStyle = barStyle;
          data.bar._textStyle = barTxtStyle; // console.log('indPref', props.colorDomain.indexOf(prefix[0]), '-', prefix)

          if (props.colorDomain.indexOf(prefix) < 0 || prefix === 'EMPTY') {
            data.bar.prefix = 'OTHER';
          } else {
            data.bar.prefix = prefix;
          }
        });
      }); // console.log('TF-BarData', barData)
      // console.log('TF-.bar', props.timeBins)
      // GETTING CONNECTING LINE INFORMATION (EDGES)

      props.links.map(function (data, index) {
        var coor = [{
          x: data.source.bar.x + barWidth,
          y: data.source.bar.y + barHeight / 2
        }, {
          x: data.target.bar.x,
          y: data.target.bar.y + barHeight / 2
        }];

        if (_this2.props.lineType === 'curved') {
          lineData.push(diagMaker(coor));
          data.lineData = diagMaker(coor);
          data.source.line = diagMaker(coor);
        } else {
          lineData.push(lineMaker(coor));
          data.lineData = lineMaker(coor);
          data.source.line = diagMaker(coor);
        } // data.source.bar.tooltipData.lineIndex = 0

      }); // console.log('TF-lineData', lineData)

      this.barData = barData;
      this.lineData = lineData;
      return svgTopicBars;
    }
  }, {
    key: "deActivate",
    value: function deActivate(props) {
      console.log('here', props);
      props.timeBins.map(function (d, i) {
        console.log(d);
        d.topics.map(function (da, ind) {
          // console.log('da')
          var data = da.bar; // console.log('ppr', data.prefix)

          if (!props.clickArray[data.prefix]) {
            data.barStyle = {
              stroke: '#e2e2eb',
              strokeOpacity: 0.6,
              strokeWidth: 3
            };
            data.textStyle = {
              fill: '#e2e2eb',
              fillOpacity: 0.6
            };
          } else {
            data.barStyle = data._barStyle;
            data.textStyle = data._textStyle;
          }
        });
      });
    }
  }, {
    key: "renderTopics",
    value: function renderTopics(props) {
      var _this3 = this;

      // console.log('TF-rT', props.timeBins)
      var svgBins = [];

      var cData = function cData(data, key) {
        var lineInfo = [];

        if (data.line != null) {
          lineInfo = _react["default"].createElement("path", {
            className: 'lineMatch ' + data.bar.className + ' barTopic',
            d: data.line,
            style: data.bar.barStyle
          });
        }

        return _react["default"].createElement("g", {
          className: "bin",
          key: key
        }, _react["default"].createElement(_TextBar["default"], _extends({}, data.bar, {
          onEnter: _this3.onEnter,
          onLeave: _this3.onLeave,
          onClick: _this3.onBarClick
        })), lineInfo);
      };

      props.timeBins.map(function (data, index) {
        data.topics.map(function (d, i) {
          var nData = [];
          var key = 'bar-' + index + '-' + i; // if (this.props.clickArray[d.events[0].toString().split(/:|-/, 1)]) {

          if (nData.sel) {
            // PUSHES MOUSED OVER TOPICS TO THE FRONT
            // FIX!!!
            svgBins.push(cData(nData, key));
          } else {
            svgBins.unshift(cData(d, key));
          }
        });
      });
      return _react["default"].createElement("g", {
        ref: "svgBins"
      }, svgBins);
    }
  }, {
    key: "render",
    value: function render() {
      var renderEl = null;

      if (this.props.timeBins.length <= 0) {
        console.log('probably no data');
        renderEl = _react["default"].createElement("g", null);
      } else {
        renderEl = this.topics = this.renderTopics(this.props); // renderEl = this.moveTopics()
      }

      return renderEl;
    }
  }]);

  return TopicFlow;
}(_react["default"].Component);

TopicFlow.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.1,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: [],
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  onBarClick: function onBarClick() {} // These Properties need to be declared for the linter
  // When we start using this we will revisit
  // TopicFlow.propTypes = {
  //   loading: PropTypes.bool,
  //   padding: PropTypes.number.isRequired,
  //   outerPadding: PropTypes.number.isRequired,
  //   data: PropTypes.any.isRequired,
  //   status: PropTypes.string,
  //   chartHeight: PropTypes.number.isRequired,
  //   chartWidth: PropTypes.number.isRequired,
  //   numTData: PropTypes.number.isRequired,
  //   barHeight: PropTypes.number.isRequired,
  //   maxTopics: PropTypes.number.isRequired,
  //   colorDomain: PropTypes.array,
  //   lineType: PropTypes.string.isRequired,
  //   clickArray: PropTypes.any.isRequired,
  //   onEnter: PropTypes.func,
  //   onLeave: PropTypes.func,
  //   onBarClick: PropTypes.func,
  //   timeBins: PropTypes.array,
  //   links: PropTypes.array
  // }

};
TopicFlow.propTypes = {
  lineType: _propTypes["default"].string.isRequired,
  clickArray: _propTypes["default"].any.isRequired,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  onBarClick: _propTypes["default"].func,
  timeBins: _propTypes["default"].array
};
var _default = TopicFlow;
exports["default"] = _default;