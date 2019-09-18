'use strict'

const Auth = require('./auth')
const CRUD = require('./crud')

const Sequelize = require('sequelize')

module.exports = async (server, sequelize, config) => {
  server.auth.strategy('sso', 'bell', config.sso)
  await Auth(server, sequelize)
  server.auth.strategy('session', 'simplesession', {isDev: config.sso.isSecure === false})

  server.route({
    method: 'GET',
    path: '/api/v0/user/profile',
    options: {
      auth: 'session',
      handler: async (request, h) => {
        const {config, id, email, displayname: display} = request.auth.credentials

        return {
          loggedIn: true,
          config,
          id,
          email,
          display
        }
      }
    }
  })

  class Task extends Sequelize.Model {}
  Task.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    ssoId: Sequelize.INTEGER,
    username: Sequelize.STRING,
    displayname: Sequelize.STRING,
    config: Sequelize.JSONB,
    scope: {
      type: Sequelize.JSONB,
      default: []
    },
    email: Sequelize.STRING
  }, { sequelize, modelName: 'task' })

  await CRUD({
    server,
    model: Task,
    name: 'tasks',
    prefix: '/api/v0',
    auth: {
      create: 'session:admin',
      // read
      update: 'session',
      delete: 'session:admin'
    }
  })
}
