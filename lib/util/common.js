"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollLeft = exports.scrollTop = exports.getHeight = exports.getWidth = exports.functor = void 0;

var functor = function functor(f) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof f === 'function' ? f.apply(void 0, args) : f;
}; // Cross browser helpers


exports.functor = functor;

var getWidth = function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
};

exports.getWidth = getWidth;

var getHeight = function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
};

exports.getHeight = getHeight;

var scrollTop = function scrollTop() {
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }

  if (document.body) {
    return document.body.scrollTop;
  }
};

exports.scrollTop = scrollTop;

var scrollLeft = function scrollLeft() {
  if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft;
  }

  if (document.body) {
    return document.body.scrollLeft;
  }
};

exports.scrollLeft = scrollLeft;