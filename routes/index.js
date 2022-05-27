const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const deviceRouter = require('./productRouter')
const adminRouter = require('./adminRouter')

router.use('/user', userRouter)
router.use('/product', deviceRouter)
router.use('/admin', adminRouter)

module.exports = router