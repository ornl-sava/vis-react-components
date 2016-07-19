const spreadRelated = (component, props) => {
  let relatedProps = {}
  for (let p in props) {
    if (p in component.propTypes) {
      relatedProps[p] = props[p]
    }
  }
  return relatedProps
}

export { spreadRelated }
