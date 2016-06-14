var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sms', 'root', 'c3rmat', {
    dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
    multipleStatements: true,
    port:    3306 // or 5432 (for postgres)
});

sequelize
    .authenticate()
    .then(function(err) {
      console.log('Connection has been established successfully.');
    }, function (err) {
      console.log('Unable to connect to the database:', err);
    });

var routes = require('./routes/index');
var app = express();

// view engine setup
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        parsePrivilege: function (privilege) {
            var parse = "";
            if (privilege == '1'){
                parse = "Operator";
            }else if (privilege == '2'){
                parse = "Administrator"
            }

            return parse;
        },
        converstionOwner: function (owner) {
            var pos = "";
            if (owner == 'inbox'){
                pos = "grey left";
            }else if (owner == 'sentitems'){
                pos = "grey right darken-1"
            }

            return pos;
        },
        nameNumber: function (name, number) {
            var joinName = "";
            if(name) {
                joinName = "\""+ name +"\" - "+ number +"";
            }else{
                joinName = number;
            }

            return joinName;
        },
        joinTextOutbox: function(textOutbox, textOutboxMultipart) {
            var joinText = "";
            if(textOutboxMultipart) {
                joinText = textOutbox + "" + textOutboxMultipart;
            }else{
                joinText = textOutbox;
            }
            return joinText;
        }
    }
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.param('id', function (req, res, next, id) {
    req.params = {};
    req.params.id = id;
    return next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
