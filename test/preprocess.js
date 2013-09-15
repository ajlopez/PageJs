
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
