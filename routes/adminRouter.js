const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')

router.post('/', adminController.login)

router.get('/', adminController.checkServer)

// router.delete('/:id',productController.deleteProductOne)

module.exports = router