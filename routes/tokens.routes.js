const router = require('express').Router()
const tokenController = require('../controllers/tokens.controller')


router.post('/refresh',tokenController.refresh)


module.exports = router