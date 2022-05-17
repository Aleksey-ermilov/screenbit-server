const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')
const {Product_card} = require('../models/models')

const {imgSave} = require('../helper')

class ProductController {
    async create(req,res,next){
        try {
            // const {name,brand,price,category,desc,characteristics,accessories} = req.body
            const {img} = req.files

            const arrImg = imgHandler(img)

            const product_id = 'product_' + ((await Product_card.findAndCountAll()).count + 1)
            const product = await Product_card.create({
                ...req.body,product_id,img:arrImg,/*characteristics: JSON.stringify(req.body.characteristics)*/
                    // name,brand,price,category,desc,characteristics,accessories,product_id,img:arrImg
                // ...prod, product_id
                })

            return res.json(product)
            // return res.json(product_id)
        }catch (e){
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req,res,next){
        try {
            let {brand,category,limit,page} = req.query

            page = page || 1
            limit = +limit || 8
            let offset = page * limit - limit

            let products;
            if (!brand && !category){
                products = await Product_card.findAndCountAll({limit,offset})
            }
            if (brand && !category){
                products = await Product_card.findAndCountAll({where:{brand},limit,offset})
            }
            if (!brand && category){
                products = await Product_card.findAndCountAll({where:{category},limit,offset})
            }
            if (brand && category){
                products = await Product_card.findAndCountAll({where:{brand,category},limit,offset})
            }

            return res.json(products)
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }

    async getOne(req,res,next){
        try {
            const {id} = req.params

            const product = await Product_card.findOne({where: {product_id: id} })

            res.json(product)
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }

    async deleteProductOne(req,res,next){
        try {
            const {id} = req.params

            const product = await Product_card.destroy({where:{product_id: id}})

            res.json({product})
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }

    async getCategories(req,res,next){ // write create category
        try {
            res.json({message: 'OK!!! Device'})
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }

    async getBrands(req,res,next){ // write create brand
        try {
            res.json({message: 'OK!!! Device'})
        }catch (e){
            console.log(e)
            next(ApiError.internal())
        }
    }
}

module.exports = new ProductController()

function imgHandler(img) {
    if (img.length){
        return img.map(item => imgSave(item) )
    }
    return [imgSave(img)]
}

const prod = {
    name: 'A51',
    brand: 'Apple',
    price: '86900',
    type: 'phone',
    category: 'Смартфоны',
    desc: 'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
        'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
        'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
        'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.',
    new: true,
    archive: false,
    img: ['56a96121-033a-41af-9f4c-2c5602fdc4e6.png','79fc033a-5477-42ca-ab4a-d9324940200d.jpg'],
    characteristics: [
        {
            "Внешний вид": [
                {'Цвет': 'Черный'},
                {'Материал крышки': 'Алюминий'},
                {'Материал корпуса': 'Пластик'}
            ],
        },
        {
            "Экран": [
                {'Тип экрана': 'OLED'},
                {'Диагональ': '"15.6"'},
                {'Разрешение': '60Гц'}
            ],
        },
        {
            "Процессор": [
                {'Тип экрана':'OLED'},
                {'Диагональ':'"15.6"'},
                {'Разрешение':'60Гц'}
            ],
        },
        {
            "Графический ускоритель": [
                {'Тип экрана':'OLED'},
                {'Диагональ':'"15.6"'},
                {'Разрешение':'60Гц'}
            ],
        },
        {
            "Оперативная память": [
                {'Тип экрана':'OLED'},
                {'Диагональ':'"15.6"'},
                {'Разрешение':'60Гц'}
            ],
        }
    ],
    active: true,
    reviews: [
        {
            user: {
                img: 'img-default-user-2.png',
                user_id:'auth_1',
                fullName: 'Василий Пупкин'
            },
            message: 'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.',
        },
        {
            user: {
                img: 'img-default-user-2.png',
                user_id:'auth_2',
                fullName: 'Сигизмунд Пупкин'
            },
            message: 'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.',
        },
        {
            user: {
                img: 'img-default-user-2.png',
                user_id:'auth_3',
                fullName: 'Вениамин Пупкин'
            },
            message: 'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.' +
                'Перевод достоинство, за которое все его и смотрят - его шелезо, конкурентно за эту цену практически нет.',
        },
    ],
    accessories: ['Наушники','Зарядка','Стекло',],
}