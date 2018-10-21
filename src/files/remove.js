const fs = require('graceful-fs')

module.exports = function (rootFile) {
  var deleteFolder = function (path) {
    var files = []
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path)
      files.forEach(function (file, index) {
        var curPath = path + "/" + file
        if (fs.statSync(curPath).isDirectory()) { // recurse
          deleteFolder(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      });
      fs.rmdirSync(path)
    }
  }
  try {
    if (fs.lstatSync(rootFile).isDirectory()) {
      deleteFolder(rootFile)
    } else {
      fs.unlinkSync(rootFile)
    }
    return true
  } catch (e) {
    throw e
  }
}