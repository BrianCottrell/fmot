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

var database

app.set('view engine', 'ejs');

app.get('/send', function(req, res){
    params.status = req.query.message;
    console.log(params.status);
    request({
            url: 'http://www.carh2o.com/ftvapi/api.php/wp_uelm_rg_lead_detail?transform=1',
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        },
        function(error, response, body){
        if(error){
            console.log(error);
        }else{
            database = JSON.parse(body);
            database = database.wp_uelm_rg_lead_detail;

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

                    var message = params.status;

                    params.status = params.status+' http://fmot.herokuapp.com/share';
                    for(var i = 0; i < database.length; i++){
                        if(database[i].field_number == 3){
                            params.status = params.status+' '+database[i].value;
                        }
                    }

                    twitter.post('statuses/update', params, function (err, data, response) {
                        console.log('Twitter post sent');
                    });

                    var recipients = ''
                    for(var i = 0; i < database.length; i++){
                        if(database[i].field_number == 2){
                            recipients = recipients+database[i].value+', ';
                        }
                    }

                    var mailOptions = {
                        from: 'Find Me on TV!',
                        to: recipients,
                        subject: 'You or someone you are following was just featured on TV!',
                        text: message,
                        html: '<h1>Find Me on TV!</h1><b>'+message+'✔</b>'
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                        };
                    });
                    var phoneNumber;
                    var date = new Date;
                    if(date.getHours() > 5){
                        for(var i = 0; i < database.length; i++){
                            if(database[i].field_number == 5){
                                phoneNumber = '1'+database[i].value.replace(/\D/g,'');
                                request(
                                    {
                                        url: 'https://messagingApi.Sinch.com/v1/sms/'+phoneNumber,
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
                    }
                }
            });
        }
    });
    res.status(200).render('end_page');
});

app.get('/', function(req, res){
    res.status(200).render('home_page');
});

app.get('/end', function(req, res){
    res.status(200).render('end_page');
});

app.get('/share', function(req, res){
    res.status(200).render('share_page');
});

app.listen(port);
console.log('Listening to port:', port);