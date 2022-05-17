const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.TEXT},
    lastname: {type: DataTypes.STRING},
    patronymic: {type: DataTypes.STRING},
    gender: {type: DataTypes.STRING},
    birthday: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING, unique: true, allowNull: false},
    phone: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, unique: true, validate: {isEmail: true }},
    recovery_cod: {type: DataTypes.STRING},
    fullName: { // VIRTUAL!!!
      type: DataTypes.VIRTUAL,
      get(){
          return `${this.lastname} ${this.name} ${this.patronymic}`
      },
        set() {
            throw new Error('Do not try to set the `fullName` value! It is VIRTUAL!!!');
        }
    },
    password: {type: DataTypes.STRING},
    addresses: {
        type: DataTypes.JSON, defaultValue: []
        // get() {
        //     const value = this.getDataValue('addresses');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('addresses',JSON.stringify(value))
        // }
    },
    img: {type: DataTypes.JSON, defaultValue: []},
    favorites: {
        type: DataTypes.JSON, defaultValue: []
        // get() {
        //     const value = this.getDataValue('favorites');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('favorites',JSON.stringify(value))
        // }
    },
    cart: {
        type: DataTypes.JSON,defaultValue: []
        // get() {
        //     const value = this.getDataValue('cart');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('cart',JSON.stringify(value))
        // }
    },
    history_order: {
        type: DataTypes.JSON, defaultValue: [],
        // get() {
        //     const value = this.getDataValue('history_order');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('history_order',JSON.stringify(value))
        // }
    },
    order_status: {
        type: DataTypes.JSON, defaultValue: [],
        // get() {
        //     const value = this.getDataValue('order_status');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('order_status',JSON.stringify(value))
        // }
    },
    repair_status: {
        type: DataTypes.JSON, defaultValue: [],
        // get() {
        //     const value = this.getDataValue('order_status');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('order_status',JSON.stringify(value))
        // }
    },
},{
    charset: 'utf8'
})

const Product_card = sequelize.define('product_card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    brand: {type: DataTypes.STRING, allowNull: false},
    product_id: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false,
        // get() {
        //     const value = this.getDataValue('category');
        //     return value ? JSON.parse(value) : null
        // },
        // set(value){
        //     this.setDataValue('category',JSON.stringify(value))
        // }
    },
    desc: {type: DataTypes.TEXT},
    active: { type: DataTypes.BOOLEAN, defaultValue: true},
    new: { type: DataTypes.BOOLEAN, defaultValue: true},
    archive: { type: DataTypes.BOOLEAN, defaultValue: false},
    img: {
        type: DataTypes.TEXT,
        get() {
            const value = this.getDataValue('img');
            return value ? JSON.parse(value) : null
        },
        set(value){
            this.setDataValue('img',JSON.stringify(value))
        }
    },
    characteristics: {
        type: DataTypes.JSON,
        get() {
            const value = this.getDataValue('characteristics');
            return value ? JSON.parse(value/*.replace(/\s\s+/g,'').replace(/\{"/g,'{"\\"').replace(/":/g,'\\"":')*/) : null
        },
        // set(value){
        //     this.setDataValue('characteristics',JSON.stringify(value))
        // }
    },
    reviews: {
        type: DataTypes.JSON,
        get() {
            const value = this.getDataValue('reviews');
            return value ? JSON.parse(value) : null
        },
        // set(value){
        //     this.setDataValue('reviews',JSON.stringify(value))
        // }
    },
    accessories: {
        type: DataTypes.JSON,
        get() {
            const value = this.getDataValue('accessories');
            return value ? JSON.parse(value) : null
        },
        // set(value){
        //     this.setDataValue('accessories',JSON.stringify(value))
        // }
    },
},{
    charset: 'utf8'
})

const Messages = sequelize.define('messages', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    product_id: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING},
    admin_id: {type: DataTypes.STRING},
    actual: {type: DataTypes.BOOLEAN},
    date: {type: DataTypes.STRING},
    message: {
        type: DataTypes.TEXT,
        get() {
            const value = this.getDataValue('message');
            return value ? JSON.parse(value) : null
        },
        set(value){
            this.setDataValue('message',JSON.stringify(value))
        }
    },
},{
    charset: 'utf8'
})

const Messages_Repair = sequelize.define('messages_repair', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    product_id: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING},
    admin_id: {type: DataTypes.STRING},
    actual: {type: DataTypes.BOOLEAN},
    date: {type: DataTypes.STRING},
    desc: {type: DataTypes.STRING},
    message: {
        type: DataTypes.TEXT,
        get() {
            const value = this.getDataValue('message');
            return value ? JSON.parse(value) : null
        },
        set(value){
            this.setDataValue('message',JSON.stringify(value))
        }
    },
},{
    charset: 'utf8'
})

module.exports = {
    User,Product_card,Messages,Messages_Repair
}

/*
удалить атрибут при получении
Model.findAll({
  attributes: { exclude: ['baz'] }
});

// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 });

 */