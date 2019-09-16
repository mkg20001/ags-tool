'use strict'

const Auth = require('./auth')
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
        return request.auth
      }
    }
  })
}
