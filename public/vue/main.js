import * as b from 'babel-core/register'
import * as b2 from 'babel-polyfill'

import Vue from 'vue/dist/vue.esm.js'

import * as Sentry from '@sentry/browser'
import VueResource from 'vue-resource'
import GlobalOptions from 'vue-global-options'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'

import syncedData from './syncedData'
import '@forevolve/bootstrap-dark/scss/_toggle-light.scss'
import '@forevolve/bootstrap-dark/scss/_toggle-dark.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../css/main.css'
const $ = window.jQuery = require('jquery')

if (!window.fetch) {
  require('whatwg-fetch')
}

require('sweetalert2')

const api = require('./api').default({
  versionPrefix: 'v0'
})
window.swal = require('sweetalert2')

/* if (!module.hot) {
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
    {path: '/profile', component: require('./pages/profile.vue').default},
    {path: '/protokolle/:id?', component: require('./pages/protokolle.vue').default},
    {path: '/tasks/:id?', component: require('./pages/tasks.vue').default},
    {path: '/projects/:id?', component: require('./pages/projects.vue').default},
    {path: '/admin/pad/:id?', component: require('./pages/pad-admin.vue').default},
    {path: '/pad/:id', component: require('./pages/pad.vue').default},
    {path: '/pad', component: require('./pages/pad-select.vue').default},
    {path: '*', component: require('./pages/404.vue').default}
  ]
})

window.router = router

// click intercept
$(document).on('click', 'a', function (e) {
  const href = $(this).attr('href')
  if (href && href.startsWith('/') && !href.startsWith('/auth')) {
    e.preventDefault()
    router.push(href)
  }
})

Vue.use(VueRouter)

$(document).ready(async () => {
  // load user info
  let user
  let ui = {}

  function userValueChange () {
    if (ui.dark) {
      $('body').removeClass('bs-light').addClass('bs-dark')
    } else {
      $('body').removeClass('bs-dark').addClass('bs-light')
    }
  }

  if (!await api.areWeLoggedInYet()) {
    user = {
      loggedIn: false,
      config: JSON.parse(window.localStorage.getItem('userconfig') || '{}'),
      permissions: [],
      p: {}
    }
  } else {
    user = await api.json('user/profile')
  }

  user.config = ui = user.config || {} // sync

  userValueChange()

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
    }, () => {
      userValueChange()

      if (user.loggedIn) {
        api.postJson('user/profile', user).catch(console.error)
      } else {
        window.localStorage.setItem('userconfig', JSON.stringify(ui))
      }
    })
  })
})
