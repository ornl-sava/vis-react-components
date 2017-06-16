'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTransitionGroup = require('react-transition-group');

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
    _this.state = {};
    return _this;
  }

  _createClass(Treemap, [{
    key: 'onClick',
    value: function onClick(event, data, index) {
      var _this2 = this;

      if (this.props.zoom && data.children) {
        // the first setState is to make sure every component is properly initialized, to avoid a TransitionGroup error when that component tries to exit
        this.setState(this.state, function () {
          _this2.setState({ selectedId: data.id });
        });
      } else {
        this.props.onClick(event, data, index);
      }
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
      var _this3 = this;

      if (this.tip) {
        this.tip.hide();
        this.tip.destroy();
      }
      this.tip = this.props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(this.props.tipFunction) : this.props.tipFunction;

      var w = this.props.chartWidth ? this.props.chartWidth : this.props.width;
      var h = this.props.chartHeight ? this.props.chartHeight : this.props.height;

      var barPadding = 2;
      var barOffset = 0;
      if (this.props.zoom) {
        barOffset = this.props.fontSize + 10 + 2 * barPadding;
      }
      h = h - barOffset;

      var manualPadding = this.props.stretch ? 2 : 0;

      var ratio = this.props.stretch ? 4 : 1;

      var treemap = d3.treemap().size([w / ratio, h]).round(true);

      if (!this.props.stretch) {
        treemap.padding(2);
      }

      var getParent = function getParent(id, zoomOut) {
        if (_this3.props.zoom && _this3.state.selectedId === id && !zoomOut) {
          return '';
        }
        return id.substring(0, id.lastIndexOf('.'));
      };

      var stratify = d3.stratify().parentId(function (d) {
        return getParent(d.id);
      });

      var activeData = this.props.data;

      if (this.props.zoom && this.state.selectedId) {
        activeData = [];

        var stillThere = false;

        this.props.data.map(function (d) {
          if (d.id === _this3.state.selectedId || d.id.includes(_this3.state.selectedId + '.')) {
            activeData.push(d);
          }
          if (d.id === _this3.state.selectedId) {
            stillThere = true;
          }
        });

        if (!stillThere) {
          this.state.selectedId = null;
          activeData = this.props.data;
        }
      }

      var root = stratify(activeData).sum(function (d) {
        return _this3.props.sizeFunction(d);
      }).sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });

      var colors = d3.scaleOrdinal(d3.schemeCategory20);

      treemap(root);

      var visibleNodes = [];
      var overlayNodes = [];
      if (this.props.zoom) {
        root.children.map(function (d) {
          if (d.children) {
            visibleNodes = visibleNodes.concat(d.children);
          } else {
            visibleNodes.push(d);
          }
          overlayNodes.push(d);
        });
      } else {
        visibleNodes = root.leaves();
        overlayNodes = root.leaves();
      }

      var transitionFunc = { func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x).attr('fill', props.fill);
          return transition;
        } };

      return (
        // There used to be a TransitionGroup in place of the top SVGComponent, but that caused a strange bug. May need to add it back.
        _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          { component: 'g' },
          this.props.zoom && _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
            key: 'zoom rect',
            x: barPadding + 'px',
            y: barPadding + 'px',
            width: w - 2 * barPadding + 'px',
            height: barOffset - 2 * barPadding + 'px',
            fill: 'orange',
            onClick: function onClick() {
              if (_this3.state.selectedId) {
                _this3.setState({ selectedId: getParent(_this3.state.selectedId, true) });
              }
            },
            onUpdate: transitionFunc
          }),
          this.props.zoom && _react2.default.createElement(
            _SVGComponent2.default,
            { Component: 'text',
              key: 'zoom text',
              x: barPadding + 5 + 'px',
              y: barPadding + 5 + this.props.fontSize + 'px',
              fill: 'black',
              fontSize: this.props.fontSize + 'px',
              onUpdate: transitionFunc
            },
            this.props.idDisplayFunction(root)
          ),
          visibleNodes.map(function (d, i) {
            var w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0);
            var h = Math.max(d.y1 - d.y0 - manualPadding, 0);
            return _react2.default.createElement(
              _SVGComponent2.default,
              { Component: 'svg',
                key: d.id + ' svg',
                x: d.x0 * ratio + manualPadding + 'px',
                y: barOffset + d.y0 + manualPadding + 'px',
                width: w + 'px',
                height: h + 'px',
                onUpdate: transitionFunc },
              _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
                key: d.id + ' rect',
                data: d,
                onUpdate: transitionFunc,
                x: '0px',
                y: '0px',
                width: w + 'px',
                height: h + 'px',
                fill: colors(getParent(d.id))
              })
            );
          }),
          overlayNodes.map(function (d) {
            var w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0);
            var h = Math.max(d.y1 - d.y0 - manualPadding, 0);
            return _react2.default.createElement(
              _SVGComponent2.default,
              { Component: 'svg',
                key: d.id + ' svg',
                x: d.x0 * ratio + manualPadding + 'px',
                y: barOffset + d.y0 + manualPadding + 'px',
                width: w + 'px',
                height: h + 'px',
                onUpdate: transitionFunc },
              _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
                key: d.id + ' rect',
                data: d,
                onMouseEnter: _this3.onEnter,
                onMouseLeave: _this3.onLeave,
                onClick: _this3.onClick,
                onUpdate: transitionFunc,
                x: '0px',
                y: '0px',
                width: w + 'px',
                height: h + 'px',
                opacity: '0.0'
              }),
              _react2.default.createElement(
                _SVGComponent2.default,
                { Component: 'text',
                  key: d.id + ' text',
                  onMouseEnter: _this3.onEnter,
                  onMouseLeave: _this3.onLeave,
                  onClick: _this3.onClick,
                  onUpdate: transitionFunc,
                  x: 5 + 'px',
                  y: 2 + _this3.props.fontSize + 'px',
                  fill: 'black',
                  data: d,
                  fontSize: _this3.props.fontSize + 'px' },
                _this3.props.idDisplayFunction(d)
              )
            );
          })
        )
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
  zoom: false,
  stretch: false
};

Treemap.propTypes = {
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  tipFunction: _propTypes2.default.func,
  sizeFunction: _propTypes2.default.func,
  idDisplayFunction: _propTypes2.default.func,
  data: _propTypes2.default.array,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  chartHeight: _propTypes2.default.number,
  fontSize: _propTypes2.default.number,
  zoom: _propTypes2.default.bool,
  stretch: _propTypes2.default.bool
};

exports.default = Treemap;