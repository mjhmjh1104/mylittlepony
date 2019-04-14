var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.WHATOON_DB || 'mongodb://' + process.env.MONGO_DB + '@ds249727.mlab.com:49727/whatoon', { useMongoClient: true });
var db = mongoose.connection;
db.once('open', function() {
  console.log("DB connected: successfully");
});
db.on('error', function(err) {
  console.log("DB Unexpected ERROR: ", err);
});

var MainSchema = mongoose.Schema({
  Name: String,
  Count: Number,
  Property: [{
    Name: String,
    Seasons: Number,
    Title: [String],
    Width: [Number],
    Height: [Number],
    Property: [{
      Name: String,
      Episodes: Number,
      Title: [String],
      Uri: [String],
      Season_Background: String,
      Season_X: Number,
      Season_Y: Number,
      Season_Width: [Number],
      Season_Height: [Number],
      Animate_Size: [Number],
      Cover_Zoom: Number,
      Episode_X: [Number],
      Episode_Y: [Number],
      Episode_Zoom: [Number]
    }],
    Cover_Num: Number,
    Cover_Img: [String],
    Cover_Background: [String],
    Cover_Size: [Number],
    Cover_X: [Number],
    Cover_Y: [Number],
    Episode_Cover: String,
    Season_Cover: String,
    Songs_Num: Number,
    Songs: [{
      Title: String,
      Season: Number,
      Episode: Number,
      Start_min: Number,
      Start_sec: Number,
      Length: String,
      Lead_Num: Number,
      Lead: [Number],
      Reprise: Number,
      R1_Start_min: Number,
      R1_Start_sec: Number,
      R2_Start_min: Number,
      R2_Start_sec: Number,
      R1_Length: String,
      R2_Length: String,
      R1_Lead_Num: Number,
      R2_Lead_Num: Number,
      R1_Lead: [Number],
      R2_Lead: [Number]
    }]
  }],
  Title: [String]
});
var MainData = mongoose.model('Main', MainSchema);
MainData.findOne({Name: "Main"}, function(err, data) {
  if (err) return console.log("Data Unexpected ERROR: ", err);
  if (!data) {
    MainData.create({Name: "Main", Count: 0, Title: [], Property: [] }, function(err, data) {
      if (err) return console.log("Data Unexpected ERROR: ", err);
      console.log("Data initialized: ", data);
    });
  }
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    res.render('main', data);
  });
});

app.get('/ani', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    res.render('ani', {data:data, i: req.query.ani});
  });
});

app.get('/season', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    res.render('season', {data:data, i: req.query.ani, j: req.query.s});
  });
});

app.get('/episode', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    if (req.query.t) res.render('episode', {data:data, i: req.query.ani, j: req.query.s, k: req.query.e, t: req.query.t});
    else res.render('episode', {data:data, i: req.query.ani, j: req.query.s, k:req.query.e, t: 0});
  });
});

app.get('/song', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    res.render('song', {data:data, i: req.query.ani, j: req.query.s});
  });
});

app.get('/reprise', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
    if (err) return console.log("Data Unexpected ERROR: ", err);
    res.render('reprise', {data:data, i: req.query.ani, k: req.query.k, t1: req.query.t1, t2: req.query.t2});
  });
});

app.get('*', function(req, res) {
  res.render('404');
})

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server Running');
