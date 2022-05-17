const nodemailer = require('nodemailer')

class MailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendActivateMail(to,link){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта',
            text:'',
            html:
                `
                <div>
                    <h1>Для активации перейдите по ссылки</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }

    async sendRecoveryMail(to,cod){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject: 'Код восстановления',
            text:'',
            html:
                `
                <div>
                    <h1>Для восстановления введите код</h1>
                    <h1>${cod}</h1>                    
                </div>
                `
        })
    }
}

module.exports = new MailService()