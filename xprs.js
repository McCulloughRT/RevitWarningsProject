var multiparty = require('multiparty');
var fs = require('fs');
var html2db = require('./html2db.js');
var email2db = require('./email2db.js');
var query = require('./query.js');
var express = require('express');

var app = express();
var public_dir = './public/';
var sendOptions = { root: __dirname + '/public/' };
app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile('index.html', sendOptions);
});
app.get('/data', function(req,res){
  res.sendFile('jqwarn.html', sendOptions);
});
app.get('/upload', function (req, res){
  res.sendFile('upload.html', sendOptions);
});
app.get('/about', function (req, res){
  res.sendFile('about.html', sendOptions);
});
app.get('/methodology', function (req, res){
  res.sendFile('methodology.html', sendOptions);
});
app.get('/remove', function(req,res){
  res.sendFile('remove.html', sendOptions);
});

app.post('/email', function(req,res){
  var emailValue = "";
  var emailForm = new multiparty.Form();
  emailForm.on('field', function(name, value) {
    emailValue = value;
  });

  emailForm.on('close', function(){
    if(emailValue) {
      email2db.SendEmail(emailValue, 0);
      sleep(2000, function(){
        res.sendFile('index.html', sendOptions);
      });
    };
  });
  emailForm.parse(req);
});

app.post('/remove', function (req, res){
  console.log('request started');
  var form = new multiparty.Form();
  var file = "";

  form.on('error', function(err) {
    console.log('There was a problem');
    res.setHeader('content-type', 'text/plain');
    res.end('Could not complete transfer');
  });

  form.on('part', function(part) {
    console.log('part received');

    if (!part.filename) {
      console.log('non file part processed');
      part.resume();
    }

    if (part.filename) {
      console.log('file part processed');
      part.resume();
    }

    part.on('data', function(buffer){
      var type = part.headers['content-type'];
      if (type == 'text/html') {
        file += buffer;
      } else {
        console.log('Part was not HTML');
      }
    });
  });

  form.on('close', function() {
    if (!file) {
      console.log('wrong type of file');
      res.sendFile('typeFailure.html', sendOptions);
    } else {
      console.log('Upload completed!');
      html2db.RemoveProject(file, function(hashError){
        console.log('removal complete');
        query.QueryDB(function(){
          console.log('Final Callback Reached!');
          res.sendFile('removalSuccess.html', sendOptions);
        });
        query.QueryDBMain(function(){
          console.log('Main Callback Reached');
        });
      });
    }
  });
  form.parse(req);
});


app.post('/upload', function (req, res){
  console.log('request started');
  var form = new multiparty.Form();
  var file = "";
  var phaseEntered = "";
  var emailEntered = "";

  form.on('error', function(err) {
    console.log('There was a problem');
    res.setHeader('content-type', 'text/plain');
    res.end('Could not complete transfer');
  });

  form.on('field', function(name, value) {
    console.log('field identified');
    if(name == 'phase') {
      phaseEntered = value;
    } else if (name == 'email') {
      emailEntered = value;
    }
  });

  form.on('part', function(part) {
    console.log('part received');

    if (!part.filename) {
      console.log('non file part processed');
      part.resume();
    }

    if (part.filename) {
      console.log('file part processed');
      part.resume();
    }

    part.on('data', function(buffer){
      var type = part.headers['content-type'];
      if (type == 'text/html') {
        file += buffer;
      } else {
        console.log('Part was not of type HTML');
      }
    });
  });

  form.on('close', function() {
    if (!file) {
      console.log('wrong type of file');
      res.sendFile('typeFailure.html', sendOptions);
    } else {
      console.log('Upload completed!');
      if (emailEntered){
        email2db.SendEmail(emailEntered, 1);
      }
      html2db.ParseUpload(file, phaseEntered, function(hashError){
        if(hashError) {
          console.log('html2db bypassed');
          res.sendFile('dupeFailure.html', sendOptions);
        } else {
          console.log('Database Updated');
          query.QueryDB(function(){
            console.log('Final Callback Reached!');
            res.sendFile('success.html', sendOptions);
          });
          query.QueryDBMain(function(){
            console.log('Main Callback Reached');
          });
        }
      });
    }
  });
  form.parse(req);
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Express App listening on port: ' + port);
});

function sleep(time, callback) {
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + time){
    ;
  }
  callback();
}
