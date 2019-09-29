'use strict'

const Auth = require('./auth')
const CRUD = require('./crud')

const Sequelize = require('sequelize')

module.exports = async (server, sequelize, config) => {
  server.auth.strategy('sso', 'bell', config.sso)
  const {User} = await Auth(server, sequelize)
  server.auth.strategy('session', 'simplesession', {isDev: config.sso.isSecure === false})

  server.route({
    method: 'GET',
    path: '/api/v0/user/profile',
    options: {
      auth: 'session',
      handler: async (request, h) => {
        const {config, id, email, displayname: display, scope} = request.auth.credentials

        return {
          loggedIn: true,
          config,
          id,
          email,
          display,
          permissions: scope,
          p: scope.reduce((obj, perm) => {
            obj[perm] = true
            return obj
          }, {})
        }
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/api/v0/user/profile',
    options: {
      auth: 'session',
      handler: async (request, h) => {
        const {id} = request.auth.credentials

        const {display, config, email} = request.payload

        const up = {displayname: display, config, email}

        for (const key in up) {
          if (up[key] == null) {
            delete up[key]
          }
        }

        await User.update(up, { where: { id } })

        return {ok: true}
      }
    }
  })

  /* Tasks */

  class Task extends Sequelize.Model {}
  Task.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: Sequelize.STRING,
    desc: Sequelize.STRING(Math.pow(2, 14)),
    stateOpen: Sequelize.BOOLEAN,
    stateTag: Sequelize.STRING(50),

    acl: Sequelize.JSONB // {id<user>, canAddUsers, canRemoveUsers, canEdit}
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

  /* Projects */

  class Project extends Sequelize.Model {}
  Project.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: Sequelize.STRING,
    desc: Sequelize.STRING(Math.pow(2, 14)),
    maintainer: Sequelize.INTEGER,
    maintainerUrl: Sequelize.STRING(256),
    colorSeed: Sequelize.STRING(32),

    acl: Sequelize.JSONB // {id<user>, canAddUsers, canRemoveUsers, canEdit}
  }, { sequelize, modelName: 'project' })

  await CRUD({
    server,
    model: Project,
    name: 'projects',
    prefix: '/api/v0',
    auth: {
      create: 'session:admin',
      // read
      update: 'session',
      delete: 'session:admin'
    }
  })

  /* Protokolle */

  class Protokoll extends Sequelize.Model {}
  Protokoll.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: Sequelize.STRING,

    textContent: Sequelize.STRING(Math.pow(2, 14)),
    audioContent: Sequelize.STRING // local file id
  }, { sequelize, modelName: 'protokolle' })

  await CRUD({
    server,
    model: Protokoll,
    name: 'protokolle',
    prefix: '/api/v0',
    auth: {
      create: 'session:admin',
      // read
      update: 'session:admin',
      delete: 'session:admin'
    }
  })

  /* pads */

  await require('./pads')(server, sequelize, config)
}
