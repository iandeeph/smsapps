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
    })
});

/* GET pending sms page. */
router.get('/pending', function(req, res, next) {
    models.outbox.findAll({
        include: [ models.customer ],
        limit: 10
    }).then(function(pendings) {
        res.render('pending',{
            pendings: pendings
        });
    })
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
    })
});

/* GET conversation page. */
router.get('/allconversation', function(req, res, next) {
    sequelize.query(
        "SELECT " +
        "DATE_FORMAT(date, '%e %b %Y - %k:%i') as date, date as time, number, customer.hal as hal, TotalSMS " +
        "FROM " +
        "(SELECT " +
        "max(date) as date, number, sum(TotalSMS) as TotalSMS " +
        "FROM " +
        "(select " +
        "max(ReceivingDateTime) as date, replace(replace(SenderNumber,'+62','0'), '+628', '08') as number, count(TextDecoded) as TotalSMS " +
        "FROM inbox " +
        "GROUP BY number " +
        "UNION ALL select " +
        "max(SendingDateTime) as date, replace(replace(DestinationNumber,'+62','0'), '+628', '08') as number, count(TextDecoded) as TotalSMS " +
        "FROM sentitems " +
        "GROUP BY number) t " +
        "GROUP BY number) mergetable LEFT JOIN customer ON number = customer.phone " +
        "ORDER BY time DESC LIMIT 20", { type: sequelize.QueryTypes.SELECT})
        .then(function(conversations) {
            //console.log(conversations);
            res.render('conversation', {
                conversations : conversations
            });
        })
});

router.get('/detailconversation/:id', function(req, res, next) {
    var id = req.params.id;
    //console.log(id);
    sequelize.query(
        "SELECT number, time, messages, tableown, customer.name as name, customer.hal as hal " +
        "FROM (" +
        "SELECT REPLACE(REPLACE(SenderNumber, '+62', '0'), '+628', '08') AS number, DATE_FORMAT(ReceivingDateTime, '%e %b %Y - %k:%i') AS time, TextDecoded AS messages, 'inbox' AS tableown " +
        "FROM inbox " +
        "UNION ALL " +
        "SELECT DestinationNumber AS number, DATE_FORMAT(SendingDateTime, '%e %b %Y - %k:%i') AS time, TextDecoded AS messages, 'sentitems' AS tableown " +
        "FROM sentitems) AS conversation " +
        "LEFT JOIN customer ON number = customer.phone " +
        "WHERE number = '"+ id +"'" +
        "ORDER BY time DESC", { type: sequelize.QueryTypes.SELECT})
        .then(function(conversations) {
            //console.log(conversations);
            res.render('conversation-detail', {
                conversations : conversations,
                name: conversations[0].name,
                number:conversations[0].number,
                hal: conversations[0].hal
            });
        })
});

/* GET my conversation page. */
router.get('/myconversation', function(req, res, next) {
    sequelize.query(
        "SELECT " +
        "DATE_FORMAT(date, '%e %b %Y - %k:%i') as date, date as time, number, customer.hal as hal, TotalSMS " +
        "FROM " +
        "(SELECT " +
        "max(date) as date, number, sum(TotalSMS) as TotalSMS " +
        "FROM " +
        "(select " +
        "max(ReceivingDateTime) as date, replace(replace(SenderNumber,'+62','0'), '+628', '08') as number, count(TextDecoded) as TotalSMS " +
        "FROM inbox " +
        "GROUP BY number " +
        "UNION ALL select " +
        "max(SendingDateTime) as date, replace(replace(DestinationNumber,'+62','0'), '+628', '08') as number, count(TextDecoded) as TotalSMS " +
        "FROM sentitems " +
        "GROUP BY number) t " +
        "GROUP BY number) mergetable LEFT JOIN customer ON number = customer.phone " +
        "ORDER BY time DESC LIMIT 20", { type: sequelize.QueryTypes.SELECT})
        .then(function(myConversations) {
            //console.log(conversations);
            res.render('myConversation', {
                myConversations : myConversations
            });
        })
});

/* GET admin user page. */
router.get('/user', function(req, res, next) {
    models.user.findAll().then(function(users) {
        res.render('user',{
            user: users
        });
    })
});

/* GET admin report page. */
router.get('/report', function(req, res, next) {
    res.render('report');
});

/* GET admin log page. */
router.get('/log', function(req, res, next) {
    models.log.findAll({
        limit: 10
    }).then(function(logs) {
        res.render('log',{
            logs: logs
        });
    })
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;
