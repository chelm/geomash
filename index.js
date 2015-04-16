var geohash = require('ngeohash'),
  levelup = require('levelup'),
  async = require('async'),
  centroid = require('turf-centroid'),
  db = levelup(__dirname + '/geomashdb', { valueEncoding: { encode: JSON.stringify, decode: JSON.parse } })

exports.createGeoHash = function (feature, precision) {
  if (feature.geometry.type !== 'Point') {
    feature = centroid(feature)
  }

  var pnt = feature.geometry.coordinates
  return geohash.encode(pnt[1], pnt[0], precision)
}

exports.add = function (id, feature, precision, callback) {
  var ghash = this.createGeoHash(feature, precision)

  db.get(id, function (err, entry) {
    if (err || !entry) {
      var agg = {}
      agg[ghash] = 1
      db.put(id, agg, {sync: true}, callback)
    } else {
      if (!entry) {
        entry = {}
      }
      if (!entry[ghash]) {
        entry[ghash] = 1
      } else {
        entry[ghash]++
      }
      db.put(id, entry, {sync: true}, callback)
    }
  })
}

/**
 * Adds many features to an aggregation at once
 * @param {string} the id of the aggregation to add data to
 * @param {array} an array of geojson features
 * @param {function} the callback to be called when the features are all in
 */
exports.addMany = function (id, features, precision, callback) {
  var self = this
  var q = async.queue(function (feature, cb) {
    self.add(id, feature, precision, cb)
  }, 1)

  q.drain = function () {
    callback()
  }

  q.push(features, function () {})
}

exports.clear = function (id, callback) {
  db.del(id, function (err) {
    if (err) {
      return callback(err)
    }
    callback(null, true)
  })
}

exports.dump = function (id, callback) {
  db.get(id, {}, function (err, entry) {
    if (err) {
      return callback(err)
    }
    callback(null, entry)
  })
}

exports.insert = function (id, agg, callback) {
  db.put(id, agg, function (err) {
    if (err) {
      return callback(err)
    }
    callback()
  })
}
