const path = require('path')

const admZip = require('adm-zip')
const { isBase64 } = require('../../common/tools.js')

module.exports = {
  install(LN, params = {}, options = {
    folder: undefined
  }) {
    let id = params.id
    let value = undefined
    if(Buffer.isBuffer(params.value)) {
      value = params.value
    } else if(isBase64(params.value)) {
      value = Buffer.from(params.value, 'base64')
    } else {
      throw 'Types that do not support value.'
    }
    var zip = new admZip(value)
    const idpath = path.join(LN.fls.datapath, id)
    zip.extractAllTo(idpath, true)
    return id
  }
}
