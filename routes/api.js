const router = require('express').Router()
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const DAO = require('./../data/DAO')
const { Site } = require('./../models')

router.get('/stations/:stationId', async (req, res, next) => {
  try {
    const site = await DAO.getSite(req.params.stationId)
    if (!site) {
      res.status(404)
      res.json()
      return
    }
    res.json(site)
  } catch (err) {
    next(err)
  }
})

router.post('/stations/:stationId', async (req, res, next) => {
  try {
    const updatedSite = await DAO.updateSite(req.params.stationId, req.body)
    res.json(updatedSite)
  } catch (err) {
    next(err)
  }
})

router.get('/stations', async (req, res, next) => {
  try {
    const sites = await DAO.getSites()
    res.json(sites)
  } catch (err) {
    next(err)
  }
})

router.post('/data', async (req, res, next) => {
  try {
    const data = await fs.readFileAsync('data/sites.json')
    const sitesData = JSON.parse(data)
    const siteModels = sitesData.sites.map(site => Site.parse(site))
    const products = await DAO.saveSiteModels(siteModels)
    res.status(201)
    res.json(products)
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      err.status = 409
    }
    next(err)
  }
})

router.use('/*', (err, req, res, next) => {
  const message = err.message
  const stack = req.app.get('env') === 'development' ? err.stack : {}
  res.status(err.status || 500)
  res.json({ message, stack })
})

module.exports = router
