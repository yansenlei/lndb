const path = require('path')

const Base = require('./base')
const dataManager = require('./data')

class dataStore extends Base {
  constructor(options = {}) {

    if(typeof options === 'string' && options) {
      super(options)
    }else if(typeof options === 'object' && options.path) {
      super(options.path)
    } else {
      throw new Error(
        'options.path is required'
      )
    }
    
  }

  use(name, ext, options) {
    this.setExtension(name, {
      ext,
      options
    })
  }

  init(options) {
    let name = ''
    if(typeof options === 'string' && options) {
      name = options
    } else if(typeof options === 'object' && options.name) {
      name = options.name
    } else {
      throw new Error(
        'options is required'
      )
    }
    const datapath = path.join(this.$DBPathFolder, name)
    // try {
    //   if(!fs.existsSync(datapath)) {
    //     fs.mkdirSync(datapath)
    //   }
    // } catch (e) {
    //   throw(e)
    // }
    const dm = new dataManager(datapath)
    return dm
  }
}

module.exports = dataStore
