const nodemailer = require('nodemailer')
const { MAIL_USER, MAIL_PASS } = process.env
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
})

transporter.use(
    'compile',
    hbs({
        viewEngine: {
            partialsDir: 'partials/',
            defaultLayout: false,
        },
        viewPath: path.join(__dirname, '../views/email'),
        extName: '.hbs',
    })
)

class Email {
    constructor(user, url) {
        this.url = url
        this.user = user
        this.from = `Shopbee <no-reply@gmail.com>`
        this.to = user.email
    }

    async #send(template, subject = 'Shopbee Mail') {
        let mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            template,
            context: {
                user: this.user,
                url: this.url,
                email: this.to,
            },
        }
        transporter.sendMail(mailOptions)
    }

    async sendWellCome() {
        await this.#send('wellcome', 'Wellcome to Shopbee')
    }
    async sendCancelation() {
        await this.#send('cancelation', 'Your account has been canceled')
    }
    async sendResetPassword() {}
    async sendInvoice() {}
}
module.exports = Email
