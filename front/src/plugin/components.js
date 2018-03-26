import Modal from './Modal.vue'
import Slider from './Slider.vue'
import Loading from './Loading.vue'

export default {
  install(Vue) {
    Vue.component('Modal', Modal)
    Vue.component('Slider', Slider)
    Vue.component('Loading', Loading)
  }
}
