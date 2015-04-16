var redis = require('redis')

module.exports = function (config) {
  var client = redis.createClient(config)

  this.put = function (id, hash, val, callback) {
    client.hset(id, hash, val, callback)
  }

  this.get = function (id, hash, callback) {
    if (!hash) {
      client.hgetall(id, function (err, res) {
        callback(err, res)
      })
    } else {
      client.hget(id, hash, function (err, res) {
        callback(err, res)
      })
    }
  }

  this.del = function (id, callback) {
    client.del(id, callback)
  }

  return this

}
