'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var functor = function functor(f) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof f === 'function' ? f.apply(undefined, args) : f;
};

// Cross browser helpers
var getWidth = function getWidth() {
  if (self.innerHeight) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
};

var scrollTop = function scrollTop() {
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }

  if (document.body) {
    return document.body.scrollTop;
  }
};

var scrollLeft = function scrollLeft() {
  if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft;
  }

  if (document.body) {
    return document.body.scrollLeft;
  }
};

exports.functor = functor;
exports.getWidth = getWidth;
exports.scrollTop = scrollTop;
exports.scrollLeft = scrollLeft;