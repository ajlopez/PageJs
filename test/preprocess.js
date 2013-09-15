
var compiler = require('../lib/compiler');

exports['preprocess text'] = function (test) {
    var result = compiler.preprocess('hello');
    test.equal(result, "echo('hello');");
}

