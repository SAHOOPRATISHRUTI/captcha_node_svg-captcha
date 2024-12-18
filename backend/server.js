const express = require('express');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');

const app = express();


app.use(
    session({
        secret: 'nhgjnmg', 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);


app.use(express.json());


app.get('/generate-captcha', (req, res) => {
 
    const captcha = svgCaptcha.create({
        size: 4, 
        noise: 0, 
        color: true, 
        background: '#f4f4f4', 
    });

    
    req.session.captcha = captcha.text;


    console.log('Generated CAPTCHA:', req.session.captcha);


    res.type('svg');
    res.status(200).send(captcha.data);
});


app.post('/verify-captcha', (req, res) => {
    const { userInput } = req.body;


    console.log('User Input:', userInput);
    console.log('Session CAPTCHA:', req.session.captcha);

 
    if (req.session.captcha && userInput === req.session.captcha) {

        req.session.captcha = null;
        return res.status(200).json({ success: true, message: 'CAPTCHA verified!' });
    }

    res.status(400).json({ success: false, message: 'Invalid CAPTCHA. Please try again.' });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
