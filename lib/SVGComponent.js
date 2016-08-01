'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _react3 = require('./util/react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Set prop types here so internal class methods can access prop types
var SVGComponentPropTypes = {
  // Container props
  Component: _react.PropTypes.any,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  data: _react.PropTypes.any,
  index: _react.PropTypes.number,
  // Container enter/exit/update for animations
  onEnter: _react.PropTypes.any,
  onUpdate: _react.PropTypes.any,
  onExit: _react.PropTypes.any,
  // Container action handlers
  onClick: _react.PropTypes.func,
  onMouseEnter: _react.PropTypes.func,
  onMouseLeave: _react.PropTypes.func,
  onContextMenu: _react.PropTypes.func,
  onDoubleClick: _react.PropTypes.func,
  onMouseDown: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onMouseOut: _react.PropTypes.func,
  onMouseOver: _react.PropTypes.func,
  // Props to exclude during spread
  duration: _react.PropTypes.any,
  delay: _react.PropTypes.any,
  ease: _react.PropTypes.any
};

var SVGComponent = function (_React$Component) {
  _inherits(SVGComponent, _React$Component);

  function SVGComponent(props) {
    _classCallCheck(this, SVGComponent);

    // Need state that doesn't rely on setState triggers
    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SVGComponent).call(this, props));

    _this.simpleState = _extends((0, _react3.spreadExclude)(props, SVGComponentPropTypes));
    _this.animate = _this.animate.bind(_this);

    _this.onClick = _this.onClick.bind(_this);
    _this.onMouseEnter = _this.onMouseEnter.bind(_this);
    _this.onMouseLeave = _this.onMouseLeave.bind(_this);
    _this.onContextMenu = _this.onContextMenu.bind(_this);
    _this.onDoubleClick = _this.onDoubleClick.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onMouseOut = _this.onMouseOut.bind(_this);
    _this.onMouseOver = _this.onMouseOver.bind(_this);
    return _this;
  }

  _createClass(SVGComponent, [{
    key: 'componentWillEnter',
    value: function componentWillEnter(callback) {
      this.animate(callback, this.props, 'onEnter');
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      this.animate(function () {}, nextProps, 'onUpdate');
    }
  }, {
    key: 'componentWillLeave',
    value: function componentWillLeave(callback) {
      this.animate(callback, this.props, 'onExit');
    }
  }, {
    key: 'animate',
    value: function animate(callback, props, type) {
      var _this2 = this;

      var node = (0, _d.select)(this.refs.node);
      var propsCopy = JSON.parse(JSON.stringify(props));
      node.transition().call(function (transition) {
        props[type].func(transition, propsCopy);
      }).on('end', function () {
        _this2.simpleState = _extends((0, _react3.spreadExclude)(props, SVGComponentPropTypes));
        callback();
      });
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      this.props.onClick(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(event) {
      this.props.onMouseEnter(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(event) {
      this.props.onMouseLeave(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onContextMenu',
    value: function onContextMenu(event) {
      this.props.onContextMenu(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(event) {
      this.props.onDoubleClick(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      this.props.onMouseDown(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {
      this.props.onMouseUp(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(event) {
      this.props.onMouseMove(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseOut',
    value: function onMouseOut(event) {
      this.props.onMouseOut(event, this.props.data, this.props.index);
    }
  }, {
    key: 'onMouseOver',
    value: function onMouseOver(event) {
      this.props.onMouseOver(event, this.props.data, this.props.index);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var Component = _props.Component;

      var props = _objectWithoutProperties(_props, ['Component']);

      return _react2.default.createElement(Component, _extends({
        ref: 'node',
        className: props.className,
        id: props.id
      }, this.simpleState, {
        onClick: this.onClick,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onContextMenu: this.onContextMenu,
        onDoubleClick: this.onDoubleClick,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        onMouseOver: this.onMouseOver }));
    }
  }]);

  return SVGComponent;
}(_react2.default.Component);

SVGComponent.defaultProps = {
  Component: 'g',
  id: '',
  className: '',
  data: null,
  index: null,
  onEnter: {
    func: function func() {}
  },
  onUpdate: {
    func: function func() {}
  },
  onExit: {
    func: function func() {}
  },
  onClick: function onClick() {},
  onMouseEnter: function onMouseEnter() {},
  onMouseLeave: function onMouseLeave() {},
  onContextMenu: function onContextMenu() {},
  onDoubleClick: function onDoubleClick() {},
  onMouseDown: function onMouseDown() {},
  onMouseUp: function onMouseUp() {},
  onMouseMove: function onMouseMove() {},
  onMouseOut: function onMouseOut() {},
  onMouseOver: function onMouseOver() {}
};

SVGComponent.propTypes = SVGComponentPropTypes;

exports.default = SVGComponent;