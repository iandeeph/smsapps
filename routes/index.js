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
    sequelize.query(
        "SELECT status, CreatorID, sentitems.ID as ID, DATE_FORMAT(sentitems.SendingDateTime, '%e %b %Y - %k:%i') as date, replace(replace(sentitems.DestinationNumber,'+62','0'), '+628', '08') as number, GROUP_CONCAT(sentitems.TextDecoded SEPARATOR '') as TextDecoded, " +
        "customer.name as name, customer.hal as hal " +
        "FROM sentitems LEFT OUTER JOIN customer ON  replace(replace(sentitems.DestinationNumber,'+62','0'), '+628', '08') = customer.phone " +
        "GROUP BY sentitems.ID ORDER BY sentitems.SendingDateTime DESC " +
        "LIMIT 20", { type: sequelize.QueryTypes.SELECT})
        .then(function(sents) {
        //console.log(sents);
        res.render('sent',{
            sentitems: sents
        });
    })
    .catch(function (err) {
        return next(err);
    });
});

/* GET pending sms page. */
router.get('/pending', function(req, res, next) {
    sequelize.query(
        "SELECT joinOutbox.number as number, joinOutbox.outboxTextDecoded as outboxTextDecoded, joinOutbox.outboxMultiTextDecoded as outboxMultiTextDecoded, joinOutbox.ID as ID, joinOutbox.date as date, joinOutbox.CreatorID as CreatorID, customer.name as name, customer.hal as hal " +
        "FROM(SELECT REPLACE(REPLACE(outbox.DestinationNumber, '+62', '0'), '+628', '08') AS number, outbox.TextDecoded AS outboxTextDecoded, outbox_multipart.TextDecoded AS outboxMultiTextDecoded, outbox.ID AS ID, DATE_FORMAT(outbox.SendingDateTime, '%e %b %Y - %k:%i') AS date, outbox.CreatorID AS CreatorID " +
        "FROM outbox LEFT JOIN outbox_multipart ON outbox.ID = outbox_multipart.ID) joinOutbox left join customer on joinOutbox.number = customer.phone " +
        "ORDER BY date DESC LIMIT 20", { type: sequelize.QueryTypes.SELECT})
        .then(function(pendings) {
        res.render('pending',{
            pendings: pendings
        });
    })
    .catch(function (err) {
        return next(err);
    });
});

/* GET inbox sms page. */
router.get('/inbox', function(req, res, next) {
    sequelize.query(
        "SELECT inbox.ID as ID, DATE_FORMAT(inbox.ReceivingDateTime, '%e %b %Y - %k:%i') as date, replace(replace(inbox.SenderNumber,'+62','0'), '+628', '08') as number, inbox.TextDecoded as TextDecoded, " +
        "customer.name as name, customer.hal as hal " +
        "FROM inbox LEFT OUTER JOIN customer ON  replace(replace(inbox.SenderNumber,'+62','0'), '+628', '08') = customer.phone " +
        "GROUP BY inbox.ID ORDER BY inbox.ReceivingDateTime DESC " +
        "LIMIT 20", { type: sequelize.QueryTypes.SELECT})
    .then(function(inboxes) {
        res.render('inbox',{
            inboxes: inboxes
        });
    })
    .catch(function (err) {
        return next(err);
    });
});

/* GET conversation page. */
router.get('/allconversation', function(req, res, next) {
    sequelize.query(
        "SELECT " +
        "DATE_FORMAT(date, '%e %b %Y - %k:%i') as date, date as time, number, customer.hal as hal, customer.name as name, TotalSMS " +
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
        }).catch(function (err) {
            return next(err);
        });
});

router.get('/detailconversation/:id', function(req, res, next) {
    var id = escape(req.params.id);
    //console.log(id);
    sequelize
        .query(
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
        .catch(function (err) {
            return next(err);
        });
});

/* GET my conversation page. */
router.get('/myconversation', function(req, res, next) {
    sequelize.query(
        "SELECT " +
        "DATE_FORMAT(date, '%e %b %Y - %k:%i') as date, date as time, number, customer.hal as hal, customer.name as name, TotalSMS " +
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
        .catch(function (err) {
            return next(err);
        });
});

/* GET admin user page. */
router.get('/user', function(req, res, next) {
    models.user.findAll().then(function(users) {
        res.render('user',{
            user: users
        });
    })
});

/* GET admin login page. */
router.get('/login', function(req, res, next) {
    res.render('lofin');
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

/* GET report page. */
router.get('/report', function(req, res, next) {
    var dailyQuery = "SELECT " +
        "user.username as username," +
        "user.name as name," +
        "failed," +
        "success " +
        "FROM " +
        "(SELECT " +
        "CreatorID as userID, " +
        "sum(case when status like '%OK%' then 1 else 0 end) as success," +
        "sum(case when status like '%error%' OR status like '%failed%' OR status like '%Unknown%' then 1 else 0 end) as failed " +
        "FROM sentitems " +
        "WHERE SendingDateTime between '2016-06-10 00:00:00' AND '2016-06-10 23:59:59' " +
        "GROUP BY CreatorID) t " +
        "left join user ON userID = user.username";

    var monthlyQuery = "SELECT " +
        "user.username as username," +
        "user.name as name," +
        "failed," +
        "success " +
        "FROM " +
        "(SELECT " +
        "CreatorID as userID, " +
        "sum(case when status like '%OK%' then 1 else 0 end) as success," +
        "sum(case when status like '%error%' OR status like '%failed%' OR status like '%Unknown%' then 1 else 0 end) as failed " +
        "FROM sentitems " +
        "WHERE SendingDateTime " +
        "GROUP BY CreatorID) t " +
        "left join user ON userID = user.username";

    sequelize.query(dailyQuery, { type: sequelize.QueryTypes.SELECT}).then(function(dailyResult) {
        sequelize.query(monthlyQuery, { type: sequelize.QueryTypes.SELECT}).then(function(overallResult) {
            var i = 0;
            var resultDaily = dailyResult;
            var resultOverall = overallResult;
            var datasDaily = {labeluser: [], rawDataSuccess: [], rawDataFailed: []};
            var datasOverall = {labeluser: [], rawDataSuccess: [], rawDataFailed: []};
            for(i = 0; i< resultDaily.length; i += 1){
                datasDaily.labeluser[i] = [(i+1), resultDaily[i].name];
                datasDaily.rawDataSuccess[i] = [((i+1)-0.3), (resultDaily[i].success)];
                datasDaily.rawDataFailed[i] = [(i+1), (resultDaily[i].failed)];
            }
            for(i = 0; i< resultOverall.length; i += 1){
                datasOverall.labeluser[i] = [(i+1), resultOverall[i].name];
                datasOverall.rawDataSuccess[i] = [((i+1)-0.3), (resultOverall[i].success)];
                datasOverall.rawDataFailed[i] = [(i+1), (resultOverall[i].failed)];
            }

            console.log(datasDaily);
            console.log(datasOverall);
            res.render('report',{
                daily: JSON.stringify(datasDaily),
                overall: JSON.stringify(datasOverall)
            });
        });
    })
        .catch(function (err) {
            return next(err);
        });
});

module.exports = router;
