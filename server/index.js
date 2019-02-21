const express = require('express')
const expressWs = require('express-ws')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const Redis = require('ioredis');

const app = express()
var appWs = expressWs(app);

var redis = new Redis(process.env.REDIS_URL)

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


var roomMap = {};


async function start() {
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.ws('/ws/:offerId/:username', function(ws, req) {
    try {
      if (roomMap[req.params.offerId] == null) {
        console.log('creating room');
        console.log(req.params.offerId)
        roomMap[req.params.offerId] = []
      }
      roomMap[req.params.offerId].push(ws)
      console.log('adding client to room');
      console.log(req.params.offerId)
      ws.on('message', function(msg) {
        console.log('broadcasting to room');
        console.log(req.params.offerId)
        for (var i = 0; i < roomMap[req.params.offerId].length; i++) {
          try {
            roomMap[req.params.offerId][i].send(req.params.username + " : " + msg)
          } catch(e) {
            console.log(e)
          }
        }
      });


    } catch(e) {
      console.log(e)
    }
  });

  app.get('/api/', (req, res, next) => {
    res.send('API root')
  })

  app.use('_nuxt', nuxt.render)
  app.use('/', nuxt.render)

  // Listen the app
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
