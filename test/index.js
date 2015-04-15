var test = require('tape'),
  fs = require('fs'),
  geomash = require('../'),
  points = JSON.parse(fs.readFileSync(__dirname + '/data/points.geojson')),
  polygons = JSON.parse(fs.readFileSync(__dirname + '/data/polygons.geojson'))

test('aggregate a single point', function (t) {
  var id = 'geomash-point-test',
    precision = 9

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add a single point
    geomash.add(id, points.features[0], precision, function (err) {
      t.equal(err, undefined)
      // get the geohash
      geomash.dump(id, function (err, agg) {
        t.equal(err, null)
        t.deepEqual(agg, { '9qh5kke2d': 1 })
        t.end()
      })
    })
  })

})

test('aggregate a single polygon', function (t) {
  var id = 'geomash-polygon-test',
    precision = 9

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add a single point
    geomash.add(id, polygons.features[0], precision, function (err) {
      t.equal(err, undefined)
      // get the geohash
      geomash.dump(id, function (err, agg) {
        t.equal(err, null)
        t.deepEqual(agg, { '9qrb7cx4v': 1})
        t.end()
      })
    })
  })

})
