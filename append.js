const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')
const fs = require('fs')
const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()

const csv_object = function (buff) {
  var tuples = parse(buff)
  var object = {}
  tuples.map(([k, v]) => object[k] = v)
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

app.use(fileUpload());

app.post('/upload', function (req, res) {
  if (!req.files || !req.files.csvFiles)
    return res.status(400).send('No files were uploaded.')

  if (!req.files.csvFiles.length)
     return res.status(400).send('Send more than one file.')

  const csvFiles = req.files.csvFiles

  const objs = csvFiles.map(x => csv_object(x.data))
  const appended = append(objs)
  const rows = obj_as_rows(appended)
  const csv = stringify(rows)

  var filename = req.body.outputFile + '.csv'
  res.setHeader('Content-disposition', 'attachment; filename=' + filename)
  res.setHeader('Content-type', 'text/csv')
  res.send(csv)
})

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on http://localhost:3000'))
