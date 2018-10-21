module.exports = class page {
  constructor(db) {
    this.controller = db.init('page')
    // this.data = {
    //   id: '',
    //   name: '',
    //   create_time: '',
    //   last_update: '',
    //   cells: ''
    // }
  }

  getData(id) {
    return this.controller.get(id)
  }

  setData(id, data) {
    return this.controller.set(id, data)
  }

  remove(id) {
    return this.controller.remove(id)
  }

  getChilds() {
    return this.controller.getChilds()
  }
}