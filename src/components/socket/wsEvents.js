// A websocket eventListener bridge between nativ websocket and app listeners
// As a websocket object is always new constructed (reconnect) we can't bind directly EventListeners
export function WsEvents () {
  this.listeners = {}
}

WsEvents.prototype.listeners = null
WsEvents.prototype.addEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = []
  }
  this.listeners[type].push(callback)
}

WsEvents.prototype.removeEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    return
  }
  var stack = this.listeners[type]
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback) {
      stack.splice(i, 1)
      return
    }
  }
}

WsEvents.prototype.dispatchEvent = function (event) {
  if (!(event.type in this.listeners)) {
    return true
  }
  var stack = this.listeners[event.type]

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event)
  }
  return !event.defaultPrevented
}
