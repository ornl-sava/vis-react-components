"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var spreadRelated = function spreadRelated(component, props) {
  var relatedProps = {};
  for (var p in props) {
    if (p in component.propTypes) {
      relatedProps[p] = props[p];
    }
  }
  return relatedProps;
};

exports.spreadRelated = spreadRelated;