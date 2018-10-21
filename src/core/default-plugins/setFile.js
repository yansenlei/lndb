const path = require('path')

const fs = require('fs')
const { isBase64 } = require('../../common/tools.js')

module.exports = {
  install(LN, params = {}, options = {
    folder: 'set-file',
    filename: undefined
  }) {
    if(!options.filename) {
      throw 'options.filename is required'
    }
    if(!options.folder) {
      options.folder = 'set-file'
    }
    let id = params.id
    let value = undefined
    if(Buffer.isBuffer(params.value)) {
      value = params.value
    } else if(isBase64(params.value)) {
      value = Buffer.from(params.value, 'base64')
    } else if(isBase64(params.value)) {
      value = Buffer.from(params.value, 'base64')
    } else {
      throw 'Types that do not support value.'
    }
    LN.fls.initFolder(path.join(LN.fls.datapath, id, options.folder))
    const filepath = path.join(LN.fls.datapath, id, options.folder, options.filename)
    fs.writeFileSync(filepath, value)
    return id
  }
}
