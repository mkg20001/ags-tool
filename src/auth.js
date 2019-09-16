'use strict'

const Boom = require('@hapi/boom')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const hat = require('hat')

module.exports = async function (server, sequelize, options) {
  // Session auth

  const cache = server.cache({segment: 'sessions', expiresIn: 60 * 60 * 1000})

  const authScheme = (server, {isDev}) => {
    server.state('sid', {
      ttl: null,
      isSecure: !isDev,
      isHttpOnly: isDev,
      encoding: 'base64json',
      clearInvalid: true,
      strictHeader: true
    })

    const scheme = {
      authenticate: async (request, h) => {
        const sid = request.state.sid

        if (!sid) {
          throw Boom.unauthorized()
        }

        const sidVal = await cache.get(sid)

        if (!sidVal) {
          throw Boom.unauthorized()
        }

        return h.authenticated({ credentials: sidVal })
      }
    }

    return scheme
  }

  server.auth.scheme('simplesession', authScheme)

  // SSO

  class User extends Sequelize.Model {}
  User.init({
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
  }, { sequelize, modelName: 'user' })

  server.route({
    method: 'GET',
    path: '/auth/sso',
    options: {
      auth: 'sso',
      handler: async (request, h) => {
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`
        }

        const {profile} = request.auth.credentials

        let user = await User.findOne({
          where: {
            [Op.or]: {
              ssoId: profile.id,
              email: profile.email
            }
          }
        })

        if (!user) {
          user = await User.create({
            ssoId: profile.id,
            email: profile.email,
            username: profile.username,
            displayname: profile.displayName,
            scope: []
          })
        } else {
          // TODO: update
        }

        user = user.toJSON()

        let sid = hat()
        await cache.set(sid, user, 0)

        return h.redirect('/')
      }
    }
  })
}
