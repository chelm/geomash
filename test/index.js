var test = require('tape'),
  fs = require('fs'),
  geomash = require('../')(),
  points = JSON.parse(fs.readFileSync(__dirname + '/data/points.geojson')),
  polygons = JSON.parse(fs.readFileSync(__dirname + '/data/polygons.geojson'))

test('aggregate a single point w/o a geom', function (t) {
  var precision = 9,
  feature = { type: 'Feature', properties: {}, geometry: null },
  hash = geomash.createGeoHash(feature, precision)
  t.equal(hash, undefined)
  t.end()
})

test('aggregate a single point w/o a geom', function (t) {
  var id = 'geomash-missing-geom-test',
  precision = 9,
  feature = { type: 'Feature', properties: {}, geometry: null }

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add a single point
    geomash.add(id, feature, precision, function (err) {
      t.equal(err, 'geohash not created')
      // get the geohash
      geomash.dump(id, function (err, agg) {
        t.equal(err, 'key not found')
        t.end()
      })
    })
  })
})

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
        t.deepEqual(agg, { 'dp17t9b2g': 1 })
        t.end()
      })
    })
  })

})

test('aggregate a single point and get the count', function (t) {
  var id = 'geomash-point-test-count',
    precision = 9

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add a single point
    geomash.add(id, points.features[0], precision, function (err) {
      t.equal(err, undefined)
      // get the geohash
      geomash.count(id, function (err, count) {
        t.equal(err, null)
        t.equal(count, 1)
        t.end()
      })
    })
  })

})

test('aggregate many points', function (t) {
  t.plan(4)
  var id = 'geomash-points-test',
    precision = 3

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add points
    geomash.addMany(id, points.features, precision, function (err) {
      t.equal(err, undefined)
      // get the geohash
      geomash.dump(id, function (err, agg) {
        t.equal(err, null)
        t.deepEqual(agg, { 'dnc': 27, 'dnf': 3, 'dp1': 63, 'dp4': 7 })
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

test('aggregate 2 arrays of points', function (t) {
  t.plan(4)
  var id = 'geomash-points-test-multi',
    precision = 3

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add points
    geomash.addMany(id, points.features, precision, function (err) {
      t.equal(err, undefined)

      geomash.addMany(id, points.features, precision, function (err) {
        t.equal(err, undefined)

        // get the geohash
        geomash.dump(id, function (err, agg) {
          console.log(err, agg)
          t.deepEqual(agg, { 'dnc': 54, 'dnf': 6, 'dp1': 126, 'dp4': 14 })
          // t.end()
        })
      })
    })
  })

})
