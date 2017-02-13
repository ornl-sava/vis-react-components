'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // partly inspired by https://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80

var Treemap = function (_React$Component) {
  _inherits(Treemap, _React$Component);

  function Treemap(props) {
    _classCallCheck(this, Treemap);

    var _this = _possibleConstructorReturn(this, (Treemap.__proto__ || Object.getPrototypeOf(Treemap)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    return _this;
  }

  _createClass(Treemap, [{
    key: 'onClick',
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }
      this.props.onEnter(event, data, index);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }
      this.props.onLeave(event, data, index);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var w = this.props.chartWidth ? this.props.chartWidth : this.props.width;
      var h = this.props.chartHeight ? this.props.chartHeight : this.props.height;

      var treemap = d3.treemap().size([w, h]).round(true).padding(2);

      var getParent = function getParent(id) {
        return id.substring(0, id.lastIndexOf('.'));
      };

      var stratify = d3.stratify().parentId(function (d) {
        return getParent(d.id);
      });

      var root = stratify(this.props.data).sum(function (d) {
        return _this2.props.sizeFunction(d);
      }).sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });

      var colors = d3.scaleOrdinal(d3.schemeCategory20);

      treemap(root);

      return _react2.default.createElement(
        _reactAddonsTransitionGroup2.default,
        { component: 'g' },
        root.leaves().map(function (d, i) {
          return _react2.default.createElement(
            _SVGComponent2.default,
            { Component: 'svg',
              key: d.id,
              x: d.x0 + 'px',
              y: d.y0 + 'px',
              width: d.x1 - d.x0 + 'px',
              height: d.y1 - d.y0 + 'px',
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x).attr('fill', props.fill);
                  return transition;
                }
              } },
            _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
              key: d.id,
              data: d,
              onMouseEnter: _this2.onEnter,
              onMouseLeave: _this2.onLeave,
              onClick: _this2.onClick,
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x).attr('fill', props.fill);
                  return transition;
                }
              },
              x: '0px',
              y: '0px',
              width: d.x1 - d.x0 + 'px',
              height: d.y1 - d.y0 + 'px',
              fill: colors(getParent(d.id))
            }),
            _react2.default.createElement(
              _SVGComponent2.default,
              { Component: 'text',
                key: d.id + ' value',
                onMouseEnter: _this2.onEnter,
                onMouseLeave: _this2.onLeave,
                onClick: _this2.onClick,
                onUpdate: {
                  func: function func(transition, props) {
                    transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x);
                    return transition;
                  }
                },
                x: '5px',
                y: 5 + _this2.props.fontSize + 'px',
                fill: 'black',
                fontSize: _this2.props.fontSize + 'px' },
              _this2.props.idDisplayFunction(d)
            )
          );
        })
      );
    }
  }]);

  return Treemap;
}(_react2.default.Component);

Treemap.defaultProps = {
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  data: [],
  sizeFunction: function sizeFunction(d) {
    return d.value;
  },
  idDisplayFunction: function idDisplayFunction(d) {
    return d.id;
  },
  fontSize: 12,
  className: 'Treemap'
};

Treemap.propTypes = {
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tipFunction: _react.PropTypes.func,
  sizeFunction: _react.PropTypes.func,
  idDisplayFunction: _react.PropTypes.func,
  data: _react.PropTypes.array,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  chartHeight: _react.PropTypes.number,
  className: _react.PropTypes.string,
  fontSize: _react.PropTypes.number
};

exports.default = Treemap;