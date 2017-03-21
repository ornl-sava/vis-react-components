'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = require('./util/d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Truncate labels based on maximum allowable characters, where
// characters should be estimated at 8-10 pixels per character.
var truncateLabel = function truncateLabel(d, maxChars) {
  if (d == null) {
    console.warn('No label to truncate, check and makes sure the container has the correct accessor.key specified');
    return '';
  }
  var replacementString = '...';
  if (d.length > maxChars + replacementString.length) {
    return d.substring(0, maxChars) + '...';
  }
  return d;
};

var Axis = function (_React$Component) {
  _inherits(Axis, _React$Component);

  function Axis(props) {
    _classCallCheck(this, Axis);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Axis).call(this, props));

    _this.state = { range: 0, ticks: 0 };

    _this.resizeAxis = _this.resizeAxis.bind(_this);

    _this.axis = (0, _d2.setAxis)(props.orient);
    _this.axis.scale(props.scale);
    return _this;
  }

  _createClass(Axis, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.resizeAxis();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.resizeAxis();
    }

    // Re-calculate postions of the chart based on the currently rendered position

  }, {
    key: 'resizeAxis',
    value: function resizeAxis() {
      var props = this.props;
      var thisNode = _reactDom2.default.findDOMNode(this);
      var parentNode = thisNode.parentNode;
      var selector = '.' + props.className.replace(/ /g, '.');
      var selection = (0, _d.select)(parentNode).select(selector);

      var tickCount = 0;
      var tickValues = props.tickValues;
      var tickPreformatValues = [];
      var tickFormatter = null;

      if (props.scale.domain().length > 0) {
        // Use custom tick count if it exist
        if (props.tickCount) {
          tickCount = props.tickCount;
        } else {
          tickCount = props.type === 'y' ? 3 : props.scale.domain().length;
        }

        // Set tickFormatter to be used
        if ((0, _d2.isOrdinalScale)(props.scale.type)) {
          (function () {
            var maxWidth = 0;
            var fontSize = 12;

            if (props.orient === 'top' || props.orient === 'bottom') {
              var binWidth = Math.floor(props.scale.step());
              maxWidth = Math.floor(binWidth / fontSize);
            } else {
              if (props.orient === 'left') {
                maxWidth = props.margin.left;
              } else {
                maxWidth = props.margin.right;
              }
            }

            tickFormatter = function tickFormatter(d) {
              tickPreformatValues.push(d);
              return truncateLabel(d, maxWidth);
            };
          })();
        } else if (props.tickFormat) {
          tickFormatter = function tickFormatter(d, i) {
            tickPreformatValues.push(d);
            return props.tickFormat(d, i);
          };
        } else {
          tickFormatter = function tickFormatter(d, i) {
            // Default d3 method of formatting
            // Allows obtaining the real value for styling before it's formatted
            tickPreformatValues.push(d);
            var tick = typeof props.scale.tickFormat === 'function' ? props.scale.tickFormat()(d) : d;
            return tick;
          };
        }
      }

      // Setup axis
      this.axis.tickFormat(tickFormatter).tickValues(tickValues).ticks(tickCount);

      // Create and animate axis
      selection.transition().duration(props.animationDuration).call(this.axis);

      // Add styling to axis
      if (props.tickStyle) {
        selection.selectAll('.tick text').each(function (d, i) {
          var tick = (0, _d.select)(this);
          props.tickStyle(tick, tickPreformatValues[i], i);
        });
      }

      if (props.onLabelClick) {
        selection.selectAll('.tick').style('cursor', 'pointer');
        selection.selectAll('.tick').on('click', function (d) {
          props.onLabelClick(d);
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var transform = '';
      if (props.orient === 'bottom') {
        transform = 'translate(0,' + props.chartHeight + ')';
      } else if (props.orient === 'right') {
        transform = 'translate(' + props.chartWidth + ',0)';
      }

      return _react2.default.createElement(
        'g',
        { className: props.className, transform: transform },
        props.label != null ? _react2.default.createElement(
          'text',
          { className: 'label' },
          props.label
        ) : undefined
      );
    }
  }]);

  return Axis;
}(_react2.default.Component);

Axis.defaultProps = {
  type: 'x',
  orient: 'left',
  tickValues: null,
  tickCount: null,
  tickFormat: null,
  tickStyle: null,
  animationDuration: 0,
  label: null
};

Axis.propTypes = {
  orient: _react.PropTypes.string.isRequired,
  type: _react.PropTypes.string.isRequired,
  animationDuration: _react.PropTypes.number,
  tickStyle: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.bool]),
  tickValues: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.bool]),
  tickCount: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.bool]),
  tickFormat: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.bool]),
  label: _react.PropTypes.string,
  scale: _react.PropTypes.any,
  onLabelClick: _react.PropTypes.func
};
exports.default = Axis;