'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAxis = exports.setEase = exports.setScale = exports.isOrdinalScale = undefined;

var _d3Scale = require('d3-scale');

var d3Scale = _interopRequireWildcard(_d3Scale);

var _d3Ease = require('d3-ease');

var d3Ease = _interopRequireWildcard(_d3Ease);

var _d3Axis = require('d3-axis');

var d3Axis = _interopRequireWildcard(_d3Axis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var setScale = function setScale(scaleType) {
  var scaling = 'scale' + scaleType.charAt(0).toUpperCase() + scaleType.slice(1);
  var scale = d3Scale[scaling]();
  scale.type = scaleType;
  if (scale.type === 'pow') {
    scale.exponent(0.5);
  }
  return scale;
};

var isOrdinalScale = exports.isOrdinalScale = function isOrdinalScale(scaleType) {
  return scaleType === 'band' || scaleType === 'point' || scaleType === 'ordinal';
};

var setEase = function setEase(easeType) {
  var easing = 'ease' + easeType.charAt(0).toUpperCase() + easeType.slice(1);
  return d3Ease[easing];
};

var setAxis = function setAxis(orientationType) {
  var orientation = 'axis' + orientationType.charAt(0).toUpperCase() + orientationType.slice(1);
  return d3Axis[orientation]();
};

exports.setScale = setScale;
exports.setEase = setEase;
exports.setAxis = setAxis;