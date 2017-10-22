const router = require('express').Router()
const api = require('./api')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.use('/api', api)

module.exports = router
