module.exports = class book {
  constructor(db) {
    this.controller = db.init('book')
  }

  getList() {
    
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
}