const Promise = require('bluebird')

class DAO {
  static saveSiteModel(siteModel) {
    const saveSitePromise = new Promise((resolve, reject) => {
      siteModel.save((err, product) => {
        if (err) {
          reject(err)
        }
        resolve(product)
      })
    })
    return saveSitePromise
  }

  static saveSiteModels(siteModels) {
    console.log(siteModels)
    return Promise.all(siteModels.map(siteModel => {
      return DAO.saveSiteModel(siteModel)
    }))
  }

  static getStation() {
  }

  static getTanks(station) {
  }
}

module.exports = DAO
