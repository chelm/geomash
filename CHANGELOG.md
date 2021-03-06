# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2015-04-28
### Added
* added a count method that will return the length of the geohash keys 


## [1.1.2] - 2015-04-20
### Changed
* fixed the way redis connects. Was passing a config object but needed to explicit about host and port in the `createClient(port, host)` string

## [1.1.1] - 2015-04-20
### Changed
* Fixed bug with missing geometries on features

## [1.1.0] - 2015-04-16
### Changed 
* replaced leveldb with redis to support using geomash in a more distributed way
* added an option in-mem db used for CLI

## [1.0.4] - 2015-04-16
### Added
* new method `addMany` that can aggregate arrays of features

## [1.0.3] - 2015-04-15
### Changed
* Made the CLI tool not use the DB since persistance is not needed there

### Added 
* Created 2 more public methods on geomash: `createGeoHash` and `insert` 

## [1.0.2] - 2015-04-15
### Added 
* Created an option to bin/geomash to print each feature with `-v`

## [1.0.1] - 2015-04-15
## Changed
* Fixed support for streaming local files into geomash

## [1.0.0] - 2015-04-15
### Added 
* Version 1 has support to create geohash aggregations inside leveldb
* Support for using as node module and a CLI script that can stream data 

[1.2.0]: https://github.com/chelm/geomash/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/chelm/geomash/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/chelm/geomash/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/chelm/geomash/compare/v1.0.4...v1.1.0
[1.0.3]: https://github.com/chelm/geomash/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/chelm/geomash/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/chelm/geomash/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/chelm/geomash/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/chelm/geomash/releases/tag/v1.0.0
