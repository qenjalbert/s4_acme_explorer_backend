'use strict';
/*---------------ACTOR Auth----------------------*/
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

exports.getUserId = async function (idToken) {
    idToken = idToken.replace('Bearer ', '');
    var id = null;

    var actorFromFB = await admin.auth().verifyIdToken(idToken);

    var email = actorFromFB.email;

    var mongoActor = await Actor.findOne({ email: email });
    if (!mongoActor) { return null; }

    else {
        id = mongoActor._id;
        return id;
    }
}


exports.verifyUser = function (requiredRoles) {
    return function (req, res, callback) {
        var idToken = req.headers['authorization'];
        var lang = dict.getLang(req);

        if(!idToken) {
            res.status(401).send({ err: dict.get('Unauthorized', lang) });
        } else {
            idToken = idToken.replace('Bearer ', '');
            admin.auth().verifyIdToken(idToken).then(function (decodedToken) {    
                var email = decodedToken.email;
    
                Actor.findOne({ email: email }, function (err, actor) {
                    if (err) { res.send(err); }
    
                    // No actor found with that email as username
                    else if (!actor) {
                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', email) });
                    }
    
                    else {    
                        var isAuth = false;
                        for (var i = 0; i < requiredRoles.length; i++) {
                            if (requiredRoles[i] === actor.role) {
                                isAuth = true;
                            }
                        }
                        if (isAuth) return callback(null, actor);
                        else {
                            res.status(403).send({ err: dict.get('Forbidden', lang) });
                        }
                    }
                });
            }).catch(function (err) {
                // Handle error,token non valide
                res.status(400).send(err);
            });
        }
    }
}

exports.getUserRoleAndId = async function (idToken) {
    return this.getUserId(idToken).then((idActor) => {
        return Actor.findById(idActor).then((actor) => {
            return {id: idActor, role: actor.role};
        });
    })
}