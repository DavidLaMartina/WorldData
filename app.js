require('./config.js');

var express               = require('express');

var app                   = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT);
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
})

app.listen(app.get('port'), function(){
  console.log('WorldData started on port ', app.get('port'));
})
