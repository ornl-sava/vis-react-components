"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAxis = exports.setEase = exports.setScale = exports.isOrdinalScale = void 0;

var d3Scale = _interopRequireWildcard(require("d3-scale"));

var d3Ease = _interopRequireWildcard(require("d3-ease"));

var d3Axis = _interopRequireWildcard(require("d3-axis"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var setScale = function setScale(scaleType) {
  if (!scaleType) {
    console.error('scaleType was not defined');
  }

  var scaling = 'scale' + scaleType.charAt(0).toUpperCase() + scaleType.slice(1);
  var scale = d3Scale[scaling]();
  scale.type = scaleType;

  if (scale.type === 'pow') {
    scale.exponent(0.5);
  }

  return scale;
};

exports.setScale = setScale;

var isOrdinalScale = function isOrdinalScale(scaleType) {
  return scaleType === 'band' || scaleType === 'point' || scaleType === 'ordinal';
};

exports.isOrdinalScale = isOrdinalScale;

var setEase = function setEase(easeType) {
  var easing = 'ease' + easeType.charAt(0).toUpperCase() + easeType.slice(1);
  return d3Ease[easing];
};

exports.setEase = setEase;

var setAxis = function setAxis(orientationType) {
  var orientation = 'axis' + orientationType.charAt(0).toUpperCase() + orientationType.slice(1);
  return d3Axis[orientation]();
};

exports.setAxis = setAxis;