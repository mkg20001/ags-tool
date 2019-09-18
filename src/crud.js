'use strict'

const Boom = require('@hapi/boom')

function generateConfig (auth, model) {

}

module.exports = ({server, model, name, prefix, auth}) => {
  const base = `${prefix}/${name}`

  // C is for Create

  server.route({
    method: 'POST',
    path: base,
    // TODO:  payload validate
    handler: async (request, h) => {
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
    handler: async (request, h) => {
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
    handler: async (request, h) => {
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
    handler: async (request, h) => {
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
    handler: async (request, h) => {
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
