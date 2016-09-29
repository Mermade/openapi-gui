var express = require('express');
var compression = require('compression');

var app = express();
app.use(compression());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/index.html');
});
app.use("/",  express.static(__dirname));

var myport = process.env.PORT || 3000;
if (process.argv.length>2) myport = process.argv[2];

var server = app.listen(myport, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Arapaho server listening at http://%s:%s', host, port);
});