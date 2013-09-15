
var parser = require('../lib/parser');
    
exports['parse assignment'] = function (test) {
    var result = parser.parseCommand('$a=1');
    test.ok(result);
    test.equal(result.compile(), '$a = 1;');
}
    
exports['parse two assignments'] = function (test) {
    var result = parser.parseCommand('$a=1; $b = 2');
    test.ok(result);
    test.equal(result.compile(), '$a = 1; $b = 2;');
}
