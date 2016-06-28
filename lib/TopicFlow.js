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
// import Bar from './Bar'


var lineMaker = _d2.default.svg.line().x(function (d) {
  return d.x;
}).y(function (d) {
  return d.y;
});

var diagMaker = _d2.default.svg.diagonal().source(function (d) {
  return { 'x': d[0].y, 'y': d[0].x };
}).target(function (d) {
  return { 'x': d[1].y, 'y': d[1].x };
}).projection(function (d) {
  return [d.y, d.x];
});

var TopicFlow = function (_React$Component) {
  _inherits(TopicFlow, _React$Component);

  _createClass(TopicFlow, [{
    key: '_onEnter',

    // grabbing onEnter and Leave functions from chart and making new set of rules
    value: function _onEnter(toolTipData, svgElement) {
      var props = this.props;
      props.onEnter(toolTipData, svgElement);
      this.setState({ selectedTopics: toolTipData.label });
    }
  }, {
    key: '_onLeave',
    value: function _onLeave(toolTipData, svgElement) {
      var props = this.props;
      props.onLeave(toolTipData, svgElement);
      this.setState({ selectedTopics: [] });
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      // I thought I could call the other onClick and do something with it
      // but I wouldn't know when to call this to call the other one...
    }
  }]);

  function TopicFlow(props) {
    _classCallCheck(this, TopicFlow);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TopicFlow).call(this, props));

    _this.state = {
      dataUp: 0,
      currentID: [],
      selectedTopics: []
    };
    _this.onEnter = _this._onEnter.bind(_this);
    _this.onLeave = _this._onLeave.bind(_this);
    _this.statArr = [];
    _this.prefScale = _d2.default.scale.category20();
    _this.bins = [];
    _this.lineData = [];
    _this.barData = [];
    return _this;
  }

  _createClass(TopicFlow, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.data.length <= 0) {
        console.log('probNoDataWillRProps');
        this.setState({ dataUp: 1 });
      }
      console.log('sCU');
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
      console.log(xDomain);
      this.props.xScale.domain(xDomain);
      this.props.yScale.domain([nextProps.maxTopics + 2, 0.00001]);
      this.statArr = new Array(nextProps.data.length);
      for (var i = 0; i < nextProps.data.length; i++) {
        this.statArr[i] = new Array(nextProps.data[i].length);
      }
      // console.log('statArr' + this.statArr)
      this.prefScale.domain(nextProps.colorDomain);
      // console.log('topFlowPref', nextProps.colorDomain)
      // console.log('nProps', nextProps)
      this.bins = this.initTopics(nextProps);
      console.log('wRP', this.barData);
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
      var barWidth = Math.ceil(paddedWidth / (props.numTData + props.outerPadding * 2));
      var barHeight = 20;
      var barData = [];
      var lineData = [];
      // let selLines = []
      // just checking if ordinal without checking
      // might not need to do this, assuming it's always ordinal
      if (typeof props.xScale.rangePoints === 'function') {
        props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding);
      }
      // console.log('init')
      var svgTopicBars = props.data.map(function (dataArr, index) {
        return dataArr.map(function (data, i) {
          if (data[0] == null) {
            data[0] = 'EMPTY';
          }
          // use yScale if want them all starting at top
          var posY = _this2.props.yScale(i);
          // use this if want them uniformly spread
          // let posY = this.props.chartHeight / dataArr.length * i
          var posX = props.xScale(index);
          var fontSize = 12;
          // It seems like class name does not like :
          var cName = data[0].toString().split(/:|-/, 1) + '-' + i.toString();
          // check to see if same topic in previous timeSteps
          var dataMatch = [];
          if (index + 1 < props.data.length) {
            for (var k in props.data[index + 1]) {
              // if (!this.props.data[index + 1].hasOwnProperty(k)) continue
              if (props.data[index + 1][k][0] === data[0]) {
                dataMatch = [{ x: posX + barWidth, y: posY + barHeight / 2 }, { x: props.xScale(index + 1), y: _this2.props.yScale(k) + barHeight / 2 }];
                // next topic happened
                _this2.statArr[index + 1][k] = ' happened';
                // if current topic happened
                if (_this2.statArr[index][i] === ' happened') {
                  _this2.statArr[index][i] = ' continue';
                } else {
                  _this2.statArr[index][i] = ' enter';
                }
              }
            }
            // if no match made then the topic is exiting
            if (_this2.statArr[index][i] !== ' continue' && _this2.statArr[index][i] !== ' enter') {
              _this2.statArr[index][i] = ' exit';
            }
          }
          // assuming the first batch of topics are entering...
          /* if (index === 0) {
            stat = ' enter'
            this.statArr[index][i] = ' enter'
          } */
          var topicColor = { stroke: _this2.prefScale(data[0].split(/:|-/, 1)[0]) };
          var linePath = function linePath() {
            if (dataMatch[0] != null) {
              if (_this2.props.lineType === 'curved') {
                return diagMaker(dataMatch);
              } else {
                lineMaker(dataMatch);
              }
            } else {
              return null;
            }
          };
          cName += _this2.statArr[index][i];
          if (_this2.state.currentID === data[0]) {
            cName += ' Selected';
            topicColor = { stroke: '#e67300' };
          }
          // eventually might want to check if style sheet is handling this
          var text = _this2.trimText(data[0], barWidth, fontSize);
          var barTxtStyle = _this2.buildAText(fontSize.toString() + 'px', 'black');
          var bar = _this2.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle);
          bar.tooltipData = { label: bar.data[0], counts: bar.data.length };
          barData.push(bar);
          lineData.push(linePath());
        });
      });
      // init gets called twice, can't do this.barData.push in the mapping loop
      // because it'll be twice as long as necessary
      this.barData = barData;
      this.lineData = lineData;
      return svgTopicBars;
    }
  }, {
    key: 'renderTopics',
    value: function renderTopics() {
      var _this3 = this;

      var svgBins = [];
      var newData = JSON.parse(JSON.stringify(this.barData));
      console.log(newData[1]);

      var _loop = function _loop(i) {
        var key = 'bar-' + i;
        var nData = [];
        if (_this3.state.selectedTopics[0] != null) {
          if (_this3.state.selectedTopics.toString() === _this3.barData[i].data[0].toString()) {
            nData = JSON.parse(JSON.stringify(_this3.barData[i]));
            nData.sel = true;
            nData.barStyle.stroke = '#00ccff';
            nData.barStyle.strokeWidth = 8;
          }
        }
        var cData = function cData(data) {
          return _react2.default.createElement(
            'g',
            { className: 'bin', key: key },
            _react2.default.createElement(_TextBar2.default, _extends({}, data, { onEnter: _this3.onEnter, onLeave: _this3.onLeave })),
            _react2.default.createElement('path', { className: data.data[0] + ' lineMatch -' + i, d: _this3.lineData[i], style: data.barStyle })
          );
        };
        if (_this3.props.clickArray[_this3.barData[i].data[0].toString().split(/:|-/, 1)]) {
          if (nData.sel) {
            svgBins.push(cData(nData));
          } else {
            svgBins.unshift(cData(_this3.barData[i]));
          }
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
      // console.log('renderChartHeight', this.props.chartHeight)
      // console.log('renderHeight', this.props.height)
      console.log('dataLength', this.props.data.length);
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

  return TopicFlow;
}(_react2.default.Component);

TopicFlow.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  width: 400,
  height: 250,
  rangePadding: 25,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: []
};

TopicFlow.propTypes = {
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
  statArr: _react.PropTypes.array,
  colorDomain: _react.PropTypes.array,
  colorScale: _react.PropTypes.func,
  lineType: _react.PropTypes.string.isRequired,
  clickArray: _react.PropTypes.array.isRequired
};

exports.default = TopicFlow;