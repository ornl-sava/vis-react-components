const functor = (f) => {
  return typeof f === 'function'
    ? f()
    : f
}

export default class Tooltip {
  constructor () {
    // Init tooltip
    this.tooltip = document.createElement('div')
    this.tooltip.style.display = 'none'
    this.tooltip.style.position = 'absolute'
    this.tooltip.style['box-sizing'] = 'border-box'
    document.body.appendChild(this.tooltip)

    // Set up defaults
    this._html = ''
    this._offset = [0, 0]
    this._direction = 'n'
  }

  destroy () {
    document.body.removeChild(this.tooltip)
  }

  show (node, data) {
    this.tooltip.classList.add(this._direction)
    this.tooltip.innerHTML = this._html(data)
    this.tooltip.style.display = 'block'
    let bbox = this.getScreenBBox(node)
    let coords = {
      top: bbox[this._direction].y,
      left: bbox[this._direction].x
    }
    this.tooltip.style.top = (coords.top + this._offset[0]) + document.body.scrollTop + 'px'
    this.tooltip.style.left = (coords.left + this._offset[1]) + document.body.scrollLeft + 'px'
    return this
  }

  hide () {
    this.tooltip.style.display = 'none'
    return this
  }

  html (tooltipFunction) {
    if (!arguments.length) return this._html
    this._html = tooltipFunction

    return this
  }

  direction (d) {
    if (!arguments.length) return this._direction
    this._direction = functor(d)

    return this
  }

  offset (o) {
    if (!arguments.length) return this._offset
    this._offset = functor(o)

    return this
  }

  attr (attr, value) {
    if (arguments.length < 2 && typeof attr === 'string') {
      return this.tooltip.getAttribute('string')
    } else {
      this.tooltip[attr] = functor(value)
    }
    return this
  }

  style (styl, value) {
    if (arguments.length < 2 && typeof attr === 'string') {
      return this.tooltip.getAttribute('string')
    } else {
      this.tooltip[styl] = functor(value)
    }

    return this
  }

  getScreenBBox (target = null) {
    if (target === null) {
      return null
    }

    let bbox = {}
    let point = target.ownerSVGElement.createSVGPoint()
    let matrix = target.getScreenCTM()
    let tbbox = target.getBBox()
    let width = tbbox.width
    let height = tbbox.height
    let x = tbbox.x
    let y = tbbox.y

    point.x = x
    point.y = y

    bbox.nw = point.matrixTransform(matrix)
    bbox.nw.y -= this.tooltip.offsetHeight
    bbox.nw.x -= this.tooltip.offsetWidth
    point.x += width

    bbox.ne = point.matrixTransform(matrix)
    bbox.ne.y -= this.tooltip.offsetHeight
    point.y += height

    bbox.se = point.matrixTransform(matrix)
    point.x -= width

    bbox.sw = point.matrixTransform(matrix)
    bbox.sw.x -= this.tooltip.offsetWidth
    point.y -= height / 2

    bbox.w = point.matrixTransform(matrix)
    bbox.w.y -= this.tooltip.offsetHeight / 2
    bbox.w.x -= this.tooltip.offsetWidth
    point.x += width

    bbox.e = point.matrixTransform(matrix)
    bbox.e.y -= this.tooltip.offsetHeight / 2
    point.x -= width / 2
    point.y -= height / 2

    bbox.n = point.matrixTransform(matrix)
    bbox.n.x -= this.tooltip.offsetWidth / 2
    bbox.n.y -= this.tooltip.offsetHeight
    point.y += height

    bbox.s = point.matrixTransform(matrix)
    bbox.s.x -= this.tooltip.offsetWidth / 2

    return bbox
  }
}
