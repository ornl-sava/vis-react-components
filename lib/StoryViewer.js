"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d = require("./util/d3");

var d3 = _interopRequireWildcard(require("d3"));

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

var diagMaker = function diagMaker(d) {
  return 'M' + d[0].x + ',' + d[0].y + 'C' + (d[0].x + d[1].x) / 2 + ',' + d[0].y + ' ' + (d[0].x + d[1].x) / 2 + ',' + d[1].y + ' ' + d[1].x + ',' + d[1].y;
};

var StoryViewer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StoryViewer, _React$Component);

  _createClass(StoryViewer, [{
    key: "_onEnter",
    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {
      var props = this.props;
      props.onEnter(toolTipData, svgElement); // this.setState({selectedTopics: toolTipData.label})
    }
  }, {
    key: "_onLeave",
    value: function _onLeave(toolTipData, svgElement) {
      var props = this.props;
      props.onLeave(toolTipData, svgElement); // this.setState({selectedTopics: []})
    }
  }, {
    key: "_onClick",
    value: function _onClick(tooltipData) {
      // resetting topic info
      var newID = new Array(3);
      var dataInd = tooltipData.dataInd,
          index = tooltipData.index; // getting topic information for clicked topic
      // newID[dataInd] = this.currData[dataInd][index]

      newID[dataInd] = parseFloat(index); // getting topic information of related topics

      this.barData[dataInd][index].story.map(function (sData) {
        // newID[sData.dataInd] = this.currData[sData.dataInd][sData.index]
        newID[sData.dataInd] = parseFloat(sData.index);
      }); // re-render with new topic info

      this.setState({
        currentID: newID
      });
    }
  }, {
    key: "_onMoveClick",
    value: function _onMoveClick(tooltipData) {
      //  console.log('moveClick', tooltipData)
      var sIndex = 0;

      if (tooltipData.label === 'back') {
        if (this.state.storyInd !== 0) {
          sIndex = this.state.storyInd - 1;
        } else {
          sIndex = this.props.storyData.length - 1;
        }
      } else if (tooltipData.label === 'forward') {
        if (this.state.storyInd !== this.props.storyData.length - 1) {
          sIndex = this.state.storyInd + 1;
        } else {
          sIndex = 0;
        }
      }

      this.initTopics(this.props, sIndex);
      this.setState({
        storyInd: sIndex,
        currentID: new Array(3)
      });
    }
  }]);

  function StoryViewer(props) {
    var _this;

    _classCallCheck(this, StoryViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StoryViewer).call(this, props));
    _this.state = {
      dataUp: 0,
      storyInd: 0,
      currentID: new Array(3),
      selectedTopics: []
    };
    _this.xScale = (0, _d.setScale)('band');
    _this.yScale = (0, _d.setScale)('band');
    _this.prefScale = d3.scaleOrdinal(d3.schemeCategory20);
    _this.updateDR = _this.updateDR.bind(_assertThisInitialized(_this));

    _this.updateDR(props);

    _this.onEnter = _this._onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this._onLeave.bind(_assertThisInitialized(_this));
    _this.onClick = _this._onClick.bind(_assertThisInitialized(_this));
    _this.onMoveClick = _this._onMoveClick.bind(_assertThisInitialized(_this));
    _this.lineData = [];
    _this.barData = [];
    _this.tType = ['hour-Curr-', 'enduring-Curr-', 'enduring-Prev-'];
    _this.currStory = [];
    _this.currData = [];

    _this.initTopics(props, 0);

    return _this;
  }

  _createClass(StoryViewer, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true; // return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextState.storyInd !== this.state.storyInd) {
        console.log('letting you know');
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updateDR(nextProps);
      this.initTopics(nextProps, 0);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {} // console.log('willMountChartHeight', this.props.chartHeight)
    // React LifeCycle method - called after initial render

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "updateDR",
    value: function updateDR(props) {
      // let xDomain = [0, 1, 2, 3]
      this.xScale.domain(d3.range(0, 4, 1)).range([0, props.chartWidth]);
      this.yScale.domain(d3.range(props.maxTopics + 2, -1, -1)).range([0, props.chartHeight]);
      this.prefScale.domain(props.colorDomain);
    }
  }, {
    key: "buildABar",
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
    value: function initTopics(props, storyInd) {
      var _this2 = this;

      this.xScale.rangeRound([0, props.chartWidth]);
      this.xScale.padding(props.padding);
      var paddedWidth = props.chartWidth * (1 - props.padding).toFixed(2);
      var barWidth = Math.ceil(paddedWidth / (4 + props.outerPadding * 2));
      barWidth = this.xScale.bandwidth();
      var barHeight = 10; // let lineData = []
      // console.log('storyData0', storyData[0])
      // setting current story

      this.currStory = this.props.storyData[storyInd];
      var timeStepBars = []; // setting up data for (ex: hr[01], end[01]. end[00])

      this.currData[0] = this.props.hrTopics[storyInd + 1];
      this.currData[1] = this.props.eTopics[storyInd + 1];
      this.currData[2] = this.props.eTopics[storyInd + 0]; // cycling through data for particular story index

      var _loop = function _loop(k) {
        // making bar data for each data set
        var currBars = Object.keys(_this2.currData[k]).map(function (i) {
          var data = _this2.currData[k][i];

          if (data[0] == null) {
            data[0] = 'EMPTY';
          }

          var posY = _this2.props.chartHeight / Object.keys(_this2.currData[k]).length * i;

          var posX = _this2.xScale(k + 1);

          var fontSize = 12;
          var cName = _this2.tType[k] + (storyInd + 1).toString() + '-index-' + i; // let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}

          var topicColor = {
            stroke: 'black'
          };

          if (k === 0) {
            topicColor = {
              stroke: 'green'
            };
          } else if (k === 2) {
            topicColor = {
              stroke: 'purple'
            };
          } // console.log('tColor', topicColor)


          var text = _this2.trimText(data[0], barWidth, fontSize);

          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');

          var bar = _this2.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle); // console.log('bData', bar)


          bar.tooltipData = {
            label: cName,
            counts: bar.data.length,
            dataInd: k,
            index: i
          };
          return bar;
        }); // adding bar data to all bar data

        timeStepBars.push(currBars);
      };

      for (var k = 0; k < 3; k++) {
        _loop(k);
      } // dataMatch = [{x: posX + barWidth, y: posY + barHeight / 2}, {x: props.xScale(index + 1), y: this.props.yScale(k) + barHeight / 2}]


      this.barData = timeStepBars;
      var midBar = barHeight / 2; // console.log('keys', Object.keys(currStory))

      var lineData = Object.keys(this.currStory).map(function (i) {
        var data = _this2.currStory[i];
        var endCurr = timeStepBars[1][i];
        endCurr.story = [];
        var matchBar = [];
        return data.map(function (arr, index) {
          var dataMatch = [];

          if (arr[0] === 0) {
            // enduring (n-1)
            endCurr.story.push({
              dataInd: 2,
              index: arr[1]
            });
            endCurr.barStyle.stroke = 'purple';
            matchBar = timeStepBars[2][arr[1]];
            dataMatch = [{
              x: endCurr.x + barWidth,
              y: endCurr.y + midBar
            }, {
              x: matchBar.x,
              y: matchBar.y + midBar
            }];
          } else if (arr[0] === 1) {
            // hr (n)
            endCurr.story.push({
              dataInd: 0,
              index: arr[1]
            });
            endCurr.barStyle.stroke = 'green';
            matchBar = timeStepBars[0][arr[1]];
            dataMatch = [{
              x: endCurr.x,
              y: endCurr.y + midBar
            }, {
              x: matchBar.x + barWidth,
              y: matchBar.y + midBar
            }];
          }

          matchBar.story = [{
            dataInd: 1,
            index: parseFloat(i)
          }];

          if (index !== 0) {
            endCurr.barStyle.stroke = 'black';
            var story = endCurr.story;
            timeStepBars[story[0].dataInd][story[0].index].story.push(story[1]);
            matchBar.story.push(story[0]);
          }

          return diagMaker(dataMatch);
        });
      });
      this.lineData = lineData; // setting up time moving

      var moveLabels = ['back', 'forward'];
      var moveFontS = 20;
      var moveBH = moveFontS + 10;
      var moveStart = this.xScale(0) / 8;
      var moveBW = (this.xScale(0) - moveStart) / 3;
      var moveButt = moveLabels.map(function (label, i) {
        var data = label;
        var posY = 20;
        var posX = moveStart + i * (moveBW + 20);
        var cName = label;
        var color = {
          fill: 'grey',
          stroke: 'black' // console.log('tColor', topicColor)

        };
        var text = '';

        if (label === 'forward') {
          text = '>';
        } else {
          text = '<';
        }

        var barTxtStyle = _this2.buildAText(moveFontS.toString() + 'px', 'black');

        var bar = _this2.buildABar(data, cName, text, moveBH, moveBW, posX, posY, color, barTxtStyle); // console.log('bData', bar)


        bar.tooltipData = {
          label: cName,
          counts: 0
        };
        return _react["default"].createElement(_TextBar["default"], _extends({
          key: 'move' + label
        }, bar, {
          onClick: _this2.onMoveClick
        }));
      });
      this.moveBars = _react["default"].createElement("g", {
        key: 'movers'
      }, moveButt);
    }
  }, {
    key: "renderTopics",
    value: function renderTopics() {
      var _this3 = this;

      var svgBins = this.barData.map(function (array, index) {
        var bIndex = _this3.state.currentID[index];
        return array.map(function (data, i) {
          var key = 'bar-' + i + index;

          if (i === bIndex) {
            // do something
            console.log(bIndex);
          }

          return _react["default"].createElement("g", {
            key: key
          }, _react["default"].createElement(_TextBar["default"], _extends({}, data, {
            onEnter: _this3.onEnter,
            onLeave: _this3.onLeave,
            onClick: _this3.onClick
          })));
        });
      });
      var svgLines = this.lineData.map(function (array, index) {
        return array.map(function (data, i) {
          var key = 'line-' + index + i;
          return _react["default"].createElement("g", {
            key: key
          }, _react["default"].createElement("path", {
            className: ' lineMatch -' + index + i,
            d: array,
            style: {
              stroke: 'grey'
            }
          }));
        });
      });
      var svgInfo = [];

      var _loop2 = function _loop2(i) {
        var startPos = 100 + (_this3.props.chartHeight - 100) / 3 * i;

        var type = _this3.tType[i].toString().split(/-/, 1);

        if (i === 0 || i === 1) {
          type = type + (_this3.state.storyInd + 1).toString() + ': ';
        } else {
          type = type + _this3.state.storyInd.toString() + ': ';
        }

        var info = [];

        if (_this3.state.currentID[i] != null) {
          var text = _this3.currData[i][_this3.state.currentID[i]];
          info = text.map(function (data, index) {
            return _react["default"].createElement("text", {
              key: _this3.tType[i] + 'info-' + index,
              fontSize: "14px",
              x: _this3.xScale(0) / 8 + 10,
              y: startPos + 20 + index * 16
            }, data);
          });
        }

        svgInfo[i] = _react["default"].createElement("g", {
          key: 'view' + i
        }, _react["default"].createElement("text", {
          fontSize: "20px",
          x: _this3.xScale(0) / 8,
          y: startPos,
          style: {
            fontWeight: 'bold',
            textDecoration: 'underline'
          }
        }, type), info);
      };

      for (var i = 0; i < 3; i++) {
        _loop2(i);
      } // {svgLines}
      // {svgInfo}


      return _react["default"].createElement("g", {
        className: "bin"
      }, this.moveBars, svgLines, svgBins, svgInfo);
    } // gives text if loading data

  }, {
    key: "renderLoadAnimation",
    value: function renderLoadAnimation(props) {
      var chartWidth = props.chartWidth,
          chartHeight = props.chartHeight;
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

      return _react["default"].createElement("g", {
        className: "loading-message"
      }, _react["default"].createElement("text", {
        x: xPos,
        y: yPos
      }, messageText));
    }
  }, {
    key: "render",
    value: function render() {
      var renderEl = null;

      if (this.props.storyData.length <= 0) {
        console.log('probably no data');
        renderEl = this.renderLoadAnimation(this.props);
      } else {
        renderEl = this.renderTopics();
      }

      return renderEl;
    }
  }]);

  return StoryViewer;
}(_react["default"].Component);

StoryViewer.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  onEnter: function onEnter() {
    return null;
  },
  onLeave: function onLeave() {
    return null;
  } // These properties need to be declared for the linter
  // Commenting out until we need to use it
  // StoryViewer.propTypes = {
  //   loading: PropTypes.bool,
  //   padding: PropTypes.number.isRequired,
  //   outerPadding: PropTypes.number.isRequired,
  //   data: PropTypes.any,
  //   status: PropTypes.string,
  //   chartHeight: PropTypes.number.isRequired,
  //   chartWidth: PropTypes.number.isRequired,
  //   barHeight: PropTypes.number.isRequired,
  //   maxTopics: PropTypes.number.isRequired,
  //   colorDomain: PropTypes.array,
  //   lineType: PropTypes.string.isRequired,
  //   storyData: PropTypes.any,
  //   hrTopics: PropTypes.any,
  //   eTopics: PropTypes.any,
  //   onEnter: PropTypes.func,
  //   onLeave: PropTypes.func
  // }

};
StoryViewer.propTypes = {
  chartHeight: _propTypes["default"].number.isRequired,
  storyData: _propTypes["default"].any,
  hrTopics: _propTypes["default"].any,
  eTopics: _propTypes["default"].any
};
var _default = StoryViewer;
exports["default"] = _default;