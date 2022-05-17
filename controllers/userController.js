const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User,Messages} = require('../models/models')
const {imgSave} = require('../helper')
const mailServer = require('../service/mail-service')
const userService = require('../service/user-service')
const uuid = require('uuid')

const ApiError = require('../error/ApiError')

class UserController {

    async registrationAuth(req,res,next){
        try {
            const {email, phone, password,user_id} = req.body

            if (user_id.includes('auth')){
                return next(ApiError.badRequest('Такой пользователь уже существует'))
            }

            if(email){
                if (!email || !password){
                    return next(ApiError.badRequest('Некоректный email или пароль'))
                }
                const candidate = await User.findOne({ where:{email} })
                if (candidate){
                    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
                }
                const hashPassword = await bcrypt.hash(password, 5)

                const {dataValues: unAuthUser} = await User.findOne({ where:{user_id} })
                const auth_id = 'auth_' + unAuthUser.user_id.split('_')[1]

                const authUser = {
                    ...unAuthUser,
                    email,
                    password:hashPassword,
                    user_id: auth_id,
                    name: 'Не указано',
                    gender:'Мужской'
                }
                 await User.update({...authUser},{where:{user_id}})

                // await mailServer.sendActivateMail(email,`${process.env.API_URL}/api/user/activate/${auth_id}`)

                const token = generateJwt({id:auth_id, email})
                return res.json({token,user: authUser})
            }

            if (phone){ //sms service!!!
                if (!phone || !password){
                    return next(ApiError.badRequest('Некоректный телефон или пароль'))
                }
                const candidate = await User.findOne({ where:{phone} })
                if (candidate){
                    return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'))
                }
                const hashPassword = await bcrypt.hash(password, 5)

                const {dataValues: unAuthUser} = await User.findOne({ where:{user_id} })
                const auth_id = 'auth_' + unAuthUser.user_id.split('_')[1]

                const authUser = await User.update({
                    ...unAuthUser,
                    phone,
                    password:hashPassword,
                    user_id: auth_id,
                    name: 'Не указано',
                    gender:'Мужской'
                },{where:{user_id}})

                // const auth_id = 'auth_' + ((await User.findAndCountAll()).count + 1)
                // const user = await User.create({
                //     phone:phone,
                //     password:hashPassword,
                //     user_id: auth_id,
                //     name: 'Не указано',
                //     gender:'Мужской'
                // })
                const token = generateJwt({id:auth_id, phone})
                return res.json({token,user: {...unAuthUser,phone,user_id:auth_id}})
            }

        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async registrationUser(req,res,next){
        try {
            const {} = req.body

            const user_id = 'user_' + ((await User.findAndCountAll()).count + 1)
            const user = await User.create({user_id})
            return res.json({user})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req,res,next){
        try {
            const {email,phone,password} = req.body

            if(email){
                const {dataValues: user} = await User.findOne({where:{email}})
                if (!user){
                    return next(ApiError.badRequest('Такой пользователь не найден'))
                }

                let comparePassword = bcrypt.compareSync(password,user.password)
                if (!comparePassword){
                    return next(ApiError.badRequest('Такой пользователь не найден'))
                }
                const token = generateJwt({id:user.user_id, email})
                let u = {
                    ...user,
                    password:null
                }
                return res.json({token, user:u })
            }

            if(phone){
                const {dataValues: user} = await User.findOne({where:{phone}})
                if (!user){
                    return next(ApiError.badRequest('Такой пользователь не найден'))
                }

                let comparePassword = bcrypt.compareSync(password,user.password)
                if (!comparePassword){
                    return next(ApiError.badRequest('Такой пользователь не найден'))
                }
                const token = generateJwt({id:user.user_id, phone})
                let u = {
                    ...user,
                    password:null
                }
                return res.json({token, user:u })
            }
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req,res,next){
        try {
            const { dataValues: user} = await User.findOne({where:{user_id: req.params.id}})
            if (user.email){
                const token = generateJwt({id:user.user_id,email:user.email})
                let u = {
                    ...user,
                    password: null
                }
                return res.json({token,user:u})
            }
            if (user.phone){
                const token = generateJwt({id:user.user_id,phone:user.phone})
                return res.json({token,user})
            }
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async activate(req,res,next){
        try {
            const {id} = req.params
            await userService.activate(id)
            return res.redirect(process.env.CLIENT_URL)
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getUser(req,res,next){
        try {
            const {id} = req.params

            const {dataValues: user} = await User.findOne({where:{user_id:id},attributes: { exclude: ['password'] }})

            res.json({user})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async passwordRecoveryLogin(req,res,next){
        try {
            const {login} = req.body

            const {dataValues: user} = await User.findOne({where:{email: login}})
            if (!user){
                return next(ApiError.badRequest('Такой пользователь не найден'))
            }
            const cod = `${Math.floor(Math.random() * (9 - 1 + 1) + 1)}${Math.floor(Math.random() * (9 - 1 + 1) + 1)}${Math.floor(Math.random() * (9 - 1 + 1) + 1)}${Math.floor(Math.random() * (9 - 1 + 1) + 1)}`
            await User.update({recovery_cod:cod},{where:{user_id: user.user_id}})
            await mailServer.sendRecoveryMail(user.email,cod)
            // const passUser = await User.update({password:hashPassword},{where:{user_id}})

            res.json({cod})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async passwordRecoveryCode(req,res,next){
        try {
            const {code,login} = req.body

            const {dataValues: user} = await User.findOne({where:{email: login}})

            if (!user){
                return next(ApiError.badRequest('Такой пользователь не найден'))
            }
            if (user.recovery_cod !== code){
                return next(ApiError.badRequest('Неверный код'))
            }
            await User.update({recovery_cod:null},{where:{user_id: user.user_id}})

            // const passUser = await User.update({password:hashPassword},{where:{user_id}})

            res.json({mes: 'ok'})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async passwordRecoveryPassword(req,res,next){
        try {
            const {password,login} = req.body

            const {dataValues: user} = await User.findOne({where:{email: login}})

            if (!user){
                return next(ApiError.badRequest('Такой пользователь не найден'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            await User.update({password:hashPassword},{where:{user_id: user.user_id}})

            res.json({mes: 'ok'})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setBirthday(req,res,next){
        try {
            const {birthday} = req.body
            const {user_id} = req.user

            await User.update({birthday},{where:{user_id}})

            res.json({birthday})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setGender(req,res,next){
        try {
            const {gender} = req.body
            const {user_id} = req.user

            await User.update({gender},{where:{user_id}})

            res.json({gender})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setNumberPhone(req,res,next){
        try {
            const {phone} = req.body
            const {user_id} = req.user

            await User.update({phone},{where:{user_id}})

            res.json({phone})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setEmail(req,res,next){
        try {
            const {email} = req.body
            const {user_id} = req.user

            await User.update({email},{where:{user_id}})

            res.json({email})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setFullName(req,res,next){
        try {
            const {name,lastname,patronymic} = req.body
            const {user_id} = req.user

            await User.update({name,lastname,patronymic},{where:{user_id}})

            res.json({name,lastname,patronymic})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setPassword(req,res,next){
        try {
            const {password,oldPassword} = req.body
            const {user_id} = req.user

            const {dataValues: user} = await User.findOne({where:{user_id}})

            let comparePassword = bcrypt.compareSync(oldPassword,user.password)
            if (!comparePassword){
                return next(ApiError.badRequest('Неверный пароль'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const pass = await User.update({password:hashPassword},{where:{user_id}})

            res.json({password:pass})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async addAddress(req,res,next){
        try {
            const {address,user_id} = req.body

            const { dataValues: user} = await User.findOne({where:{user_id}})

            const newAddress = {
                address,
                id: uuid.v4()
            }
            const newAddresses = [...user.addresses,newAddress]
            await User.update({addresses: newAddresses},{where:{user_id}})

            res.json({addresses:newAddresses})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAddress(req,res,next){
        try {
            const {address_id,user_id} = req.body

            const { dataValues: user} = await User.findOne({where:{user_id}})
            const addresses = user.addresses.filter(item => item.id !== address_id )
            await User.update({addresses: addresses},{where:{user_id}})

            res.json({addresses})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getAddresses(req,res,next){
        try {
            const {user_id} = req.user

            const user = await User.findOne({where:{user_id}})

            res.json({addresses: user.addresses})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setImg(req,res,next){
        try {
            const {img} = req.files
            const {user_id} = req.body

            const {dataValues: user} = await User.findOne({where:{user_id}})
            let {img: images} = user

            const newImg = imgSave(img)
            images = [ ...images, newImg ]

            await User.update({img:images},{where:{user_id}})

            res.json({img:images})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setFavorites(req,res,next){
        try {
            const {favorite,user_id} = req.body
            const {dataValues} = await User.findOne({where:{user_id}})

            const newFavorites = (() => {
                if (dataValues.favorites.find(item => item.product_id === favorite.product_id)) {
                    return dataValues.favorites.filter(item => item.product_id !== favorite.product_id)
                }
                return [...dataValues.favorites, {...favorite}]
            })()

            const favoritesUser = await User.update({favorites:newFavorites},{where:{user_id}})

            res.json({favoritesUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async setFavoritesCount(req,res,next){
        try {
            const {product_id,count,user_id} = req.body
            const {dataValues} = await User.findOne({where:{user_id}})

            const newFavorite = dataValues.favorites.map( item => {
                if (item.product_id === product_id){
                    return { ...item, count}
                }
                return item
            })

            const favoritesUser = await User.update({favorites:newFavorite},{where:{user_id}})

            res.json({favoritesUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getFavorites(req,res,next){
        try {
            const {user_id} = req.body

            const user = await User.findOne({where:{user_id}})

            res.json({favorites: user.favorites})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setCartByIconCart(req,res,next){
        try {
            const {cart,count,user_id} = req.body

            const {dataValues} = await User.findOne({where:{user_id}})
            const newCart = (() => {
                if(dataValues.cart.find( item => item.product_id === cart.product_id)){
                    return dataValues.cart.filter( item => item.product_id !== cart.product_id)
                }
                return [...dataValues.cart, {...cart, count: count}]
            })()

            const cartUser = await User.update({cart:newCart},{where:{user_id}})

            res.json({cartUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async addCart(req,res,next){
        try {
            const {cart,count,user_id} = req.body

            const {dataValues} = await User.findOne({where:{user_id}})

            const newCart = (() => {
                if(dataValues.cart.find( item => item.product_id === cart.product_id)){
                    return dataValues.cart.map( i => {
                        if(i.product_id === cart.product_id){
                            return { ...i, count}
                        }
                        return i
                    })
                }
                return [ {...cart, count}, ...dataValues.cart ]
            })()

            const cartUser = await User.update({cart:newCart},{where:{user_id}})

            res.json({cartUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteCart(req,res,next){
        try {
            const {product_i,user_id} = req.body

            const {dataValues} = await User.findOne({where:{user_id}})
            const newCart = dataValues.cart.filter( item => item.product_id !== product_i)

            const cartUser = await User.update({cart:newCart},{where:{user_id}})

            res.json({cartUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async ordering(req,res,next){
        try {
            const {cart,user_id,selectedAddress} = req.body

            const {dataValues} = await User.findOne({where:{user_id}})
            const newCart = cart.map( item => ({
                ...item,
                date: Date.now(),
                address: selectedAddress,
                order_id: uuid.v4()
            }))

            let history = dataValues.history_order
            let statusOrder = dataValues.order_status
            // let history = JSON.parse(dataValues.history_order)
            // let statusOrder = JSON.parse(dataValues.order_status)
            newCart.forEach( item => {
                history.push(item)
            })
            newCart.forEach( item => {
                statusOrder.push({...item,status: 'Принят в обработку',delivery_date:null})
            })

            // послать запрос на crm заказ
            // создать message для сообщению пользователь о принятие заказа

            await User.update({history_order:history},{where:{user_id}})
            await User.update({order_status:statusOrder},{where:{user_id}})
            await User.update({cart:[]},{where:{user_id}})

            res.json({newCart,history,statusOrder})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getCart(req,res,next){
        try {
            const {user_id} = req.user

            const user = await User.findOne({where:{user_id}})

            res.json({cart: user.cart})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setRepairStatus(req,res,next){
        try {
            const {repair,user_id} = req.body

            const {dataValues: user}  = await User.findOne({where:{user_id}})

            //послать запрос на crm
            //отправить сообщение пользователю

            const rep = {
                ...repair,
                repair_id: uuid.v4(),
                breakage:null,
                repair: null,
                status: 'Заказ принят',
                date_repair: null,
                delivery_date: null,
            }

            const repair_status = [...user.repair_status,rep]

            await User.update({repair_status},{where:{user_id}})

            res.json({repair:repair_status})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async setOrderStatus(req,res,next){
        try {
            const {orderStatus} = req.body
            const {user_id} = req.user

            const orderStatusUser = await User.update({order_status: orderStatus},{where:{user_id}})

            res.json({orderStatusUser})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getOrderStatus(req,res,next){
        try {
            const {user_id} = req.user

            const user = await User.findOne({where:{user_id}})

            res.json({orderStatusUser: user.order_status})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    // async getCart(req,res,next){
    //     try {
    //         const {user_id} = req.user
    //
    //         const user = await User.findOne({where:{user_id}})
    //
    //         res.json({cart: user.cart})
    //     }catch (e){
    //         console.log(e)
    //         next(ApiError.badRequest(e.message))
    //     }
    // }

    async deleteUser(req,res,next){
        try {
            const {id} = req.params

            const user = await User.destroy({where:{user_id: id}})

            res.json({user})
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()

function generateJwt ({id, email, phone}){
    if (email){
        return jwt.sign(
            {user_id:id,email},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }
    if (phone){
        return jwt.sign(
            {user_id:id,phone},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }
}