
var parser = require('../lib/parser');
    
exports['parse integer'] = function (test) {
    var result = parser.parseExpression('1');
    test.ok(result);
    test.equal(result.compile(), '1');
}
    
exports['parse variable'] = function (test) {
    var result = parser.parseExpression('$k');
    test.ok(result);
    test.equal(result.compile(), '$k');
}
    
exports['parse single quoted string'] = function (test) {
    var result = parser.parseExpression("'foo'");
    test.ok(result);
    test.equal(result.compile(), "'foo'");
}

exports['parse integer sum'] = function (test) {
    var result = parser.parseExpression("1+2");
    test.ok(result);
    test.equal(result.compile(), "1 + 2");
}

exports['parse variable subtract'] = function (test) {
    var result = parser.parseExpression("$a-$b");
    test.ok(result);
    test.equal(result.compile(), "$a - $b");
}

exports['parse integer subtract'] = function (test) {
    var result = parser.parseExpression("1 - 2");
    test.ok(result);
    test.equal(result.compile(), "1 - 2");
}

exports['parse variable sum'] = function (test) {
    var result = parser.parseExpression("$a+$b");
    test.ok(result);
    test.equal(result.compile(), "$a + $b");
}

exports['parse variable multiply'] = function (test) {
    var result = parser.parseExpression("$a*$b");
    test.ok(result);
    test.equal(result.compile(), "$a * $b");
}

exports['parse variable divide'] = function (test) {
    var result = parser.parseExpression("$a/$b");
    test.ok(result);
    test.equal(result.compile(), "$a / $b");
}