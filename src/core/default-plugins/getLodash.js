const lodash = require('lodash')
const EventEmitter = require('events')

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
      if (watcher) {
        watcher.emit('read', id, d)
      }
      const r = d && d.data ? d.data : undefined
      return plant(r)
    }

    watcher = null

    db.getWatcher = () => {
      if (!watcher) {
        watcher = new EventEmitter()
      }
      return watcher
    }
    
    db.write = returnValue => {
      const data = db.getState()
      LN.fls.set(id, data)
      if (watcher) {
        watcher.emit('write', id, data, returnValue)
      }
      return returnValue
    }

    db.getState = () => db.__wrapped__

    db.setState = state => plant(state)

    return db.read()
  }
}