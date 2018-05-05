const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')
var fs = require('fs')

const csv_object = function (fn) {
  var content = fs.readFileSync(fn, 'utf-8')
  var tuples = parse(content)
  var object = {}
  tuples.map(([k,v]) => object[k] = v)
  return object;
}

const append = function (objs) {
  var res = {}
  objs.map(o =>
    Object.keys(o).map(k => {
      if (res.hasOwnProperty(k)) {
        res[k].push(o[k])
      }
      else {
        res[k] = [o[k]]
      }
    })
  )
  return res;
}

const obj_as_rows = function (obj) {
  return Object.keys(obj).map(k => [k].concat(obj[k]))
}

const objs = process.argv.slice(2).map(csv_object)
const appended = append(objs)
const rows = obj_as_rows(appended)
const csv = stringify(rows)

fs.writeFileSync('output.csv', csv)
