const fs = require('graceful-fs')
const path = require('path')

const Remove = require('./remove')
const Base = require('../base')

class fileManager {
  constructor (datapath) {
    this.base = new Base()
    this.datapath = datapath
    this.initFolder(this.base.$DBPathFolder, this.datapath)
  }

  initFolder () {
    const args = Array.prototype.slice.call(arguments, 0)
    args.map(o => {
      if (!fs.existsSync(o)) {
        fs.mkdirSync(o)
      }
    })
  }

  getChilds () {
    return this.recursionChilds(this.datapath)
  }

  recursionChilds (filename, pre, o) {
    if (!fs.existsSync(filename) || !fs.lstatSync(filename).isDirectory()) {
      return undefined
    }
    const object = o || {}
    const files = fs.readdirSync(filename)
    for (let i = 0; i < files.length; i++) {
      let fileKey = pre ? path.join(pre, files[i]) : files[i]
      let filePath = path.join(filename, files[i])
      let stat = {}
      stat = fs.statSync(filePath)
      stat['path'] = filePath
      object[files[i]] = stat
      if (fs.lstatSync(filePath).isDirectory()) {
        object[files[i]]['child'] = this.recursionChilds(filePath, fileKey)
      }
    }
    return object
  }

  get (id) {
    this.initFolder(
      this.base.$DBPathFolder,
      this.datapath,
      path.join(this.datapath, id)
    )
    let result = this.recursionChilds(path.join(this.datapath, id))
    const jsondatapath = path.join(this.datapath, id, this.base.$DATA_NAME)
    const txtdatapath = path.join(this.datapath, id, this.base.$TXT_NAME)
    if (fs.existsSync(jsondatapath)) {
      result.data = JSON.parse(fs.readFileSync(jsondatapath, 'utf-8'))
    } else if (fs.existsSync(txtdatapath)) {
      result.txt = fs.readFileSync(txtdatapath, 'utf-8')
    }
    return result
  }

  set (id, value) {
    const idpath = path.join(this.datapath, id)
    if (typeof value === 'object') {
      fs.writeFileSync(
        path.join(idpath, this.base.$DATA_NAME),
        JSON.stringify(value)
      )
    } else if (typeof value === 'string') {
      fs.writeFileSync(path.join(idpath, this.base.$TXT_NAME), value)
    }
    return id
  }

  remove (id) {
    const idpath = path.join(this.datapath, id)
    if (!fs.existsSync(idpath)) {
      return true
    }
    if (Remove(idpath)) {
      return id
    }
  }

  clear () {
    if (!fs.existsSync(this.datapath)) {
      return true
    }
    Remove(this.datapath)
    return true
  }
}

module.exports = fileManager
