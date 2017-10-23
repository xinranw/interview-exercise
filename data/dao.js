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

  static getSites() {
    return SiteModel.find()
  }

  static getSite(id) {
    return SiteModel.findById(id)
  }

  static updateSite(id, data) {
    return SiteModel.findById(id)
      .then(site => {
        if (Object.keys(data).includes('compliance')) {
          site.compliance = {
            value: data.compliance,
            lastUpdated: new Date()
          }
        }
        return site
      }).then(site => {
        return site.save()
      })
  }

  static getTanks(station) {
  }
}

module.exports = DAO
