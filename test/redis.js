var test = require('tape'),
  fs = require('fs'),
  geomash = require('../')({
    redis: {
      'host': '127.0.0.1',
      'port': 6379
    }
  }),
  points = JSON.parse(fs.readFileSync(__dirname + '/data/points.geojson'))

test('aggregate a single point and get the count', function (t) {
  var id = 'geomash-point-test-count',
    precision = 9

  // clear out the DB
  geomash.clear(id, function (err) {
    t.equal(err, null)

    // add a single point
    geomash.add(id, points.features[0], precision, function (err) {
      t.equal(err, null)
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
        t.deepEqual(agg, { 'dnc': '27', 'dnf': '3', 'dp1': '63', 'dp4': '7' })
        t.end()
      })
    })
  })

})
