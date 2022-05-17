const path = require('path')
const uuid = require('uuid')

function imgSave(img){
    const extensions = img.name.split('.')[1]
    const fileName = `${uuid.v4()}.${extensions}`
    img.mv(path.resolve(__dirname,'..','static',fileName))
    return fileName
}

module.exports = {
    imgSave
}