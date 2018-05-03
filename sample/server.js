const express = require('express');
const formData = require("express-form-data");
const Shakalov = require('../build/bundle');

var app = express();

const options = {
    autoClean: true
};

// parse data with connect-multiparty. 
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable 
app.use(formData.stream());
// union body and files
app.use(formData.union());

var shakalov = new Shakalov();
app.use(express.static('sample/static'));

app.get('/training', (req, res) => {
    shakalov.training();
    res.sendStatus(200);
});

app.post('/propagation', (req, res) => {
    shakalov.propagate(Object.keys(req.files)
        .map(key => req.files[key]), req.query.answer)
        .map(readStream => readStream.read()),
    res.sendStatus(200);
});

app.post('/activate', (req, res) => {

});

app.listen(3000, function () {
    console.log('Shakalov example listening on port 3000!');
});