const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'jiroquijano@gmail.com',
        subject: 'Thank you for registering!',
        text: `Hello, ${name}! Thanks for registering!`
    })
};

const sendGoodByeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'jiroquijano@gmail.com',
        subject: `We're sad to see you go, ${name}`,
        text: `Hoping that you will come back and join us again.`
    })
};


module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}