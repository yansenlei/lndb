const lodash = require('lodash')

module.exports = {
  install(LN, params = {}, options = {}) {
    let id = params.id

    // Create a fresh copy of lodash
    const _ = lodash.runInContext()
    const db = _.chain({})

    // Add write function to lodash
    // Calls save before returning result
    _.prototype.write = _.wrap(_.prototype.value, function(func) {
      const funcRes = func.apply(this)
      return db.write(funcRes)
    })

    function plant(state) {
      db.__wrapped__ = state
      return db
    }

    // Lowdb API
    // Expose _ for mixins
    db._ = _

    db.read = () => {
      const d = LN.fls.get(id)
      const r = d && d.data ? d.data : undefined
      return plant(r)
    }

    db.write = returnValue => {
      LN.fls.set(id, db.getState())
      return returnValue
    }

    db.getState = () => db.__wrapped__

    db.setState = state => plant(state)

    return db.read()
  }
}