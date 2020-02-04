const sgMail = require('@sendgrid/mail');

// let sendgrid know we wanna work with this apikey
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//.send return promise
const sendWelcomeEmail = (email , name) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email , name) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you come back soon.`

    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}