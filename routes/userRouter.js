const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkUserMiddleware = require('../middleware/checkUserMiddleware')
// api/user/registration/auth
router.post('/registration/auth', userController.registrationAuth)
router.post('/registration/user', userController.registrationUser)
router.post('/login', userController.login)
router.post('/birthday', checkUserMiddleware, userController.setBirthday)
router.post('/gender', checkUserMiddleware, userController.setGender)
router.post('/phone', checkUserMiddleware, userController.setNumberPhone)
router.post('/email', checkUserMiddleware, userController.setEmail)
router.post('/fullname', checkUserMiddleware, userController.setFullName)
router.post('/password', checkUserMiddleware, userController.setPassword)
router.post('/passwordRecoveryLogin', userController.passwordRecoveryLogin)
router.post('/passwordRecoveryCode', userController.passwordRecoveryCode)
router.post('/passwordRecoveryPassword', userController.passwordRecoveryPassword)
router.post('/img', checkUserMiddleware, userController.setImg)
router.post('/changeImg', checkUserMiddleware, userController.changeImg)
router.post('/orderstatus', checkUserMiddleware, userController.setOrderStatus)
router.post('/addaddress', userController.addAddress)
router.post('/chengeAddaddress', userController.changeAddresses)
router.post('/deleteaddress', userController.deleteAddress)
router.post('/favorites', userController.setFavorites)
router.post('/favoritescount', userController.setFavoritesCount)
router.post('/cartbyicon', userController.setCartByIconCart)
router.post('/addcart', userController.addCart)
router.post('/deletecart', userController.deleteCart)
router.post('/ordering', userController.ordering)
router.post('/repair', userController.setRepairStatus)

router.get('/auth/:id', userController.check)
// router.get('/auth', checkUserMiddleware, userController.check)
router.get('/activate/:id', userController.activate)
router.get('/addresses', userController.getAddresses)
router.get('/favorites', userController.getFavorites)
router.get('/cart', userController.getCart)
router.get('/user/:id', userController.getUser)
router.get('/orderstatus', checkUserMiddleware, userController.getOrderStatus)

router.get('/checkserver',userController.checkServer)

router.delete('/:id',userController.deleteUser)

module.exports = router