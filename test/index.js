const lndb = require('../src/main')

const db = new lndb(__dirname)

const pg = db.init('page')

const data = pg.get('key', {
  name: 'lodash'
})

console.log(data)

console.log(__dirname, 'success')
