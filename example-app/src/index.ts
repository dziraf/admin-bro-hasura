import express from 'express'
import AdminBro from 'admin-bro'
import { buildRouter } from '@admin-bro/express'

import buildResource from '../../src/resource'

import graphqlSchema from '../schema.json'

const PORT = 3000

const run = async () => {
  const app = express()

  const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || '<your hasura graphql url>'

  const Drink = await buildResource({
    name: 'drink',
    parent: 'Hasura',
    hasura: {
      schema: graphqlSchema.__schema,
      endpoint: graphqlEndpoint,
      pkProperty: 'id',
      relationships: {},
    }
  })

  const Person = await buildResource({
    name: 'person',
    parent: 'Hasura',
    hasura: {
      schema: graphqlSchema.__schema,
      endpoint: graphqlEndpoint,
      pkProperty: 'person_id',
      relationships: {
        drink: {
          referenceField: 'favorite_drink_id',
          resourceName: 'drink'
        }
      }
    }
  })

  const admin = new AdminBro({
    resources: [Drink, Person],
    rootPath: '/app',
  })
  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()