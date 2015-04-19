# Geomash

[![npm version](https://img.shields.io/npm/v/geomash.svg?style=flat-square)](https://www.npmjs.com/package/geomash)
[![build status](https://img.shields.io/travis/chelm/geomash.svg?style=flat-square)](https://travis-ci.org/chelm/geomash)

A node.js module for building geohash aggregations from GeoJSON files.

## Why geohashes

This works is the result of development around aggregating lots of data into geohashes. The idea is that we can aggregate data on the server and serve these relatively small json files that tell us the count of data with a fine grid of geohashes. The geohash can be re-aggregated based on zoom and provide a nice method for view clusters of data at different scales. 

## Usage

There are 2 ways that you can use geomash: on the command line and as a node.js module.

### Command Line

To use geomash as a command line utility you have to install it globally first

```
npm install geomash -g
```

This installs an executable called `geomash` that you can use to create some aggregations.

``` 
Usage: geomash -i [id string] -f [input file] -o [output file] -p [precision number]

Options:
  -i  [required]
  -f  [default: "none"]
  -o  [default: "none"]
  -p  [default: "9"]
```

You can also pipe geojson files into geomash like so: 

```bash
cat data.geojson | geomash -i myid -p 6
```

### Node Module

To use geomash as a node module you also need to install it via `npm install geomash`. Then in side your node app you would do something like

```javascript
// the geomash module return a function so that it can accept a redis port and host at require time.
// passing nothing to geomash tells it to use a purely in-memory cache
var geomash = require('geomash')({
  redis: {
    port: 6329,
    host: '127.0.0.1'
  }
})

geomash.add(id, feature, precision, function (err) {
  geomash.dump(id, function (err, agg) {
    console.log(agg)
  })
})
```

Geomash can also be used with a redis backend so it aggregations work can be done in a more distributed way. To use redis you pass in a json object containing a `host` and a `port` of your redis instance like so:

``javascript
var geomash = require('require')({
  host: '127.0.0.1',
  port: 6379  
})

// then everything it same

```

## Docs

Geomash exposes these methods:

### Add

Adds a feature to a geohash aggregation.

`geomash.add(id, feature, precision, callback)`

### Clear

Clears the geohash aggregation for a given id.

`geomash.clear(id, callback)`

### Dump

Dumps out the geohash aggregation for a given id.

`geomash.dump(id, callback)`

### Insert

Inserts geohash aggregation object for a given id.

`geomash.insert(id, agg, callback)`

### createGeoHash

Creates geohash key from a feature.

`geomash.createGeoHash(feature, precision, callback)`

## License

[ISC](license.txt)
