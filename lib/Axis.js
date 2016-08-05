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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Truncate labels based on maximum allowable characters, where
// characters should be estimated at 8-10 pixels per character.
var truncateLabel = function truncateLabel(d, maxChars) {
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

    _this.setAxis = _this.setAxis.bind(_this);
    _this.resizeAxis = _this.resizeAxis.bind(_this);

    _this.axis = null;
    _this.setAxis(_this.props);
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
      // console.log(this.props.type + ' did update')
      this.resizeAxis();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // console.log(this.props.type + ' will receive props')
      var range = nextProps.scale.range()[1] - nextProps.scale.range()[0];
      this.setState({ range: range });
    }
  }, {
    key: 'setAxis',
    value: function setAxis(props) {
      if (props.orient === 'left') {
        this.axis = (0, _d.axisLeft)();
      } else if (props.orient === 'bottom') {
        this.axis = (0, _d.axisBottom)();
      } else if (props.orient === 'top') {
        this.axis = (0, _d.axisTop)();
      } else if (props.orient === 'right') {
        this.axis = (0, _d.axisRight)();
      }
      this.axis.scale(props.scale);
    }
    // Re-calculate postions of the chart based on the currently rendered position
    // Also updates the axes based on the

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
      var tickFormatter = null;

      if (props.scale.domain().length > 0 && props.scale.range().length > 0) {
        // Use custom tick count if it exist
        if (props.tickCount) {
          tickCount = props.tickCount;
        } else {
          tickCount = props.type === 'y' ? 3 : props.scale.domain().length;
        }

        // If scale type is ordinal truncate labels
        if (/ordinal/.test(props.scale.type)) {
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
              return truncateLabel(d, maxWidth);
            };
          })();
        }

        // Use custom tickFormatter if it exist
        if (props.tickFormat) {
          tickFormatter = function tickFormatter(d, i) {
            return props.tickFormat(d, i);
          };
        }
      }
      // Commenting this out doesn't appear to cause any problems
      // it also seems to improve the re-rendering performance a bit.
      // this.setAxis(props)

      this.axis.tickFormat(tickFormatter).tickValues(tickValues).ticks(tickCount);
      selection.call(this.axis);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      // Need to handle top and left orientations, but this works for now
      var transform = '';
      if (props.orient === 'bottom') {
        transform = 'translate(0,' + props.chartHeight + ')';
      } else if (props.orient === 'right') {
        transform = 'translate(' + props.chartWidth + ',0)';
      }
      if (props.label) {
        return _react2.default.createElement(
          'g',
          { className: props.className, transform: transform },
          _react2.default.createElement(
            'text',
            { className: 'label' },
            props.label
          )
        );
      } else {
        return _react2.default.createElement('g', { className: props.className, transform: transform });
      }
    }
  }]);

  return Axis;
}(_react2.default.Component);

Axis.defaultProps = {
  type: 'x',
  orient: 'left',
  tickValues: null,
  tickCount: false,
  tickFormat: false,
  label: ''
};

Axis.propTypes = {
  orient: _react.PropTypes.string.isRequired,
  type: _react.PropTypes.string.isRequired,
  tickValues: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.bool]),
  tickCount: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.bool]),
  tickFormat: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.bool]),
  label: _react.PropTypes.string,
  scale: _react.PropTypes.any
};
exports.default = Axis;