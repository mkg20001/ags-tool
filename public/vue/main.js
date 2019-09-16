import Vue from 'vue/dist/vue.esm.js'

import * as Sentry from '@sentry/browser'
import VueResource from 'vue-resource'
import GlobalOptions from 'vue-global-options'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'

import syncedData from './syncedData'

import '@fortawesome/fontawesome-free/css/all.min.css'
import '../css/main.css'
const $ = window.jQuery = require('jquery')

if (!window.fetch) {
  require('whatwg-fetch')
}

const api = require('./api').default({
  versionPrefix: 'v0'
})
window.swal = require('sweetalert2')

if (!module.hot) {
  Sentry.init({
    dsn: 'DSN',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  })
}

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
    {path: '/pad/:id', component: require('./pages/pad.vue').default},
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

$(document).ready(async () => {
  // load user info
  let user
  let ui = {}

  if (!await api.areWeLoggedInYet()) {
    user = {
      loggedIn: false
    }
  } else {
    user = await api.json('user/profile')
  }

  user.config = ui = user.config || {} // sync

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
})
