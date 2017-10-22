const router = require('express').Router()
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const DAO = require('./../data/DAO')
const { Site } = require('./../models')

router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.post('/data', async (req, res, next) => {
  try {
    const data = await fs.readFileAsync('data/sites.json')
    const sitesData = JSON.parse(data)
    const siteModels = sitesData.sites.map(site => Site.parse(site))
    const products = await DAO.saveSiteModels(siteModels)
    res.status(201).json(products)
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      err.status = 409
    }
    next(err)
  }
})

router.use('/', (err, req, res, next) => {
  res.status(err.status || 500)
  res.json(err)
})

module.exports = router
