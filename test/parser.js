
var parser = require('../lib/parser');
    
exports['parser integer'] = function (test) {
    var result = parser.parseExpression('1');
    test.ok(result);
    test.equal(result.compile(), '1');
}
    
exports['compile variable'] = function (test) {
    var result = parser.parseExpression('$k');
    test.ok(result);
    test.equal(result.compile(), '$k');
}
    
exports['compile single quoted string'] = function (test) {
    var result = parser.parseExpression("'foo'");
    test.ok(result);
    test.equal(result.compile(), "'foo'");
}
