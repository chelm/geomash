var geohash = require('ngeohash'),
  async = require('async'),
  centroid = require('turf-centroid')

var db = require('./lib/in-memory.js')

module.exports = function (config) {
  if (config && config.redis) {
    db = require('./lib/redis.js')(config)
  }

  this.createGeoHash = function (feature, precision) {
    if (!feature.geometry || !feature.geometry.coordinates) {
      return
    }

    if (feature.geometry.type !== 'Point') {
      feature = centroid(feature)
    }
    var pnt = feature.geometry.coordinates
    return geohash.encode(pnt[1], pnt[0], precision)
  }

  this.add = function (id, feature, precision, callback) {
    var ghash = this.createGeoHash(feature, precision)

    if (!ghash) {
      return callback('geohash not created', null)
    }

    db.get(id, ghash, function (err, entry) {
      if (err || !entry) {
        db.put(id, ghash, 1, callback)
      } else {
        var val = parseInt(entry, 0) + 1
        db.put(id, ghash, val, callback)
      }
    })
  }

  /**
   * Adds many features to an aggregation at once
   * @param {string} the id of the aggregation to add data to
   * @param {array} an array of geojson features
   * @param {function} the callback to be called when the features are all in
   */
  this.addMany = function (id, features, precision, callback) {
    var self = this
    var q = async.queue(function (feature, cb) {
      self.add(id, feature, precision, cb)
    }, 1)

    q.drain = function () {
      callback()
    }

    q.push(features, function () {})
  }

  this.clear = function (id, callback) {
    db.del(id, function (err) {
      if (err) {
        return callback(err)
      }
      callback(null, true)
    })
  }

  this.dump = function (id, callback) {
    db.get(id, null, function (err, entry) {
      if (err) {
        return callback(err)
      }
      callback(null, entry)
    })
  }

  this.insert = function (id, agg, callback) {
    db.put(id, agg, function (err) {
      if (err) {
        return callback(err)
      }
      callback()
    })
  }

  return this
}
