const Router = require('express')
const router = new Router()
const messageController = require('../controllers/messageController')

router.post('/', messageController.postMes)

router.get('/', messageController.getMes)

module.exports = router