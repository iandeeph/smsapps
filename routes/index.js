var models  = require('../models');
var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sms', 'root', 'c3rmat', {
    dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
    port:    3306 // or 5432 (for postgres)
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

//router.get('/', function(req, res) {
//  models.User.findAll({
//    include: [ models.Task ]
//  }).then(function(users) {
//    res.render('home', {
//      title: 'Express',
//      users: users
//    });
//  });
//});

/* GET sending single sms page. */
router.get('/single', function(req, res, next) {
    res.render('single');
});

/* GET blasting sms page. */
router.get('/blast', function(req, res, next) {
    res.render('blast');
});

/* GET sent sms page. */
router.get('/sent', function(req, res, next) {
    models.sentitems.findAll(
    {
        attributes: [
            [sequelize.fn('GROUP_CONCAT', sequelize.literal("sentitems.TextDecoded SEPARATOR ''")), "sentMessages"]
            , "CreatorID"
            , "ID"
            , "SendingDateTime"
            , "DestinationNumber"
            , "status"
        ]
        , include: [models.customer]
        , limit:20
            , order: "sentitems.SendingDateTime"
            , group: "sentitems.ID"
        }
    ).then(function(sents) {
        //console.log(sents);
        res.render('sent',{
            sentitems: sents
        });
    }).catch(function(err) {
        console.log(err)
    });
});

/* GET pending sms page. */
router.get('/pending', function(req, res, next) {
    res.render('pending');
});

/* GET inbox sms page. */
router.get('/inbox', function(req, res, next) {
    models.inbox.findAll({
        include: [ models.customer ],
        limit: 10
    }).then(function(inbox) {
        res.render('inbox',{
            inbox: inbox
        });
    }).catch (function(err) {
        console.log(err)
    });
});

/* GET admin user page. */
router.get('/user', function(req, res, next) {
    models.user.findAll().then(function(users) {
        res.render('user',{
            user: users
        });
    }).catch (function(err) {
        console.log(err)
    });
});

/* GET admin report page. */
router.get('/report', function(req, res, next) {
    res.render('report');
});

/* GET admin log page. */
router.get('/log', function(req, res, next) {
    res.render('log');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    models.sentitems.findAll({
        //attributes: [
        //    sequelize.fn('GROUP_CONCAT', sequelize.literal("TextDecoded SEPARATOR '||'"))
        //],
        order: ["SendingDateTime"]
    }).then(function(login) {
        res.render('login',{
            login: login
        });
    }).catch(function(err) {
        console.log(err)
    });
});

module.exports = router;
