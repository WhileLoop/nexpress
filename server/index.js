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

  app.ws('/ws/', function(ws, req) {
    ws.on('message', function(msg) {
      // offerid,username,msg
      msg_stuff = msg.split(',');
      new_msg = msg_stuff[1] + " : " + msg_stuff[2];
      redis.rpush(msg_stuff[0], new_msg);
      redis.sadd(msg_stuff[0]+"_users", msg_stuff[1]);
      appWs.getWss().clients.forEach((client) => {
        if (redis.sismember(msg_stuff[0]+"_users", msg_stuff[1])) {
          client.send(new_msg);
        }
      });
    });
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
