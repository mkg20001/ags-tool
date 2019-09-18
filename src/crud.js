'use strict'

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

function generateConfig (auth, model, valPayload, valId) {
  const out = { validate: {} }

  if (valId) {
    out.validate.params = {
      id: Joi.integer().required()
    }
  }

  if (valPayload) {
    // TODO: fix joi-sequelize and use that for payload validate
  }

  if (auth) {
    let {strategy, scope, mode} = auth.split(':')
    scope = scope ? scope.split(',') : null
    mode = mode || null // nullify empty string

    out.auth = {strategy, scope, mode}
  }

  return out
}

module.exports = ({server, model, name, prefix, auth, middleware}) => {
  // TODO: use joi
  if (!middleware) { middleware = {} }
  if (!auth) { auth = {} }

  if (!prefix) { prefix = '' }

  const base = `${prefix}/${name}`

  async function m (name, request, h) {
    if (middleware[name]) {
      const a = Array.isArray(middleware[name]) ? middleware[name] : [middleware[name]]
      for (let i = 0; i < a.length; i++) {
        await a[i](request, h)
      }
    }
  }

  // C is for Create

  server.route({
    method: 'POST',
    path: base,
    // TODO:  payload validate
    config: generateConfig(auth.create, model, true, false),
    handler: async (request, h) => {
      await m('preCreate', request, h)

      try {
        const res = await model.create(request.payload)
        return h.response(res).status()
      } catch (error) {
        // TODO: better errorss
        throw Boom.badImplementation(error.message)
      }
    }
  })

  // R is for Read

  server.route({
    method: 'GET',
    path: base,
    // TODO: where, payload validate, param validate, limit, id-based pagination
    config: generateConfig(auth.create, model, false, false),
    handler: async (request, h) => {
      await m('preRead', request, h)

      try {
        const posts = await model.findAll({
          /* include: [
        {
          model: models.Comment,
          as: 'comments'
        },
        {
          model: models.User,
          as: 'author'
        }
      ] */
        })
        return h.response(posts).status(200)
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })

  server.route({
    method: 'GET',
    path: `${base}/{id}`,
    // TODO: params validate
    config: generateConfig(auth.create, model, false, true),
    handler: async (request, h) => {
      await m('preReadSingle', request, h)

      try {
        const { id } = request.params
        const res = await model.findOne({
          where: { id }
          /* include: [
            {
              model: models.Comment,
              as: 'comments',
              include: [
                {
                  model: models.User,
                  as: 'author'
                }
              ]
            },
            {
              model: models.User,
              as: 'author'
            }
          ] */
        })
        if (res) {
          return h.response(res).status(200)
        } else {
          throw Boom.notFound(`${name} with ID ${id} does not exist!`)
        }
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })

  // U is for Update

  server.route({
    method: 'POST',
    path: `${base}/{id}`,
    // TODO:  payload validate, params validate
    config: generateConfig(auth.create, model, true, true),
    handler: async (request, h) => {
      await m('preUpdate', request, h)

      try {
        const { id } = request.params
        const [ updated ] = await model.update(request.payload, {
          where: { id }
        })

        if (updated) {
          const res = await model.findOne({ where: { id } })
          return h.response(res).status(200)
        } else {
          throw Boom.notFound(`${name} with ID ${id} does not exist!`)
        }
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })

  // D is for Delte

  server.route({
    method: 'DELETE',
    path: `${base}/{id}`,
    // TODO:  params validate
    config: generateConfig(auth.create, model, false, true),
    handler: async (request, h) => {
      await m('preDelete', request, h)

      try {
        const { id } = request.params
        const deleted = await model.destroy({
          where: { id }
        })
        if (deleted) {
          return h.response({ok: true}).status(204)
        } else {
          return h.response({ok: true, soft404: true}).status(204)
        }
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })
}
