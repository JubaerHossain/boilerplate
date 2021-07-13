import { BASE_URL_SERVER } from 'config/baseURL'
import fs from 'fs'
import _ from 'lodash'
import _path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const { APP_NAME, NODE_ENV, URL_SERVER_STAGING, URL_SERVER_PRODUCTION } =
  process.env

const ENV = NODE_ENV || 'development'

const urlServerStaging = URL_SERVER_STAGING || 'http://api-staging.example.com'
const urlServerProduction = URL_SERVER_PRODUCTION || 'http://api.example.com'

const baseRoutes = _path.resolve('./docs/swagger/routes')
// const baseSchemas = _path.resolve('./docs/swagger/schemas')

const getPathRoutes = (path) => `${baseRoutes}${path}`
// const getPathSchemes = (path) => `${baseSchemas}${path}`

const getDocs = (basePath, getPath) => {
  return fs.readdirSync(basePath).reduce((acc, file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const data = require(getPath(`/${file}`))
    // eslint-disable-next-line no-param-reassign
    acc = {
      ...acc,
      ...data,
    }
    return acc
  }, {})
}

const docsSources = getDocs(baseRoutes, getPathRoutes)
// const docsSchemes = getDocs(baseSchemas, getPathSchemes)

let baseURLServer = []

if (ENV === 'development') {
  baseURLServer = [
    {
      url: `${BASE_URL_SERVER}/v1`,
      description: `${_.capitalize(ENV)} Server`,
    },
    {
      url: `${urlServerStaging}/v1`,
      description: 'Staging Server',
    },
    {
      url: `${urlServerProduction}/v1`,
      description: 'Production Server',
    },
  ]
} else {
  baseURLServer = [
    {
      url: `${BASE_URL_SERVER}/v1`,
      description: `${_.capitalize(ENV)} Server`,
    },
  ]
}

module.exports = function generateDocs(app) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      servers: baseURLServer,
      // security: [  //Set GLOBAL
      //   {
      //     auth_token: []
      //   }
      // ],
      components: {
        securitySchemes: {
          auth_token: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description:
              'JWT Authorization header using the JWT scheme. Example: “Authorization: JWT {token}”',
          },
        },
        // schemas: docsSchemes,
        parameters: {
          page: {
            in: 'query',
            name: 'page',
            required: false,
            default: 1,
          },
          pageSize: {
            in: 'query',
            name: 'pageSize',
            required: false,
            default: 10,
          },
          filtered: {
            in: 'query',
            name: 'filtered',
            required: false,
            default: [],
            description: 'Example: [{"id": "email", "value": "anyValue"}]',
          },
          sorted: {
            in: 'query',
            name: 'sorted',
            required: false,
            default: [],
            description: 'Example: [{"id": "createdAt", "desc": true}]',
          },
        },
      },
      info: {
        title: `Api ${APP_NAME} Documentation`,
        version: '1.0.0',
      },
      paths: docsSources,
    },
    apis: [],
  }

  let swaggerOptURL = []

  if (ENV === 'development') {
    swaggerOptURL = [
      {
        url: `${BASE_URL_SERVER}/v1/api-docs.json`,
        name: `${_.capitalize(ENV)} Server`,
      },
      {
        url: `${urlServerStaging}/v1/api-docs.json`,
        name: 'Staging Server',
      },
      {
        url: `${urlServerProduction}/v1/api-docs.json`,
        name: 'Production Server',
      },
    ]
  } else {
    swaggerOptURL = [
      {
        url: `${BASE_URL_SERVER}/v1/api-docs.json`,
        name: `${_.capitalize(ENV)} Server`,
      },
    ]
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)
  const optionsSwaggerUI = {
    explorer: true,
    swaggerOptions: {
      urls: swaggerOptURL,
    },
  }

  app.get('/v1/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  app.use('/v1/api-docs', swaggerUI.serve)
  app.get('/v1/api-docs', swaggerUI.setup(swaggerSpec, optionsSwaggerUI))
}
