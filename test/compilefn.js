
var pagejs = require('..');

exports['compile text to function'] = function (test) {
    var fn = pagejs.compile("hello, world");
    var result = '';
    var php = {
        echo: function (text) { result += text; }
    };
    
    fn(php);
    
    test.equal(result, "hello, world");
}

exports['compile text with simple code to function'] = function (test) {
    var fn = pagejs.compile("<? $message = 'world'; ?>hello, <?= $message ?>");
    var result = '';
    var php = {
        echo: function (text) { result += text; }
    };
    
    fn(php);
    
    test.equal(result, "hello, world");
}