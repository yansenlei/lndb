const cell = require('./cell')

module.exports = class cellMarkdown extends cell {
  setUnzip(id, data) {
    return this.controller.set(id, data, {
      ext: 'unzip'
    })
  }
}