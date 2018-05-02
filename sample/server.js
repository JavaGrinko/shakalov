var express = require('express');
var bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
var Shakalov = require('../build/bundle');

var app = express();
var shakalov = new Shakalov();

app.use(bodyParser());
app.use(express.static('sample/static'));

app.get('/training', (req, res) => {
    shakalov.training();
    res.sendStatus(200);
});

app.post('/propagation', upload.fields([]), (req, res) => {
    let formData = req.body;
    console.log('form data', formData);
    console.log(req.query.answer);
    res.sendStatus(200);
});

app.post('/activate', (req, res) => {
    
});

app.listen(3000, function () {
    console.log('Shakalov example listening on port 3000!');
});