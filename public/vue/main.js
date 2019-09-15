import Vue from 'vue/dist/vue.esm.js'

// import * as Sentry from '@sentry/browser'
import VueResource from 'vue-resource'
import GlobalOptions from 'vue-global-options'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'

import syncedData from './syncedData'

import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../css/main.css'
const $ = window.jQuery = require('jquery')
window.Popper = require('popper.js').default
require('bootstrap-material-design')

if (!window.fetch) {
  require('whatwg-fetch')
}

const api = require('./api').default({
  versionPrefix: 'v0'
})
window.swal = require('sweetalert2')
const re = () => $('body').bootstrapMaterialDesign()

/* TODO: possibly evaluate on-premise sentry usage
if (!module.hot) {
  Sentry.init({
    dsn: 'DSN',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  })
} */

Vue.use(VueResource)
Vue.use(GlobalOptions, ['api', 'config', 'user', 'ui'])
Vue.use(VueI18n)

const messages = require('./locales')

const lang = window.navigator.language.split('-')[0]

const i18n = new VueI18n({
  // check if we have user's langauge code mapped to a locale available, otherwise use en
  locale: messages[lang] ? lang : 'en',
  messages
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', component: require('./pages/home.vue').default},
    {path: '/settings', component: require('./pages/settings.vue').default},
    {path: '/login', component: require('./pages/login.vue').default},
    {path: '*', component: require('./pages/404.vue').default}
  ]
})

window.router = router

// click intercept
$(document).on('click', 'a', function (e) {
  const href = $(this).attr('href')
  if (href && href.startsWith('/')) {
    e.preventDefault()
    router.push(href)
  }
})

Vue.use(VueRouter)

// TODO: possibly replace bootstrap material design with some better MDL-like
let tm = 0
document.addEventListener('DOMNodeInserted', event => {
  try {
    clearTimeout(tm)
    tm = setTimeout(() => $(event.target).bootstrapMaterialDesign(), 10)
  } catch (e) {
    // pass
  }
})

$(document).ready(async () => {
  // load user info
  let user
  let ui = {}

  if (!await api.areWeLoggedInYet()) {
    user = false

    router.beforeEach((to, from, next) => {
      if (to.path !== '/login') {
        next({ path: '/login', query: { redirect: from.fullPath } })
      } else {
        next()
      }
    })
  } else {
    user = await api.json('user/profile')
    user.ui = ui = user.ui || {} // sync

    router.beforeEach((to, from, next) => {
      if (to.path === '/login') {
        next(to.query.redirect)
      } else {
        next()
      }
    })
  }

  // hide spinner
  $('#load').hide()

  // launch app
  window.app = new Vue({
    el: 'app',
    router,
    i18n,
    components: {
      app: require('./app.vue').default
    },

    // globally exposed variables
    api,
    config: {},
    user,
    ui: syncedData(ui, {
      dark: false,
      showNav: false
    }, (key, newValue, ui) => {
      return api.postJson('user/profile', {ui})
    })
  })

  re()
})
