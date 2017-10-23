const router = require('express').Router()
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const DAO = require('./../data/DAO')
const { Site } = require('./../models')

/**
 * @api {get} /api/stations Get stations
 * @apiName GetStations
 * @apiGroup Stations
 *
 * @apiExample Example usage:
 * http http://localhost/api/stations
 * 
 * @apiSuccess {Station[]} response List of Stations (`response` is only a placeholder)
 * @apiSuccess {Number} response.id Station's unique Id
 * @apiSuccess {String} response.name The name of the Station
 * @apiSuccess {Boolean} response.compliant The compliance state of the Station
 * @apiSuccess {Boolean} response.complianceUpdate Whether the Station's compliance 
 *                                                 state has been manually updated
 */
router.get('/stations', async (req, res, next) => {
  try {
    const sites = await DAO.getSites()
    res.json(sites)
  } catch (err) {
    next(err)
  }
})

/**
 * @api {get} /api/stations/:stationId Get Station
 * @apiName GetStation
 * @apiGroup Station
 *
 * @apiParam {Number} stationId Station's unique Id
 *
 * @apiExample Example usage:
 * http http://localhost/api/stations/123
 * 
 * @apiSuccess {Number} id Station's unique Id
 * @apiSuccess {String} name The name of the Station
 * @apiSuccess {Boolean} compliant The compliance state of the Station
 * @apiSuccess {Boolean} complianceUpdate Whether the Station's compliance 
 *                                        state has been manually updated
 */
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

/**
 * @api {post} /station/:stationId Update Station
 * @apiName UpdateStation
 * @apiGroup Station
 *
 * @apiDescription Currently only supportings updating Station's compliance by posting `{ compliance: true/false }` as form urlencoded paramters
 *
 * @apiParam {String} stationId Station's unique Id
 * 
 * @apiExample Example usage:
 * http --form POST http://localhost/api/stations/123 compliance=true
 */
router.post('/stations/:stationId', async (req, res, next) => {
  try {
    const updatedSite = await DAO.updateSite(req.params.stationId, req.body)
    res.json(updatedSite)
  } catch (err) {
    next(err)
  }
})

/**
 * @api {get} /stations/:stationId/tanks Get Tanks for Station
 * @apiName GetTanks
 * @apiGroup Tanks
 *
 * @apiParam {Number} stationId Station's unique id
 *
 * @apiExample Example usage:
 * http http://localhost/api/stations/123/tanks
 * 
 * @apiSuccess {Tank[]} response List of Tanks (`response` is only a placeholder)
 * @apiSuccess {String} response.name Name of the Tank
 * @apiSuccess {Boolean} response.leaking Whether the Tank has a leak
 * @apiSuccess {Date} response.leakStatusDate ???
 */
router.get('/stations/:stationId/tanks', async (req, res, next) => {
  try {
    const tanks = await DAO.getTanks(req.params.stationId)
    res.json(tanks)
  } catch (err) {
    err.message = `There was a problem fetching tanks for station ${req.params.stationId}`
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
