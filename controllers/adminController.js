const {User,Messages,Clients,Mutualization,Shop} = require('../models/models')
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

    async getOrdering(req,res,next){
        try {
            let user = await User.findAll()
            user = user.filter(item => item.order_status.length)
            user = user.map( item => {
                return item.order_status.map(thing => ({...thing,user_id:item.user_id,phone:item.phone,email:item.email}))
            })
            let list = []
            user.forEach(item => {
                item.forEach(thing => list.push(thing))
            })

            res.json({list})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getRepairOrder(req,res,next){
        try {
            let user = await User.findAll()
            user = user.filter(item => item.repair_status.length)

            user = user.map( item => {
                return item.repair_status.map(thing => ({...thing,user_id:item.user_id,phone:item.phone,email:item.email}))
            })
            let list = []
            user.forEach(item => {
                item.forEach(thing => list.push(thing))
            })

            res.json({list})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async createClients(req,res,next){
        try {
            const {client} = req.body
            console.log(client)
            const newClient = await Clients.create(client)

            res.json({newClient})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getClients(req,res,next){
        try {
            const clients = await Clients.findAll()

            res.json({clients:clients.reverse()})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async createMutualization(req,res,next){
        try {
            const {mutualization} = req.body
            const newMutualization = await Mutualization.create(mutualization)

            res.json({newMutualization})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getMutualization(req,res,next){
        try {
            const mutualization = await Mutualization.findAll()

            res.json({mutualization: mutualization.reverse()})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async createShop(req,res,next){
        try {
            const {shop} = req.body
            const newShop = await Shop.create(shop)

            res.json({newShop})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getShop(req,res,next){
        try {
            const shop = (await Shop.findAll())

            res.json({shop:shop.reverse()})
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