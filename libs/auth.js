var express = require('express');
var mongojs = require('mongojs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var Guid = require('guid');

function ensureSignedIn(req, res, next){
    var session = req.cookies.session;
    
    
     if (session == null){
        return res.send('Not signed in!');
    
         
     }  if (session == null){
        return res.send('Not signed in!');
    } else {

        db.user.findOne({session: session}, function(err, user){
            if (err){
                return res.send("server error");
            } else {
                if (user == null){
                
                    return res.send("you're not signed in!")
                } else {
                    next();
                }
            }
        });

    }
}
function generateGUID(){
    
    var authToken = Guid.raw();
    return authToken;
    
}

var exports = {
    generateGUID: generateGUID,
    ensureSignedIn: ensureSignedIn
}

module.exports = exports