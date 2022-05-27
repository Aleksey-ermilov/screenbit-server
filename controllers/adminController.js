const ApiError = require('../error/ApiError')

class AdminController{

    async login(req,res,next){
        try {
            const {login,password} = req.body

            if (login === 'admin' && password === 'admin'){
                res.json({mes:'ok'})
            }
            next(ApiError.badRequest('Неверный логин или пароль'))
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async checkServer(req,res,next){
        try {
            res.json({mes:'ok'})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new AdminController()