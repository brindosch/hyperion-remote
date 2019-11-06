import VueDraggableResizable from 'vue-draggable-resizable'

// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

export default ({ Vue, store, router }) => {
  Vue.component('vue-draggable-resizable', VueDraggableResizable)
}
