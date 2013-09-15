
var compiler = require('../lib/compiler');

exports['preprocess text'] = function (test) {
    var result = compiler.preprocess('hello');
    test.equal(result, "echo('hello');");
}

exports['preprocess null'] = function (test) {
    var result = compiler.preprocess(null);
    test.equal(result, '');
}

exports['preprocess empty stringnull'] = function (test) {
    var result = compiler.preprocess('');
    test.equal(result, '');
}
