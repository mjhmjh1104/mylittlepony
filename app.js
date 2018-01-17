var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('main');
});

app.get('*', function(req, res) {
  res.render('main');
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server Running');
