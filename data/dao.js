const Promise = require('bluebird')
const { SiteModel } = require('./../models')

class DAO {
  static saveSiteModel(siteModel) {
    return siteModel.save()
  }

  static saveSiteModels(siteModels) {
    return Promise.all(siteModels.map(siteModel => {
      return DAO.saveSiteModel(siteModel)
    }))
  }

  static getSite(id) {
    SiteModel.findOne()
  }

  static getStation() {
  }

  static getTanks(station) {
  }
}

module.exports = DAO
