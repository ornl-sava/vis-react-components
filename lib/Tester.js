'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var Tester = function (_React$Component) {
  _inherits(Tester, _React$Component);

  _createClass(Tester, [{
    key: '_onMouseEnter',
    value: function _onMouseEnter() {}
  }, {
    key: '_onMouseLeave',
    value: function _onMouseLeave() {}
  }]);

  function Tester(props) {
    _classCallCheck(this, Tester);

    var _this = _possibleConstructorReturn(this, (Tester.__proto__ || Object.getPrototypeOf(Tester)).call(this, props));

    _this.stories = _stories2.default;
    _this.endTopics = _enduringTopicsListed2.default;
    _this.hrTopics = _hourlyTopicsListed2.default;
    return _this;
  }

  _createClass(Tester, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
    /* buildButton () {
      position:relative;
      transition: .5s ease;
      top: 191px;
      left: 420px;
      right: -420px;
      bottom: -191px;
    } */

  }, {
    key: 'render',
    value: function render() {
      var buttonProps = { width: '100%', height: '50px' };
      /* console.log('storyLength', storyData.length)
      console.log('eTopics00,01', eTopics[0], eTopics[1])
      console.log('hrTopics00,01', hrTopics[0], hrTopics[1]) */
      // transform={'translate(' + (800) + ',' + 50 + ')'}
      return _react2.default.createElement(
        'div',
        { className: this.props.className },
        _react2.default.createElement(
          'button',
          { style: buttonProps },
          'oo lala'
        ),
        _react2.default.createElement(
          'button',
          { style: buttonProps },
          'oo lala 2'
        )
      );
    }
  }]);

  return Tester;
}(_react2.default.Component);

Tester.defaultProps = {};

Tester.propTypes = {
  className: _react.PropTypes.string.isRequired
};

exports.default = Tester;