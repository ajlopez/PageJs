
var compiler = require('../lib/compiler');

exports['preprocess text'] = function (test) {
    var result = compiler.preprocess('hello');
    test.equal(result, "echo('hello');");
}

exports['preprocess null'] = function (test) {
    var result = compiler.preprocess(null);
    test.equal(result, '');
}

exports['preprocess empty string'] = function (test) {
    var result = compiler.preprocess('');
    test.equal(result, '');
}

exports['preprocess code'] = function (test) {
    var result = compiler.preprocess('<? $k = 1; ?>');
    test.equal(result, '$k = 1;');
}

exports['preprocess code starting with <?php'] = function (test) {
    var result = compiler.preprocess('<?php $k = 1; ?>');
    test.equal(result, '$k = 1;');
}

exports['preprocess expression'] = function (test) {
    var result = compiler.preprocess('<?= $k+1 ?>');
    test.equal(result, "echo($k+1);");
}

exports['preprocess text code text'] = function (test) {
    var result = compiler.preprocess('<h1>Hello</h2><? while ($k++ < 10) { ?><h2>Message</h2><? } ?>');
    test.equal(result, "echo('<h1>Hello</h2>');while ($k++ < 10) {echo('<h2>Message</h2>');}");
}
