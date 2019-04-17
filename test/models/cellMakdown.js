const cell = require('./cell')

module.exports = class cellMarkdown extends cell {
  getFoot(id) {
    return id
  }
}