const fs = require('graceful-fs')

module.exports = function (logpath, msg, {iserr = false} = {}) {
  try {
    fs.appendFileSync(logpath, `${new Date().toLocaleString()} ${(iserr ? 'Error:' : '') + msg} \n`)
    if(iserr) {
      throw new Error(
        msg
      )
      // console.error(msg)
    } else {
      console.log(msg)
    }
  } catch (e) {
    throw e
  }
}