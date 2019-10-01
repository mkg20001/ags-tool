'use strict'

const CRUD = require('./crud')

const Boom = require('@hapi/boom')

const fs = require('fs')
const path = require('path')

module.exports = async (server, sequelize, config) => {
  // SELECT DISTINCT "deltas"."padId" FROM deltas
  // to list all pads

  const templates = fs
    .readdirSync(config.templates)
    .map(template => {
      return [template, String(fs.readFileSync(path.join(config.templates, template)))]
    })
    .reduce((a, b) => {
      a[b[0]] = b[1]
      return a
    }, {})

  const daPad = await require('da-pad/src/api')(server, sequelize, {
    canViewPad: async () => {
      return false
    },
    canEditPad: async () => {
      return false
    }
  }) // returns {create(id, initialContent), delete(id)}

  server.route({
    method: 'GET',
    path: '/api/v0/pads/templates',
    // TODO:  payload validate
    config: CRUD.generateConfig('session:admin', daPad.Delta, false, false, false),
    handler: async (request, h) => {
      return Object.keys(templates)
    }
  })

  server.route({
    method: 'POST',
    path: '/api/v0/pads',
    // TODO:  payload validate
    config: CRUD.generateConfig('session:admin', daPad.Delta, false, false, false),
    handler: async (request, h) => {
      const {template, id} = request.payload

      if (!templates[template]) {
        throw Boom.badRequest('Template not found')
      }

      return daPad.create(id, templates[template])
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v0/pads',
    config: CRUD.generateConfig('session:admin', daPad.Delta, false, false, true),
    handler: async (request, h) => {
      const {page, perPage} = request.query

      try {
        const offset = (page - 1) * perPage

        const res = {
          // all hail postgres master loki :P (thx for the query)
          rows: (await sequelize.query(`SELECT "delta"."padId", min("delta"."createdAt") AS created, max("delta"."createdAt") AS updated FROM delta group by "delta"."padId" OFFSET ${offset} LIMIT ${perPage};`))[0],
          count: (await sequelize.query('SELECT COUNT(DISTINCT "delta"."padId") FROM delta;'))[0].count
        }

        const out = res.rows.map(id => { return { id } })

        return h.response(out)
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
    method: 'DELETE',
    path: '/api/v0/pads/{id}',
    config: CRUD.generateConfig('session:admin', daPad.Delta, false, true, false),
    handler: async (request, h) => {
      try {
        const { id: padId } = request.params

        await daPad.delete(padId)

        return h.response({ok: true}).code(204)
      } catch (error) {
        throw Boom.badImplementation(error.message)
      }
    }
  })
}
