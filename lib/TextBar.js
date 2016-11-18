'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import ReactDom from 'react-dom'
// import Bar from './Bar'

var TextBar = function (_React$Component) {
  _inherits(TextBar, _React$Component);

  _createClass(TextBar, [{
    key: '_onMouseEnter',
    value: function _onMouseEnter(event) {
      this.props.onEnter(event, this.props.data);
    }
  }, {
    key: '_onMouseLeave',
    value: function _onMouseLeave(event) {
      this.props.onLeave(event, this.props.data);
    }
  }, {
    key: '_onClick',
    value: function _onClick(event) {
      // console.log('toolTip', this.props.tooltipData)
      this.props.onClick(event, this.props.data);
    }
  }, {
    key: '_onDoubleClick',
    value: function _onDoubleClick() {
      // not used
      this.props.onDoubleClick(this.props.tooltipData);
    }
  }]);

  function TextBar(props) {
    _classCallCheck(this, TextBar);

    var _this = _possibleConstructorReturn(this, (TextBar.__proto__ || Object.getPrototypeOf(TextBar)).call(this, props));

    _this.onClick = _this._onClick.bind(_this);
    _this.onDoubleClick = _this._onDoubleClick.bind(_this);
    _this.onEnter = _this._onMouseEnter.bind(_this);
    _this.onLeave = _this._onMouseLeave.bind(_this);
    return _this;
  }

  _createClass(TextBar, [{
    key: 'setElem',
    value: function setElem() {
      // let {chartWidth, chartHeight, ...props} = this.props
    }
  }, {
    key: 'getTxtAlign',
    value: function getTxtAlign() {
      var xPos = 0;
      var align = this.props.textStyle.textAnchor;
      if (align === 'middle') {
        xPos = this.props.width / 2;
      } else if (align === 'end') {
        xPos = this.props.width - 10;
      } else {
        xPos = 10;
      }
      return xPos;
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      // if I put the styleChange check back in, things bog down....
      var styleChange = nextProps.barStyle !== this.props.barStyle;
      // console.log('TB', styleChange)
      var selected = nextProps.sel;
      /* if (this.props.text.indexOf('IC') >= 0) {
        console.log('next', nextProps.barStyle)
        console.log('this', this.props.barStyle)
        console.log('stylC', styleChange)
      } */
      // if (selected) { console.log('updated') }
      return styleChange || selected;
      // return selected
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._onMouseLeave();
    }
  }, {
    key: 'makeRect',
    value: function makeRect() {
      var _props = this.props,
          className = _props.className,
          text = _props.text,
          width = _props.width,
          height = _props.height,
          x = _props.x,
          y = _props.y,
          barStyle = _props.barStyle,
          rx = _props.rx,
          ry = _props.ry;

      var rectData = {
        className: className + ' barTopic',
        'data-name': text,
        width: width,
        height: height,
        x: x,
        y: y,
        style: barStyle,
        rx: rx,
        ry: ry
      };
      return rectData;
    }
    // <Bar className={className + ' barTopic'} {...props} onClick={this.onClick} onDoubleClick={this.onDoubleClick} onEnter={this.onEnter} onLeave={this.onLeave} style={this.props.barStyle} />

  }, {
    key: 'render',
    value: function render() {
      var _makeRect = this.makeRect(),
          style = _makeRect.style,
          rProps = _objectWithoutProperties(_makeRect, ['style']);
      // console.log('txtBar')
      // console.log('txtBar', this.props.text, this.props.barStyle)


      var _props2 = this.props,
          className = _props2.className,
          props = _objectWithoutProperties(_props2, ['className']);

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement(
          'text',
          { className: className + ' text', x: this.props.x + this.getTxtAlign(), y: this.props.y + this.props.height / 2, style: this.props.textStyle },
          ' ',
          props.text,
          ' '
        ),
        _react2.default.createElement('rect', _extends({}, rProps, {
          style: style
        })),
        _react2.default.createElement('rect', _extends({}, rProps, { style: { fill: 'black', fillOpacity: 0 }, onClick: this.onClick, onMouseEnter: this.onEnter, onMouseLeave: this.onLeave }))
      );
    }
  }]);

  return TextBar;
}(_react2.default.Component);

TextBar.defaultProps = {
  height: 0,
  width: 0,
  className: 'txtBar',
  onClick: function onClick() {
    return null;
  },
  onDoubleClick: function onDoubleClick() {
    return null;
  },
  onEnter: function onEnter() {
    return null;
  },
  onLeave: function onLeave() {
    return null;
  },
  tooltipData: {},
  x: 0,
  y: 0,
  rx: 0,
  ry: 0,
  font: 12,
  textAlign: 'left',
  textStyle: { textAnchor: 'start', fontSize: '12px' },
  text: '',
  sel: false
};

TextBar.propTypes = {
  className: _react.PropTypes.string.isRequired,
  height: _react.PropTypes.number.isRequired,
  width: _react.PropTypes.number.isRequired,
  onClick: _react.PropTypes.func,
  onDoubleClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tooltipData: _react.PropTypes.object,
  x: _react.PropTypes.number.isRequired,
  y: _react.PropTypes.number.isRequired,
  rx: _react.PropTypes.number,
  ry: _react.PropTypes.number,
  font: _react.PropTypes.number.isRequired,
  barStyle: _react.PropTypes.object,
  textStyle: _react.PropTypes.object,
  textAlign: _react.PropTypes.string.isRequired,
  text: _react.PropTypes.string.isRequired,
  sel: _react.PropTypes.bool.isRequired,
  data: _react.PropTypes.any
};

// Only required for REST calls
TextBar.contextTypes = {
  filterField: _react.PropTypes.string,
  filterString: _react.PropTypes.string,
  filterType: _react.PropTypes.string,
  updateFilter: _react.PropTypes.func
};

exports.default = TextBar;