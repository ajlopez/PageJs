
var pagejs = require('../..'),
    fs = require('fs'),
    http = require('http');
    
var text = fs.readFileSync('./index.php').toString();
var fn = pagejs.compile(text);

var server = http.createServer(function (req, res) {
    var result = ''
    var php = {
        echo: function (text) { result += text; }
    }
    
    fn(php);
    
    res.end(result);
});
    
server.listen(3000);