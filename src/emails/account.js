const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

// let sendgrid know we wanna work with this apikey
sgMail.setApiKey(sendgridAPIKey);


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