'use strict'

const Hapi = require('@hapi/hapi')
const Sequelize = require('sequelize')
const Joi = require('@hapi/joi')

const pino = require('pino')
const log = pino({name: 'ags-tool'})

/* const Relish = require('relish')({
  messages: {}
}) */

const init = async (config) => {
  /* config.hapi.routes = {
    validate: {
      failAction: Relish.failAction
    }
  } */

  const server = Hapi.server(config.hapi)

  await server.register({
    plugin: require('hapi-pino'),
    options: {name: 'ags-tool'}
  })

  if (global.SENTRY) {
    await server.register({
      plugin: require('hapi-sentry'),
      options: {client: global.SENTRY}
    })
  }

  await server.register({
    plugin: require('@hapi/inert')
  })

  await server.register({
    plugin: require('@hapi/nes')
  })

  await server.register({
    plugin: require('@hapi/bell')
  })

  const sequelize = new Sequelize(config.db)

  require('hapi-spa-serve')(server, {assets: require('path').join(__dirname, '../dist')})

  await require('./api')(server, sequelize, config)

  const daPad = await require('da-pad/src/api')(server, sequelize, {
    canViewPad: async () => {
      return false
    },
    canEditPad: async () => {
      return false
    }
  }) // returns {create(id, initialContent), delete(id)}

  await sequelize.sync()

  await server.start()
}

module.exports = init
