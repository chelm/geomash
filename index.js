var geohash = require('ngeohash'),
  levelup = require('levelup'),
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
