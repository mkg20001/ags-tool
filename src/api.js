'use strict'

module.exports = async (server, sequelize, config) => {
  server.auth.strategy('sso', 'bell', config.sso)

  server.route({
    method: 'GET',
    path: '/auth/sso',
    options: {
      auth: 'sso',
      handler: function (request, h) {
        return 'Hello World!'
      }
    }
  })
}
