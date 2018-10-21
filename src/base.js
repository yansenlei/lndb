const path = require('path')
const fs = require('graceful-fs')

const pringlog = require('./common/log')

const DEFAULT_DB_NAME = '__lndb__'
const LOG_FILE_NAME = '__log__'
const DATA_NAME = 'data.json'
const TXT_NAME = 'data.txt'

const setUnzip = require('./core/default-plugins/setUnzip')
const setFile = require('./core/default-plugins/setFile')
const getLodash = require('./core/default-plugins/getLodash')

class Base {
  constructor(DBPathFolder) {
    if(Base.prototype.instance === undefined) {
      // default extensions
      this.extensions = {
        'unzip': {
          ext: setUnzip,
          options: {}
        },
        'lodash': {
          ext: getLodash,
          options: {}
        },
        'setfile': {
          ext: setFile,
          options: {}
        }
      }

      Object.defineProperty(this, '$DATA_NAME', {
        value: DATA_NAME
      })
      Object.defineProperty(this, '$TXT_NAME', {
        value: TXT_NAME
      })
      Object.defineProperty(this, '$DBPathFolder', {
        value: path.join(DBPathFolder, DEFAULT_DB_NAME)
      })
      Object.defineProperty(this, '$DEFAULT_DB_NAME', {
        value: DEFAULT_DB_NAME
      })

      // try {
      //   if(!fs.existsSync(this.$DBPathFolder)) {
      //     fs.mkdirSync(this.$DBPathFolder)
      //   }
      // } catch (e) {
      //   throw e
      // }

      Base.prototype.instance = this
    } else {
      return Base.prototype.instance
    }
  }

  logger(msg, iserr) {
    const log_path = path.join(this.$DBPathFolder, LOG_FILE_NAME)
    pringlog(log_path, msg, { iserr })
  }

  setExtension(name, ext) {
    this.extensions[name] = ext
  }

  getExtension(name) {
    if(name) {
      return this.extensions[name]
    }
    return this.extensions
  }
}

module.exports = Base
