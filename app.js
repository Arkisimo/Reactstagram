var express = require('express');
var mongojs = require('mongojs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var base64Img = require('base64-img');

var Authentication = require('./libs/auth.js');
var Random = require('./libs/random.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cookieParser());
app.use(bodyParser());
app.use("/public",express.static('public'));

var db = mongojs("localhost:27017/reactstagram", ['image', 'comment', 'user']);

app.post('/user/signup', function (req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    db.user.find({username: username}, function(err,docs){
        if (err){
            res.send(404);
        } else {
            if (docs.length == 0){
                db.user.save({
                    username: username,
                    password: password,
                },
                function(err, doc){
                    if (err) {
                        err.status = 403;
                        res.send(err);
                     } else {
                        res.send({status: 200, data: doc});
                    }
                });
            } else {
                res.send({status: 403, data: "User already exists"});
            }
        }
    });
});

app.post('/user/login', function (req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    db.user.find({username: username}, function(err,docs){
        if (docs.length == 0){
            res.send({status: 403, data: 'Username Not Found'});
        }
        else {
            var user = docs[0];
            if (user.password == password) {
                var session = Authentication.generateGUID();
                db.user.update({username: username}, {$set:{session: session}}, function(err2, docs2) {
                    if (!err2){
                        res.cookie('session', session, {httpOnly: true});
                        res.send({status: 200, data: {session: session, userID: user._id}});
                    } else {
                        res.send({status: 403, data: "Unable to update database"});
                    }
                    
                });
            } else {
                res.send({status: 403, data: 'Access Denied'});
            }
        }
    });
});

app.post('/image', function(req, res){
    var userID = req.body.userID;
    var text = req.body.text;
    var image = req.body.image;
    
    if(image == null){
        return res.send("image was not provided");
    } else {
        db.image.save({userID, text: text}, function(err, doc) {
            console.log(doc);
            
            base64Img.img(image, __dirname + "/public", doc._id, function(err, filepath) {
                if (err) {
                    res.send({status: 403, data: {message: "Error! File cannot be saved"}});
                } else {
                    res.send({status: 200, data: {message: "File saved successfully!"}});
                }
            });
        });
    }
});

app.get('/playing_with_cookies', function(req, res){
    var session = req.cookies.session;
    var number = req.cookies.number;
    if (number == null) {
        number = 0;
    } else {
        number = parseInt(number) + 1;
    }
    
    if (session == null) {
        res.cookie('session', 'tasty cookie!', {httpOnly: true});
        res.send('No cookies were detected');
    } else {
        res.cookie('number', number, {httpOnly: true});
        res.send('Number of times page was viewed: ' + number);;
    }
});

app.get('/image', function(req, res){
    var session = req.cookies.session;
    var number = req.cookies.number;
    if (number == null) {
        number = 0;
    } else {
        number = parseInt(number) + 1;
    }
    
    if (session == null) {
        res.cookie('session', 'tasty cookie!', {httpOnly: true});
        res.send('No cookies were detected');
    } else {
        res.cookie('number', number, {httpOnly: true});
        res.send('Number of times page was viewed: ' + number);;
    }
});

app.get('/images', function(req, res){
    db.image.find({}, function(err, docs) {
        if (err){
            res.send('Image could not be retrieved')
        } else {
            res.send(docs)
        }
    });
});


app.get('/test_signed_in', Authentication.ensureSignedIn, function(req, res){
    res.send("you are signed in!");
});

function ensureSignedIn(req, res, next){
    var session = req.cookies.session;
    
    if (session == null){
        return res.send('not signed in');
    } else {
        //todo if user signed in with session, we need to see if the session exists in the database
        next();
    }
}

app.get('/hello_world', function(req, res){
    var result = Random.rollDice()
    var result2 = Random.guessMyAge()
    var result3 = Random.randomTenLetterString()
    res.send("Roll Dice result: " + result + " Age Guess Result: " + result2 + " Random Ten Letters Result: " + result3 );
})

app.listen(8080);