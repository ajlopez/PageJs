var pagejs = require('../..'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

var app = express();
  
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

function includeFile(filename) {
    filename = path.join(".", "php", filename);
    return pagejs.compileFile(filename);
}

function definePage(app, name) {
    var filename = path.join('.', 'php', name + '.php');
    var route = name == 'index' ? '/' : '/' + name;
    var text = fs.readFileSync(filename).toString();
    var fn = pagejs.compile(text);
    
    app.get(route, function (req, res) {
        var result = '';
        
        var php = {
            echo: function (text) { result += text; },
            _includeFile: includeFile
        };
        
        fn(php);
        
        res.end(result);
    });
}

definePage(app, 'index');
definePage(app, 'about');
definePage(app, 'contact');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
