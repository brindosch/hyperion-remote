export let Vue

export function install (_Vue) {
  Vue = _Vue

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && install.installed) {
    console.log('sock already installed')
    return
  }
  install.installed = true

  Object.defineProperty(Vue.prototype, '$sock', {
    get () { return this._sock }
  })

  // extend(Vue)
  // Vue.mixin(mixin)
  // Vue.directive('t', { bind, update })
  // Vue.component(component.name, component)
}
