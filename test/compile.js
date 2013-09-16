
var compiler = require('../lib/compiler');

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