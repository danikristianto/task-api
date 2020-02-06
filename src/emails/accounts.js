const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danikristianto21@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Hi ${name}, Welcome to our site`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danikristianto21@gmail.com',
        subject: 'Sorry to see you go!',
        text: `GoodBye ${name}, I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail, 
    sendCancelationEmail
}