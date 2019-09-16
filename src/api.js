'use strict'

const Sequelize = require('sequelize')

module.exports = async (server, sequelize, config) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    username: Sequelize.STRING,
    email: Sequelize.STRING
  }, { sequelize, modelName: 'user' })

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
