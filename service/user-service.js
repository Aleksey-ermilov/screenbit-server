const {User} = require('../models/models')
const ApiError = require('../error/ApiError')

class UserService{
    async activate(user_id){
        const user = await User.findOne({ where:{user_id} })
        if(!user){
            throw ApiError.badRequest('Неккоректная сылка для активации')
        }

    }
}

module.exports = new UserService()