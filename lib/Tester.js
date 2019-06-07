"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _stories = _interopRequireDefault(require("../examples/data/for-hci/stories.json"));

var _enduringTopicsListed = _interopRequireDefault(require("../examples/data/for-hci/enduring-topics-listed.json"));

var _hourlyTopicsListed = _interopRequireDefault(require("../examples/data/for-hci/hourly-topics-listed.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Tester =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tester, _React$Component);

  _createClass(Tester, [{
    key: "_onMouseEnter",
    value: function _onMouseEnter() {}
  }, {
    key: "_onMouseLeave",
    value: function _onMouseLeave() {}
  }]);

  function Tester(props) {
    var _this;

    _classCallCheck(this, Tester);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tester).call(this, props));
    _this.stories = _stories["default"];
    _this.endTopics = _enduringTopicsListed["default"];
    _this.hrTopics = _hourlyTopicsListed["default"];
    return _this;
  }

  _createClass(Tester, [{
    key: "componentWillUnmount",
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
    key: "render",
    value: function render() {
      var buttonProps = {
        width: '100%',
        height: '50px'
        /* console.log('storyLength', storyData.length)
        console.log('eTopics00,01', eTopics[0], eTopics[1])
        console.log('hrTopics00,01', hrTopics[0], hrTopics[1]) */
        // transform={'translate(' + (800) + ',' + 50 + ')'}

      };
      return _react["default"].createElement("div", {
        className: this.props.className
      }, _react["default"].createElement("button", {
        style: buttonProps
      }, "oo lala"), _react["default"].createElement("button", {
        style: buttonProps
      }, "oo lala 2"));
    }
  }]);

  return Tester;
}(_react["default"].Component);

Tester.defaultProps = {};
Tester.propTypes = {
  className: _propTypes["default"].string.isRequired
};
var _default = Tester;
exports["default"] = _default;