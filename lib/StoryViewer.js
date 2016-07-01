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

var _stories = require('../examples/data/for-hci/stories.json');

var _stories2 = _interopRequireDefault(_stories);

var _enduringTopicsListed = require('../examples/data/for-hci/enduring-topics-listed.json');

var _enduringTopicsListed2 = _interopRequireDefault(_enduringTopicsListed);

var _hourlyTopicsListed = require('../examples/data/for-hci/hourly-topics-listed.json');

var _hourlyTopicsListed2 = _interopRequireDefault(_hourlyTopicsListed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Bar from './Bar'


/* const lineMaker = d3.svg.line()
  .x((d) => {
    return d.x
  })
  .y((d) => {
    return d.y
  }) */

var diagMaker = _d2.default.svg.diagonal().source(function (d) {
  return { 'x': d[0].y, 'y': d[0].x };
}).target(function (d) {
  return { 'x': d[1].y, 'y': d[1].x };
}).projection(function (d) {
  return [d.y, d.x];
});

var StoryViewer = function (_React$Component) {
  _inherits(StoryViewer, _React$Component);

  _createClass(StoryViewer, [{
    key: '_onEnter',

    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {
      var props = this.props;
      props.onEnter(toolTipData, svgElement);
      // this.setState({selectedTopics: toolTipData.label})
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(toolTipData, svgElement) {
      var props = this.props;
      props.onLeave(toolTipData, svgElement);
      // this.setState({selectedTopics: []})
    }
  }, {
    key: '_onClick',
    value: function _onClick(tooltipData) {
      // show event list
      console.log(tooltipData);
      this.setState({ currentID: tooltipData.label });
    }
  }]);

  function StoryViewer(props) {
    _classCallCheck(this, StoryViewer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StoryViewer).call(this, props));

    _this.state = {
      dataUp: 0,
      currentID: [],
      selectedTopics: []
    };
    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.onClick = _this._onClick.bind(_this);
    _this.statArr = [];
    _this.prefScale = _d2.default.scale.category20();
    _this.bins = [];
    _this.lineData = [];
    _this.barData = [];
    _this.tType = ['hrCurr-', 'endCurr-', 'endPrev-'];
    return _this;
  }

  _createClass(StoryViewer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.data.length <= 0) {
        console.log('SVprobNoDataWillRProps');
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
      var xDomain = [0, 1, 2, 3];
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
      var barWidth = Math.ceil(paddedWidth / (4 + props.outerPadding * 2));
      var barHeight = 20;
      // let lineData = []
      var storyInd = 0;
      // console.log('storyData0', storyData[0])
      // setting current story
      var currStory = _stories2.default[storyInd];
      props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding);
      var timeStepBars = [];
      // setting up data for (ex: hr[01], end[01]. end[00])
      var currData = [];
      currData[0] = _hourlyTopicsListed2.default[storyInd + 1];
      currData[1] = _enduringTopicsListed2.default[storyInd + 1];
      currData[2] = _enduringTopicsListed2.default[storyInd + 0];
      // cycling through data for particular story index

      var _loop = function _loop(k) {
        // making bar data for each data set
        var currBars = Object.keys(currData[k]).map(function (i) {
          var data = currData[k][i];
          if (data[0] == null) {
            data[0] = 'EMPTY';
          }
          var posY = _this2.props.chartHeight / Object.keys(currData[k]).length * i;
          var posX = props.xScale(k);
          var fontSize = 12;
          var cName = _this2.tType[k] + (storyInd + 1).toString() + '-index-' + i;
          var topicColor = { stroke: _this2.prefScale(data[0].split(/:|-/, 1)[0]) };
          var text = _this2.trimText(data[0], barWidth, fontSize);
          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
          var bar = _this2.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle);
          // console.log('bData', bar)
          bar.tooltipData = { label: cName, counts: bar.data.length };
          return bar;
        });
        // adding bar data to all bar data
        timeStepBars.push(currBars);
      };

      for (var k = 0; k < 3; k++) {
        _loop(k);
      }
      // dataMatch = [{x: posX + barWidth, y: posY + barHeight / 2}, {x: props.xScale(index + 1), y: this.props.yScale(k) + barHeight / 2}]
      this.barData = timeStepBars;
      var midBar = barHeight / 2;
      // console.log('keys', Object.keys(currStory))
      var lineData = Object.keys(currStory).map(function (i) {
        var data = currStory[i];
        var endCurr = timeStepBars[1][i];
        var matchBar = [];
        return data.map(function (arr, index) {
          var dataMatch = [];
          for (var j = 0; j < data.length; j++) {
            if (arr[0] === 0) {
              matchBar = timeStepBars[2][arr[1]];
              dataMatch = [{ x: endCurr.x + barWidth, y: endCurr.y + midBar }, { x: matchBar.x, y: matchBar.y + midBar }];
            } else if (arr[0] === 1) {
              matchBar = timeStepBars[0][arr[1]];
              dataMatch = [{ x: endCurr.x, y: endCurr.y + midBar }, { x: matchBar.x + barWidth, y: matchBar.y + midBar }];
            }
          }
          return diagMaker(dataMatch);
        });
      });
      // console.log('lineData', lineData)
      this.lineData = lineData;
    }
  }, {
    key: 'renderTopics',
    value: function renderTopics() {
      var _this3 = this;

      var svgBins = this.barData.map(function (array, index) {
        return array.map(function (data, i) {
          var key = 'bar-' + i + index;
          return _react2.default.createElement(
            'g',
            { key: key },
            _react2.default.createElement(_TextBar2.default, _extends({}, data, { onEnter: _this3.onEnter, onLeave: _this3.onLeave, onClick: _this3.onClick }))
          );
        });
      });
      var svgLines = this.lineData.map(function (array, index) {
        return array.map(function (data, i) {
          var key = 'line-' + index + i;
          return _react2.default.createElement(
            'g',
            { key: key },
            _react2.default.createElement('path', { className: ' lineMatch -' + index + i, d: array, style: { stroke: 'grey' } })
          );
        });
      });
      var currIndex = this.state.currentID.toString().split(/-/);
      // can put a if statement here...to skip this should the index be empty
      var currData = [];
      var dataI = [];
      if (currIndex[0] === 'hrCurr') {
        dataI = 0;
        currData = _hourlyTopicsListed2.default[currIndex[1]][currIndex[3]];
      } else if (currIndex[0] === 'endPrev' || currIndex[0] === 'endCurr') {
        if (currIndex[0] === 'endPrev') {
          dataI = 1;
        } else {
          dataI = 2;
        }
        currData = _enduringTopicsListed2.default[currIndex[1]][currIndex[3]];
      }
      var info = currData.map(function (data, index) {
        return _react2.default.createElement(
          'text',
          { fontSize: '30px', x: _this3.props.xScale(3) + 10, y: 100 + (_this3.props.chartHeight - 100) / 3 * dataI + 50 + index * 50 },
          data
        );
      });
      // console.log('this.tType', this.tType[0])
      var svgInfo = [];
      for (var i = 0; i < 3; i++) {
        svgInfo[i] = _react2.default.createElement(
          'g',
          { key: 'view' + i },
          _react2.default.createElement(
            'text',
            { fontSize: '100px', x: this.props.xScale(3), y: 100 + (this.props.chartHeight - 100) / 3 * i },
            this.tType[i].toString()
          ),
          info
        );
      }
      // {svgLines}
      return _react2.default.createElement(
        'g',
        { className: 'bin' },
        svgLines,
        svgBins,
        svgInfo
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
        renderEl = this.renderTopics();
      }
      return renderEl;
    }
  }]);

  return StoryViewer;
}(_react2.default.Component);

StoryViewer.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved'
};

StoryViewer.propTypes = {
  className: _react.PropTypes.string.isRequired,
  loading: _react.PropTypes.bool,
  padding: _react.PropTypes.number.isRequired,
  outerPadding: _react.PropTypes.number.isRequired,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  data: _react.PropTypes.any,
  status: _react.PropTypes.string,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  barHeight: _react.PropTypes.number.isRequired,
  maxTopics: _react.PropTypes.number.isRequired,
  colorDomain: _react.PropTypes.array,
  lineType: _react.PropTypes.string.isRequired
};

exports.default = StoryViewer;