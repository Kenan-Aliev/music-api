const router = require('express').Router()
const tokenController = require('../controllers/tokens.controller')


router.get('/refresh',tokenController.refresh)


module.exports = router