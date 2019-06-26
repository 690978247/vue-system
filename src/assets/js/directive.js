import Vue from 'vue'

const debounce = (func, time, ctx) => {
  let timer
  const rtn = (...params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(ctx, params)
    }, time)
  }
  return rtn
}

Vue.component('Debounce', {
  abstract: true,
  props: ['time', 'events'],
  created() {
    this.eventKeys = this.events.split(',')
    this.originMap = {}
    this.debouncedMap = {}
  },
  render() {
    const vnode = this.$slots.default[0]
    // 只适用于element el-button    button：const target = vnode.data.on[key]

    this.eventKeys.forEach(key => {
      const target = vnode.componentOptions.listeners[key]
      if (target === this.originMap[key] && this.debouncedMap[key]) {
        vnode.componentOptions.listeners[key] = this.debouncedMap[key]
      } else if (target) {
        this.originMap[key] = target
        this.debouncedMap[key] = debounce(target, this.time, vnode)
        vnode.componentOptions.listeners[key] = this.debouncedMap[key]
      }
    })

    return vnode
  }
})


Vue.directive('debounce', {
    bind (el, { value }, vnode) {
        const [target, time] = value
        const debounced = debounce(target, time, vnode)
        el.addEventListener('click', debounced)
        el._debounced = debounced
    },
    destroy (el) {
        el.removeEventListener('click', el._debounced)
    }
})
