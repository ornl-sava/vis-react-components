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

var ForceDirectedNode = function (_React$Component) {
  _inherits(ForceDirectedNode, _React$Component);

  function ForceDirectedNode(props) {
    _classCallCheck(this, ForceDirectedNode);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ForceDirectedNode).call(this, props));

    _this.onClick = _this._onClick.bind(_this);
    _this.onMouseEnter = _this._onMouseEnter.bind(_this);
    _this.onMouseDown = _this._onMouseDown.bind(_this);
    return _this;
  }

  _createClass(ForceDirectedNode, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._onMouseLeave();
    }
  }, {
    key: '_onClick',
    value: function _onClick(event) {
      if (this.props.tooltipData) {
        // console.log('click')
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
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      if (this.props.tooltipData) {
        var newEvent = new MouseEvent('mousedown', event);
        if (this.props.brushed) {
          var target = (0, _d.select)('.selection');
          var leftMargin = (0, _d.select)('.overlay').node().getBoundingClientRect().left;
          var selectionWidth = parseFloat(target.attr('width'));
          var min = parseFloat(target.attr('x')) + leftMargin;
          var max = parseFloat(target.attr('x')) + selectionWidth + leftMargin;
          // console.log('min: ' + min + ', max: ' + max)
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
      var y = _props.y;
      var x = _props.x;

      return _react2.default.createElement('circle', {
        className: 'circle',
        id: this.props.radius,
        r: this.props.radius,
        cx: x,
        cy: y,
        fill: this.props.color
      });
    }
  }]);

  return ForceDirectedNode;
}(_react2.default.Component);

ForceDirectedNode.defaultProps = {
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

ForceDirectedNode.propTypes = {
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
  style: _react.PropTypes.object,
  radius: _react.PropTypes.number,
  color: _react.PropTypes.string
};

exports.default = ForceDirectedNode;