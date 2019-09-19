'use strict'

const Hapi = require('@hapi/hapi')
const Sequelize = require('sequelize')
const CatboxSequelize = require('catbox-sequelize')
const Joi = require('@hapi/joi')

const pino = require('pino')
const log = pino({name: 'ags-tool'})

/* const Relish = require('relish')({
  messages: {}
}) */

const init = async (config) => {
  const sequelize = new Sequelize(config.db)

  /* config.hapi.routes = {
    validate: {
      failAction: Relish.failAction
    }
  } */

  config.hapi.cache = [
    {
      name: 'cache',
      provider: {
        constructor: CatboxSequelize,
        options: {
          sequelize
        }
      }
    }
  ]

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

  require('hapi-spa-serve')(server, {assets: require('path').join(__dirname, '../dist')})

  await require('./api')(server, sequelize, config)

  await sequelize.sync()

  await server.start()
}

module.exports = init
