var mem = {}

exports.put = function (id, hash, val, callback) {
  if (!mem[id]) {
    mem[id] = {}
  }
  if (!mem[id][hash]) {
    mem[id][hash] = 0
  }
  mem[id][hash] = val
  callback()
}

exports.get = function (id, hash, callback) {
  if (!hash && mem[id]) {
    callback(null, mem[id])
  } else if (mem[id] && mem[id][hash]) {
    callback(null, mem[id][hash])
  } else {
    callback('key not found', null)
  }
}

exports.del = function (id, callback) {
  if (mem[id]) {
    delete mem[id]
  }
  callback()
}

exports.len = function (id, callback) {
  if (mem[id]) {
    callback(null, Object.keys(mem[id]).length)
  } else {
    callback('No geohash found')
  }
}
