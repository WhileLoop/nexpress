const express = require('express')
const expressWs = require('express-ws')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = express()


var ws = expressWs(app);



// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.ws('/ws/', function(ws, req) {
    ws.on('message', function(msg) {
      console.log(msg)
    });
  });

  app.get('/api/', (req, res, next) => {
    res.send('API root')
  })

  // Give nuxt middleware to express
  app.use('_nuxt', nuxt.render)
  app.use('/', nuxt.render)

  // const wss = new SocketServer.Server({ app });

  // wss.on('connection', (ws) => {
  //   console.log('Client connected');
  //   ws.on('close', () => console.log('Client disconnected'));
  // });



  setInterval(() => {
    ws.getWss().clients.forEach((client) => {
      client.send(new Date().toTimeString());
    });
  }, 1000);


  // Listen the app
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}





start()

