'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Heatmap = function (_React$Component) {
  _inherits(Heatmap, _React$Component);

  function Heatmap(props) {
    _classCallCheck(this, Heatmap);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Heatmap).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);

    _this.getDatum = _this.getDatum.bind(_this);
    return _this;
  }

  _createClass(Heatmap, [{
    key: 'onClick',
    value: function onClick(event) {
      var target = event.target;
      this.props.onClick(event, this.getDatum(target));
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var target = event.target;
      this.props.onEnter(event, this.getDatum(target));
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var target = event.target;
      this.props.onLeave(event, this.getDatum(target));
    }
  }, {
    key: 'getDatum',
    value: function getDatum(target) {
      var i = target.getAttribute('data-i');
      var j = target.getAttribute('data-j');
      return this.props.data[i].bins[j];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;
      return _react2.default.createElement(
        'g',
        { className: props.className },
        props.data.map(function (d, i) {
          var height = i === 0 ? props.chartHeight : props.yScale(props.data[i - 1][props.yAccessor.key]);
          height -= props.yScale(d[props.yAccessor.key]);
          return d.bins.map(function (e, j) {
            var width = j + 1 < d.bins.length ? props.xScale(d.bins[j + 1][props.xAccessor.key]) : props.chartWidth;
            width -= props.xScale(e[props.xAccessor.key]);
            var rectProps = {
              'data-i': i,
              'data-j': j,
              'key': i + '-' + j,
              'x': props.xScale(e[props.xAccessor.key]),
              'y': props.yScale(d[props.yAccessor.key]),
              'width': width,
              'height': height,
              'fill': props.colorScale(e[props.xAccessor.value]),
              'onMouseEnter': _this2.onEnter,
              'onMouseLeave': _this2.onLeave,
              'onClick': _this2.onClick
            };
            return _react2.default.createElement('rect', rectProps);
          });
        })
      );
    }
  }]);

  return Heatmap;
}(_react2.default.Component);

Heatmap.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11,
  colorPerRow: true,
  labelField: 'label',
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Heatmap.propTypes = {
  minColor: _react.PropTypes.string,
  maxColor: _react.PropTypes.string,
  numColorCat: _react.PropTypes.number,
  colorPerRow: _react.PropTypes.bool,
  labelField: _react.PropTypes.string,
  xAccessor: _react.PropTypes.object,
  yAccessor: _react.PropTypes.object,
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  className: _react.PropTypes.string,
  data: _react.PropTypes.array,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any
};

exports.default = Heatmap;