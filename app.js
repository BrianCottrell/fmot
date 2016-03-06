/* Find Me on TV      */
/* by Brian Cottrell  */
/* 03-05-2016         */

var express     = require('express');
var app         = express();
var request     = require('request');
var nodemailer  = require('nodemailer');
var port        = process.env.PORT || 8080;
var Twit        = require('twit');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'findmeontv@gmail.com',
        pass: 'bc171212'
    }
});

var twitter = new Twit({
    consumer_key: 'fp3ZiqvAppQygsAjE1m90ryUj',
    consumer_secret: 'bpJPzgtffmZzZl1jNMCRO8WG2vyaogDBf6KVDeG8xfpNjkrP4M',
    access_token: '2818166958-GQAMx98WS22qHqi5KG9c7tNNvYV6G3A03VlCOYI',
    access_token_secret: 'quaInMeD0Pr1Zk32Bb03qJIc7z6GwgriwTKuN7qYIbrOh'
});

var params = {
    status: 'Write your custom message here'
};

var idenities = [
    {
        following: ['Bob Sled', 'Allen Wrench'],
        email: 'Brian_Cottrell@inbox.com',
        phone: '13109386046',
        twitter: 'Brian__Cottrell'
    },
    {
        email: 'ruby10318@yahoo.com.tw'
    }
];

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.status(200).render('home_page');
});

app.get('/send', function(req, res){
    params.status = req.query.message;
    console.log(params.status);
    request({
        url: 'http://hobnob.wirewax.com/public/video/8028050/',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer aaf0cee4c7673d3a9000e94de82fce2499352a46'.toString('base64'),
            'Content-Type' : 'application/json'
        }
    }, 
    function(error, response, body){
        if(error){
            console.log(error);
        }else{
            console.log(body);

            twitter.post('statuses/update', params+' http://fmot.herokuapp.com/share', function (err, data, response) {
                console.log(data)
            });

            var mailOptions = {
                from: 'Find Me on TV!',
                to: 'Brian_Cottrell@inbox.com',
                subject: 'You or someone you are following was just featured on TV!',
                text: params.status,
                html: '<h1>Find Me on TV!</h1><b>'+params.status+'✔</b>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                };
            });

            request(
                {
                    url: 'https://messagingApi.Sinch.com/v1/sms/13109386046',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + new Buffer('application\\6646ab62-5920-4274-b30e-cfce7d9f45bf:11VLa7eaPkKVY5au3y7PzQ==').toString('base64'),
                        'Content-Type' : 'application/json'
                    },
                    body: "{\"message\": \"You or someone you are following was just featured on TV!\"}"
                }, 
                function(error, response, body){
                    if(error){
                        console.log(error);
                    }else{
                        console.log(body);
                    }
                }
            );

        }
    }
    );
    res.status(200).render('end_page');
});

app.get('/end', function(req, res){
    res.status(200).render('end_page');
});

app.get('/share', function(req, res){
    res.status(200).render('share_page');
});

app.listen(port);
console.log('Listening to port:', port);