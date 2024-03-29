'use strict'

const Boom = require('@hapi/boom')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const hat = require('hat')

module.exports = async function (server, sequelize, options) {
  // Session auth

  const cache = server.cache({segment: 'sessions', expiresIn: 30 * 24 * 60 * 60 * 1000})

  const authScheme = (server, {isDev}) => {
    server.state('sid', {
      ttl: 30 * 24 * 60 * 60 * 1000,
      isSecure: !isDev,
      isHttpOnly: isDev,
      encoding: 'base64json',
      clearInvalid: true,
      strictHeader: true,
      path: '/'
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

        sidVal.update = async (up) => {
          await User.update(up, { where: { id: request.auth.credentials.id } })

          await cache.set(request.state.sid, Object.assign(request.auth.credentials, up))
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
    config: {
      type: Sequelize.JSONB,
      default: {}
    },
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
        h.state('sid', sid)

        return h.redirect('/')
      }
    }
  })

  return {User, cache}
}
