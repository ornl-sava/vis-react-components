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

    _this.brushSelection = props.brushSelection ? props.brushSelection : [];
    if (!props.brushSelection) {
      _this.state = {
        brushSelection: _this.brushSelection
      };
    }
    return _this;
  }

  _createClass(BrushX, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initBrush();
    }
  }, {
    key: 'initBrush',
    value: function initBrush() {
      var thisNode = (0, _reactDom.findDOMNode)(this);
      var selection = (0, _d.select)(thisNode);
      this.brush = (0, _d.brushX)().extent([[0, 0], [this.props.width, this.props.height]]).on('start', this._start.bind(this)).on('brush', this._brush.bind(this)).on('end', this._end.bind(this));
      selection.call(this.brush);
      this.setBrushDimensions();
    }
  }, {
    key: '_start',
    value: function _start() {
      this.applySelection();
    }
  }, {
    key: '_brush',
    value: function _brush() {
      this.applySelection();
    }
  }, {
    key: '_end',
    value: function _end() {
      var newSelection = this.brushSelection.toString();
      var oldSelection = this.props.brushSelection ? this.props.brushSelection.toString() : this.state.brushSelection.toString();
      if (newSelection !== oldSelection) {
        // console.log('Selected : ' + this.brushSelection.toString())
        this.props.onBrush(this.brushSelection);
        if (!this.props.brushSelection) {
          // console.log('Brush Selection not defined using state')
          this.setState({ brushSelection: this.brushSelection });
        }
      }
    }
    // shouldComponentUpdate (nextProps, nextState) {
    //   let props = this.props
    //   let thisSelection = props.brushSelection ? props.brushSelection : this.state.brushSelection
    //   let nextSelection = props.brushSelection ? nextProps.brushSelection : nextState.brushSelection
    //   if (thisSelection.toString() === nextSelection.toString() &&
    //       props.height === nextProps.height &&
    //       props.width === nextProps.width) {
    //     return false
    //   }
    //   return true
    // }
    // Normally we'd append a path to the handle <g>
    // but as of D3 v4 the handles is now a <rect>

  }, {
    key: 'setBrushDimensions',
    value: function setBrushDimensions() {
      // if (this.props.showHandles) {
      //   let h = this.props.height / 5
      //   let y = this.props.height / 2 - (h / 2)
      //   select(findDOMNode(this)).selectAll('.handle')
      //     .style('width', 7)
      //     .style('height', h)
      //     .style('y', y)
      //     .style('rx', '6')
      //     .style('ry', '6')
      //     .style('fill', '#666')
      // }
    }
  }, {
    key: 'clearBrush',
    value: function clearBrush() {
      // console.log('clearing brush')
      if (this.brushSelection.length === 2) {
        var thisNode = (0, _reactDom.findDOMNode)(this);
        var selection = (0, _d.select)(thisNode);
        this.brushSelection = [];
        selection.call(this.brush.move, null);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
        this.initBrush();
      }
      if (this.props.brushSelection && this.props.brushSelection.toString() !== prevProps.brushSelection.toString()) {
        this.brushSelection = this.props.brushSelection;
      }
      this.clearBrush();
    }
  }, {
    key: 'applySelection',
    value: function applySelection() {
      if (!_d.event.sourceEvent || _d.event.sourceEvent.type === 'brush' || !_d.event.selection) return;
      var domain = this.calculateSelection(_d.event.selection.map(this.props.scale.invert));
      var thisNode = (0, _reactDom.findDOMNode)(this);
      (0, _d.select)(thisNode).call(this.brush.move, domain.map(this.props.scale));
      this.brushSelection = domain;
    }
  }, {
    key: 'calculateSelection',
    value: function calculateSelection(domain) {
      var _props = this.props;
      var interval = _props.interval;
      var scale = _props.scale;

      var dateScale = /time/.test(scale.type);
      if (dateScale) {
        domain = domain.map(function (val) {
          return val.getTime();
        });
      }
      var nIntervals = Math.abs(scale.domain()[1] - scale.domain()[0]) / interval;
      var out = domain.slice();
      for (var i = 0; i < nIntervals; i++) {
        var xVal = dateScale ? scale.domain()[0].getTime() : scale.domain()[0];
        xVal += interval * i;
        if (domain[0] >= xVal && domain[0] < xVal + interval) {
          out[0] = xVal;
        }
        if (domain[1] > xVal && domain[1] < xVal + interval) {
          out[1] = xVal;
        }
      }
      if (out[0] === out[1]) {
        out[1] += interval;
      }
      return dateScale ? [new Date(out[0]), new Date(out[1])] : out;
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

BrushX.defaultProps = {
  showHandles: false
};

BrushX.propTypes = {
  brushSelection: _react.PropTypes.array,
  children: _react.PropTypes.node,
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  interval: _react.PropTypes.number.isRequired,
  scale: _react.PropTypes.func.isRequired,
  showHandles: _react.PropTypes.bool.isRequired,
  onBrush: _react.PropTypes.func
};

exports.default = BrushX;