'use strict'

module.exports = async (server, config) => {
  server.route({
    method: 'POST',
    path: '/api/v0/login',
    handler: function (request, h) {
      return 'Hello World!'
    }
  })
}
