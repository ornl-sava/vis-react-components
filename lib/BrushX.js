'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BrushX = function (_React$Component) {
  _inherits(BrushX, _React$Component);

  function BrushX(props) {
    _classCallCheck(this, BrushX);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BrushX).call(this, props));

    _this.selection = null;
    _this.state = {
      selection: _this.selection
    };
    return _this;
  }

  _createClass(BrushX, [{
    key: '_brush',
    value: function _brush() {
      this.applySelection();
    }
  }, {
    key: '_end',
    value: function _end() {
      if (this.state.selection !== this.selection) {
        this.setState({ selection: this.selection });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
        this.count = 0;
        var thisNode = (0, _reactDom.findDOMNode)(this);
        var selection = (0, _d.select)(thisNode);
        this.brush = (0, _d.brushX)().handleSize(3).extent([[0, 0], [this.props.width, this.props.height]]).on('brush', this._brush.bind(this)).on('end', this._end.bind(this));
        selection.call(this.brush);
      }
    }
  }, {
    key: 'applySelection',
    value: function applySelection() {
      if (_d.event.sourceEvent.type === 'brush') return;
      var domain = this.calculateSelection(_d.event.selection.map(this.props.scale.invert));
      var thisNode = (0, _reactDom.findDOMNode)(this);
      (0, _d.select)(thisNode).call(this.brush.move, domain.map(this.props.scale));
      this.selection = domain;
    }
  }, {
    key: 'calculateSelection',
    value: function calculateSelection(domain) {
      var dateScale = /time/.test(this.props.scale.type);
      if (dateScale) {
        domain[0] = domain[0].getTime();
        domain[1] = domain[1].getTime();
      }
      var interval = this.props.children[1].props.children[0].props.data.x - this.props.children[0].props.children[0].props.data.x;
      var range = this.props.children.reduce(function (prev, current) {
        var xVal = dateScale ? current.props.children[0].props.data.x.getTime() : current.props.children[0].props.data.x;
        var begin = prev[0] >= xVal && prev[0] < xVal + interval ? xVal : prev[0];
        var end = prev[1] > xVal && prev[1] < xVal + interval ? xVal : prev[1];
        if (begin === end) {
          end += interval;
        }
        return [new Date(begin), new Date(end)];
      }, domain);
      return range;
    }
  }, {
    key: 'render',
    value: function render() {
      // console.log('brush selection is : ' + this.state.selection)
      return _react2.default.createElement(
        'g',
        { className: 'brush' },
        this.props.children
      );
    }
  }]);

  return BrushX;
}(_react2.default.Component);

BrushX.defaultProps = {};

BrushX.propTypes = {
  children: _react.PropTypes.node,
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  scale: _react.PropTypes.func.isRequired
};

exports.default = BrushX;