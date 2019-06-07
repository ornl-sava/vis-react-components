"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react2 = require("../util/react");

var _Chart = _interopRequireDefault(require("../Chart"));

var _TopicFlow = _interopRequireDefault(require("../TopicFlow"));

var _ColorView = _interopRequireDefault(require("../ColorView"));

var _Tooltip = _interopRequireDefault(require("../Tooltip"));

var _d = require("d3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var maxNumTopics = 60;
var hTop = maxNumTopics * (20 + 15);

var toolTipFunction = function toolTipFunction(data) {
  var toolTip = '<span class="title">TopicID: ' + data.topic + '</span>' + '</span>Number of Common Events: ' + (0, _d.format)(',')(data.events.length) + '<br /><small>';
  return toolTip;
};

var TopicsChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TopicsChart, _React$Component);

  function TopicsChart(props) {
    var _this;

    _classCallCheck(this, TopicsChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TopicsChart).call(this, props));
    _this.state = {
      data: [],
      clickArray: []
    };
    _this.onGroupClick = _this._onGroupClick.bind(_assertThisInitialized(_this));
    _this.onClick = _this._onBarClick;
    _this.topicData = [];
    _this.tip = toolTipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(toolTipFunction) : toolTipFunction;
    _this.onBarEnter = _this._onBarEnter.bind(_assertThisInitialized(_this));
    _this.onBarLeave = _this._onBarLeave.bind(_assertThisInitialized(_this));
    _this.height = hTop;
    return _this;
  }

  _createClass(TopicsChart, [{
    key: "_onGroupClick",
    value: function _onGroupClick(toggleList) {
      // takes toggle list and updates clickArray state
      // console.log('toggleList', toggleList)
      this.setState({
        clickArray: toggleList
      });
    }
  }, {
    key: "_onBarEnter",
    value: function _onBarEnter(event, data) {
      this.tip.show(event, data);
    }
  }, {
    key: "_onBarLeave",
    value: function _onBarLeave(event, data) {
      this.tip.hide(event, data);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      // console.log('topicData', topicData)
      return true;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var setClickArr = {};

      for (var i = 0; i < this.props.colorDomain.length; i++) {
        setClickArr[this.props.colorDomain[i]] = true;
      }

      this.setState({
        clickArray: setClickArr
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      return true;
    }
  }, {
    key: "sort",
    value: function sort(props) {
      var barHeight = 20;
      var longest = 0;
      props.timeBins.map(function (data, index) {
        if (data.topics.length > longest) {
          longest = data.topics.length;
        }

        data.topics.sort(function (a, b) {
          return b[props.sortAccessor] - a[props.sortAccessor];
        });
      }); // console.log('l', longest)

      this.height = longest * (barHeight * 1.6);
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      this.sort(props);
      return _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("text", {
        className: "top"
      }), _react["default"].createElement(_Chart["default"], _extends({
        className: "colorView col-md-2",
        ref: "updateChart2"
      }, (0, _react2.spreadRelated)(_Chart["default"], props), {
        yAxis: false,
        xAxis: false,
        xScaleType: "linear",
        height: 600
      }), _react["default"].createElement(_ColorView["default"], _extends({}, props, {
        clickArray: this.state.clickArray,
        ref: "colorView",
        onBarClick: this.onGroupClick
      }))), _react["default"].createElement(_Chart["default"], _extends({
        className: "topicFlow col-md-10",
        ref: "updateChart"
      }, (0, _react2.spreadRelated)(_Chart["default"], props), {
        yAxis: false,
        xAxis: false,
        xScaleType: "linear",
        height: this.height,
        margin: {
          top: 20,
          right: 20,
          bottom: 10,
          left: 20
        }
      }), _react["default"].createElement(_TopicFlow["default"], _extends({}, props, {
        clickArray: this.state.clickArray,
        onEnter: this.onBarEnter,
        onLeave: this.onBarLeave
      }))), _react["default"].createElement("text", {
        className: "bottom"
      }));
    }
  }]);

  return TopicsChart;
}(_react["default"].Component);

TopicsChart.defaultProps = _objectSpread({
  url: '',
  numTData: 7,
  maxTopics: maxNumTopics,
  colorDomain: [],
  tipFunction: function tipFunction() {
    return null;
  },
  data: [],
  topicBins: [],
  sortAccessor: 'avg_composite_score',
  sortType: 'ascending',
  onBarClick: function onBarClick() {}
}, _Chart["default"].defaultProps);
TopicsChart.propTypes = _objectSpread({
  numTData: _propTypes["default"].number,
  maxTopics: _propTypes["default"].number,
  url: _propTypes["default"].string,
  colorDomain: _propTypes["default"].array,
  tipFunction: _propTypes["default"].func,
  data: _propTypes["default"].array,
  topicBins: _propTypes["default"].array,
  sortAccessor: _propTypes["default"].string,
  sortType: _propTypes["default"].string,
  onBarClick: function onBarClick() {}
}, _Chart["default"].propTypes);
var _default = TopicsChart;
exports["default"] = _default;