/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var sass = require('node-sass');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

app.use(
        sass.middleware({
            src: __dirname + '/www/', //where the sass files are 
            dest: __dirname + '/www/', //where css should go
            debug: true // obvious
        })
       );

app.use(express.static(path.join(__dirname, 'www')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}


app.get('/', routes.index);
app.get('/board', routes.whiteboard);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
