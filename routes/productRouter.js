const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.post('/', productController.create)
router.post('/update', productController.updateProduct)
router.post('/fullUpdate', productController.fullUpdateProduct)

router.get('/', productController.getAll)
router.get('/:id', productController.getOne)

router.delete('/:id',productController.deleteProductOne)

module.exports = router