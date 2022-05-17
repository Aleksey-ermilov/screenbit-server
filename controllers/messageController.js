const ApiError = require('../error/ApiError')

class MessageController{
    async getMes(req,res,next){
        try {

            res.json({message: 'OK!!! getMes'})
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }

    async postMes(req,res,next){
        try {

            res.json({message: 'OK!!! postMes'})
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }
}

module.exports = new MessageController()