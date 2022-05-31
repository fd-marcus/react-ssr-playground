import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { App } from '../src/App'

const server = fastify()

const manifest = fs.readFileSync(
  path.join(__dirname, 'static/manifest.json'),
  'utf-8'
)

const assets = JSON.parse(manifest)

const init = async () => {

  server.register(fastifyStatic, {
    root: path.join(__dirname, 'static')
  })

  server.get('/', function (request, reply) {
    const component = ReactDOMServer.renderToString(React.createElement(App))

    reply
      .type('text/html')
      .send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
        <script defer="defer" src="${assets["client.js"]}"></script>
        </head>
        <body>
          <div id="root">${component}</div>
        </body>
      </html>    
    `);
  })

  await server.listen(3000)
  console.log(`Server running on http://localhost:3000`)
}

init()