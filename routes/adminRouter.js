const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')

router.post('/', adminController.login)
router.post('/clients', adminController.createClients)
router.post('/mutualization', adminController.createMutualization)
router.post('/shop', adminController.createShop)

router.get('/', adminController.checkServer)
router.get('/ordering', adminController.getOrdering)
router.get('/repairOrder', adminController.getRepairOrder)
router.get('/clients', adminController.getClients)
router.get('/mutualization', adminController.getMutualization)
router.get('/shop', adminController.getShop)

// router.delete('/:id',productController.deleteProductOne)

module.exports = router