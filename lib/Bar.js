'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bar = function (_React$Component) {
  _inherits(Bar, _React$Component);

  function Bar(props) {
    _classCallCheck(this, Bar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bar).call(this, props));

    _this.onClick = _this._onClick.bind(_this);
    _this.onMouseEnter = _this._onMouseEnter.bind(_this);
    _this.onMouseDown = _this._onMouseDown.bind(_this);
    _this.onMouseLeave = _this._onMouseLeave.bind(_this);
    return _this;
  }

  _createClass(Bar, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._onMouseLeave) {
        this._onMouseLeave();
      }
    }
  }, {
    key: '_onClick',
    value: function _onClick(event) {
      if (this.props.brushed) return;
      if (this.props.tooltipData && this.props.data.y !== 0) {
        this.props.onClick(event, this.props.tooltipData);
      }
    }
  }, {
    key: '_onMouseEnter',
    value: function _onMouseEnter(event) {
      if (this.props.tooltipData) {
        this.props.onEnter(event, this.props.tooltipData);
      }
    }
  }, {
    key: '_onMouseLeave',
    value: function _onMouseLeave(event) {
      if (this.props.tooltipData) {
        this.props.onLeave(event, this.props.tooltipData);
      }
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      if (this.props.tooltipData) {
        // console.log('Bar :: mousedown')
        if (this.props.brushed) {
          var newEvent = new MouseEvent('mousedown', event);
          var target = (0, _d.select)('.selection');
          var leftMargin = (0, _d.select)('.overlay').node().getBoundingClientRect().left;
          var selectionWidth = parseFloat(target.attr('width'));
          var min = parseFloat(target.attr('x')) + leftMargin;
          var max = parseFloat(target.attr('x')) + selectionWidth + leftMargin;
          if (target.style('display') === 'none' || event.pageX < min || event.pageX > max) {
            target = (0, _d.select)('.overlay').node();
          } else {
            target = target.node();
          }
          target.dispatchEvent(newEvent);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var data = _props.data;
      var name = _props.name;
      var width = _props.width;
      var height = _props.height;
      var y = _props.y;
      var x = _props.x;
      var style = _props.style;

      className = className ? 'histogram-bar ' + className : 'histogram-bar';
      if (this.props.brushed) {
        className += ' brushed';
      }
      return _react2.default.createElement('rect', {
        className: className,
        'data-name': name,
        'data-x': data.x,
        'data-y': data.y,
        width: width,
        height: height,
        x: x,
        y: y,
        onClick: this.onClick,
        onMouseDown: this.onMouseDown,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        style: style
      });
    }
  }]);

  return Bar;
}(_react2.default.Component);

Bar.defaultProps = {
  brushed: false,
  height: 0,
  name: '',
  width: 0,
  onClick: function onClick() {
    return null;
  },
  tooltipData: null,
  y: 0,
  x: 0,
  style: {}
};

Bar.propTypes = {
  brushed: _react.PropTypes.bool.isRequired,
  className: _react.PropTypes.string,
  data: _react.PropTypes.object,
  height: _react.PropTypes.number.isRequired,
  name: _react.PropTypes.string,
  width: _react.PropTypes.number.isRequired,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tooltipData: _react.PropTypes.object,
  y: _react.PropTypes.number.isRequired,
  x: _react.PropTypes.number,
  style: _react.PropTypes.object
};

exports.default = Bar;