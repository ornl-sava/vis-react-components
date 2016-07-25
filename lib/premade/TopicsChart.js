'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('../util/react');

var _Chart = require('../Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _TopicFlow = require('../TopicFlow');

var _TopicFlow2 = _interopRequireDefault(_TopicFlow);

var _ColorView = require('../ColorView');

var _ColorView2 = _interopRequireDefault(_ColorView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var maxNumTopics = 60;
var hTop = maxNumTopics * (20 + 15);

var TopicsChart = function (_React$Component) {
  _inherits(TopicsChart, _React$Component);

  function TopicsChart(props) {
    _classCallCheck(this, TopicsChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TopicsChart).call(this, props));

    _this.state = {
      data: [],
      clickArray: []
    };
    _this.onGroupClick = _this._onGroupClick.bind(_this);
    _this.onClick = _this._onBarClick;
    _this.topicData = [];
    return _this;
  }

  _createClass(TopicsChart, [{
    key: '_onGroupClick',
    value: function _onGroupClick(toggleList) {
      var _this2 = this;

      // takes toggle list and updates clickArray state
      // console.log('toggleList', toggleList)
      this.setState({ clickArray: toggleList }, function () {
        _this2.refs.updateChart.forceUpdate();
        _this2.refs.updateChart2.forceUpdate();
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      // console.log('topicData', topicData)
      return true;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var setClickArr = {};
      for (var i = 0; i < this.props.colorDomain.length; i++) {
        setClickArr[this.props.colorDomain[i]] = true;
      }
      this.setState({ clickArray: setClickArr });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement('text', { className: 'top' }),
        _react2.default.createElement(
          _Chart2.default,
          _extends({ className: 'col-md-2', ref: 'updateChart2' }, (0, _react3.spreadRelated)(_Chart2.default, props), { tipFunction: this.toolTipFunction, yAxis: false, xAxis: false, xScaleType: 'linear', height: 600 }),
          _react2.default.createElement(_ColorView2.default, _extends({}, props, { clickArray: this.state.clickArray, ref: 'colorView', onBarClick: this.onGroupClick }))
        ),
        _react2.default.createElement(
          _Chart2.default,
          _extends({ className: 'col-md-10', ref: 'updateChart' }, (0, _react3.spreadRelated)(_Chart2.default, props), { tipFunction: this.toolTipFunction, yAxis: false, xAxis: false, xScaleType: 'linear', height: hTop }),
          _react2.default.createElement(_TopicFlow2.default, _extends({}, props, { clickArray: this.state.clickArray }))
        ),
        _react2.default.createElement('text', { className: 'bottom' })
      );
    }
  }]);

  return TopicsChart;
}(_react2.default.Component);

TopicsChart.defaultProps = _extends({
  url: '',
  numTData: 7,
  maxTopics: maxNumTopics,
  colorDomain: [],
  adjacencyList: {},
  tipFunction: function tipFunction() {
    return null;
  },
  data: []
}, _Chart2.default.defaultProps);
TopicsChart.propTypes = _extends({
  numTData: _react.PropTypes.number,
  maxTopics: _react.PropTypes.number,
  url: _react.PropTypes.string,
  colorDomain: _react.PropTypes.array,
  adjacencyList: _react.PropTypes.array,
  tipFunction: _react.PropTypes.func,
  data: _react.PropTypes.array
}, _Chart2.default.propTypes);

exports.default = TopicsChart;