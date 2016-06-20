var redis = require('redis')
var express = require('express')
var bodyparser = require('body-parser')
var cfenv = require('cfenv')

var app = express()
// parsing rediscloud credentials
var appEnv = cfenv.getAppEnv()
var credentials = appEnv.getServiceCreds('nf-redis')
var options = {
  port: credentials.port,
  host: credentials.host,
  password: credentials.password,
  no_ready_check: true
}
var client = redis.createClient(options)

client.on('error', function (err) {
  console.error('redis error', err)
})

client.auth(credentials.password)

app.use(bodyparser.json())

// static route for OpenAPI spec
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.json({message: 'POST to /{username} to set. GET /{username} to see.'})
})

app.post('/:username', function (req, res) {
//  console.log(require('util').inspect(req.body, { depth: null }))
  client.set(req.params.username, JSON.stringify(req.body), function (err, reply) {
    if (err) {
      console.error('redis error', err)
      res.status(500).send('redis error')
    } else {
      res.status(201).send(req.body)
    }
  })
})

app.get('/:username', function (req, res) {
  client.get(req.params.username, function (err, result) {
    if (err) {
      console.error('redis error', err)
      res.status(500).send('redis error\n')
    } else {
      if (result === null) {
        res.status(404).send('Not Found\n')
      } else  {
        //console.log(result.toString())
        res.setHeader('Content-Type','application/json')
        res.send(result.toString())
      }
    }
  })
})

var port = appEnv.port
app.listen(port)
console.log('listening on port ' + port)
