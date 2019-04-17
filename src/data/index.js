const path = require('path')

const fileManager = require('../files')
const Base = require('../base')
const { replaseId } = require('../common/tools')

class dataManager {
  constructor (datapath) {
    this.base = new Base()
    this.fls = new fileManager(datapath)
    this.datapath = datapath
  }

  getChilds () {
    return this.fls.getChilds()
  }

  set (id, value, plugin) {
    id = replaseId(id, this.base.$DEFAULT_DB_NAME)
    this.fls.initFolder(
      this.base.$DBPathFolder,
      this.datapath,
      path.join(this.datapath, id)
    )
    if (plugin && plugin.name && this.base.extensions[plugin.name]) {
      const use = this.base.extensions[plugin.name]
      const params = {
        id: id,
        value: value
      }
      try {
        return use.ext.install(this, params, plugin.options || use.options)
      } catch (e) {
        throw e
      }
    } else {
      return this.fls.set(id, value)
    }
  }

  setAsync (id, value, plugin) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.set(id, value, plugin))
      } catch (error) {
        reject(error)
      }
    })
  }

  get (id, plugin) {
    id = replaseId(id, this.base.$DEFAULT_DB_NAME)
    if (plugin && plugin.name && this.base.extensions[plugin.name]) {
      const use = this.base.extensions[plugin.name]
      const params = {
        id: id,
        value: this.fls.get(id)
      }
      try {
        debugger
        return use.ext.install(this, params, plugin.options || use.options)
      } catch (e) {
        throw e
      }
    } else {
      return this.fls.get(id)
    }
  }

  remove (id) {
    id = replaseId(id, this.base.$DEFAULT_DB_NAME)
    return this.fls.remove(id)
  }

  clear () {
    return this.fls.clear()
  }
}

module.exports = dataManager
