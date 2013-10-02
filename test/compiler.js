
var compiler = require('../lib/compiler'),
    path = require('path');

exports['compile simple text'] = function (test) {
    var result = compiler.compile('Hello world');
    test.ok(result);
    test.equal(result, "php.echo('Hello world');");
}

exports['compile text and code'] = function (test) {
    var result = compiler.compile('Hello world<? $k=1 ?>');
    test.ok(result);
    test.ok(result.indexOf("php.echo('Hello world');") >= 0);
    test.ok(result.indexOf("$k = 1;") >= 0);
}

exports['compile text and expression'] = function (test) {
    var result = compiler.compile('Hello world<?= $message ?>');
    test.ok(result);
    test.ok(result.indexOf("php.echo('Hello world');") >= 0);
    test.ok(result.indexOf("php.echo($message);") >= 0);
}

exports['compile file with text'] = function (test) {
    var result = compiler.compileFile(path.join(__dirname, './files/hello.php'));
    test.ok(result);
    test.equal(result, "php.echo('<h1>Hello, world</h1>');");
}

exports['compile file with text and code'] = function (test) {
    var result = compiler.compileFile(path.join(__dirname, './files/hellomsg.php'));
    test.ok(result);
    test.ok(result.indexOf("$message = 'world';") >= 0);
    test.ok(result.indexOf("php.echo($message)") >= 0);
    test.ok(result.indexOf("php.echo('\\r\\n<h1>Hello") >= 0);
}

