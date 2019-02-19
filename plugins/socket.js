import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

var HOST = location.origin.replace(/^http/, 'ws') + /ws/
Vue.use(VueNativeSock, HOST)
