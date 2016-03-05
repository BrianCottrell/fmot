/* Find Me on TV      */
/* by Brian Cottrell  */
/* 03-05-2016         */

var express     = require('express');
var app         = express();
var nodemailer  = require('nodemailer');
var port        = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.status(200).render('share_page');
})

app.listen(port);
console.log('Listening to port:', port);