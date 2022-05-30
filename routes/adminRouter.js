const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')

router.post('/', adminController.login)

router.get('/', adminController.checkServer)
router.get('/ordering', adminController.getOrdering)
router.get('/repairOrder', adminController.getRepairOrder)

// router.delete('/:id',productController.deleteProductOne)

module.exports = router