'use strict'

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

function generateConfig (auth, model, valPayload, valId, valPage) {
  const out = { validate: {} }

  if (valId) {
    // TODO: check if this works
    out.validate.params = Joi.object({
      id: Joi.number().integer().required()
    })
  }

  if (valPayload) {
    // TODO: fix joi-sequelize and use that for payload validate
  }

  if (valPage) {
    out.validate.query = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      perPage: Joi.number().integer().default(25).max(1024)
    })
  }

  if (auth) {
    let [strategy, scope, mode] = auth.split(':')
    scope = scope ? scope.split(',') : null
    mode = mode || null // nullify empty string

    const _auth = {strategy, scope, mode}

    for (const key in _auth) {
      if (_auth[key] != null) {
        if (!out.auth) {
          out.auth = {}
        }

        out.auth[key] = _auth[key]
      }
    }
  }

  return out
}

module.exports = ({server, model, name, prefix, auth, middleware}) => {
  // TODO: use joi
  if (!middleware) { middleware = {} }
  if (!auth) { auth = {} }

  if (!prefix) { prefix = '' }

  const base = `${prefix}/${name}`

  async function m (type, stage, request, h, result) {
    let parsed = { op: stage, performer: request.auth }

    switch (type) {
      case 'pre': {
        parsed.target = request.params.id || 'any'
        parsed.data = request.payload
        break
      }
      case 'post': {
        parsed.target = request.params.id || 'any'
        parsed.data = request.payload

        // TODO: h.takeover() support

        parsed.result = result
        break
      }
      default: {
        throw new TypeError(type)
      }
    }

    if (middleware[name]) {
      const a = Array.isArray(middleware[name]) ? middleware[name] : [middleware[name]]
      for (let i = 0; i < a.length; i++) {
        await a[i](parsed, request, h)
      }
    }
  }

  // C is for Create

  server.route({
    method: 'POST',
    path: base,
    // TODO:  payload validate
    config: generateConfig(auth.create, model, true, false, false),
    handler: async (request, h) => {
      await m('preCreate', { op: 'create', performer: request.auth, data: request.payload }, request, h)

      try {
        const res = await model.create(request.payload)
        return h.response(res).code()
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
    config: generateConfig(auth.read, model, false, false, true),
    handler: async (request, h) => {
      await m('pre', 'read', request, h)

      // TODO: where filters
      const {page, perPage} = request.query

      try {
        // TODO: add include
        // TODO: where filter, limit, id-based pagination

        const offset = (page - 1) * perPage

        const res = await model.findAndCountAll({
          limit: perPage,
          offset,
          order: [
            ['id', 'ASC']
          ]
        })

        await m('post', 'read', request, h, res)

        return h.response(res.rows)
          .header('X-Total-Count', res.count)
          .header('X-Current-Page', page)
          .header('X-Per-Page', perPage)
          .header('X-Has-Next', JSON.stringify(offset < res.count))
          .header('X-Has-Prev', JSON.stringify(Boolean(offset)))
          .code(200)
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })

  server.route({
    method: 'GET',
    path: `${base}/{id}`,
    // TODO: params validate
    config: generateConfig(auth.read, model, false, true, false),
    handler: async (request, h) => {
      await m('pre', 'read', request, h)

      try {
        const { id } = request.params
        const res = await model.findOne({
          where: { id }
          // TODO: add include
        })
        await m('post', 'read', request, h, res)

        if (res) {
          return h.response(res).code(200)
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
    config: generateConfig(auth.update, model, true, true, false),
    handler: async (request, h) => {
      await m('pre', 'update', request, h)

      try {
        const { id } = request.params
        const [ updated ] = await model.update(request.payload, {
          where: { id }
        })

        await m('post', 'update', request, h, updated)

        if (updated) {
          const res = await model.findOne({ where: { id } })
          return h.response(res).code(200)
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
    config: generateConfig(auth.delete, model, false, true, false),
    handler: async (request, h) => {
      await m('pre', 'delete', request, h)

      try {
        const { id } = request.params
        const deleted = await model.destroy({
          where: { id }
        })

        await m('post', 'delete', request, h, deleted)

        if (deleted) {
          return h.response({ok: true}).code(204)
        } else {
          return h.response({ok: true, soft404: true}).code(204)
        }
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })
}

module.exports.generateConfig = generateConfig
