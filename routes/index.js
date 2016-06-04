var express = require('express');
var router = express.Router();

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
  res.render('sent');
});

/* GET pending sms page. */
router.get('/pending', function(req, res, next) {
  res.render('pending');
});

/* GET inbox sms page. */
router.get('/inbox', function(req, res, next) {
  res.render('inbox');
});

module.exports = router;
