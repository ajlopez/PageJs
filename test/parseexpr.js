
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

exports['parse name'] = function (test) {
    var result = parser.parseExpression("foo");
    test.ok(result);
    test.equal(result.compile(), "php.foo");
}

exports['parse call without arguments'] = function (test) {
    var result = parser.parseExpression("foo()");
    test.ok(result);
    test.equal(result.compile(), "php.foo()");
}

exports['parse call with one argument'] = function (test) {
    var result = parser.parseExpression("foo(1+2)");
    test.ok(result);
    test.equal(result.compile(), "php.foo(1 + 2)");
}

exports['parse call with two arguments'] = function (test) {
    var result = parser.parseExpression("foo($a, 1+2)");
    test.ok(result);
    test.equal(result.compile(), "php.foo($a, 1 + 2)");
}

exports['parse equal'] = function (test) {
    var result = parser.parseExpression("$a==1+2");
    test.ok(result);
    test.equal(result.compile(), "$a == 1 + 2");
}

exports['parse not equal'] = function (test) {
    var result = parser.parseExpression("$a != 1+2");
    test.ok(result);
    test.equal(result.compile(), "$a != 1 + 2");
}

exports['parse php not equal'] = function (test) {
    var result = parser.parseExpression("$a <> 1+2");
    test.ok(result);
    test.equal(result.compile(), "$a != 1 + 2");
}

exports['parser parse two expressions'] = function (test) {
    var myparser = parser.createParser("1 2");
    
    var result = myparser.parseExpression();
    test.ok(result);
    test.equal(result.compile(), "1");
    
    result = myparser.parseExpression();
    test.ok(result);
    test.equal(result.compile(), "2");
    
    test.equal(myparser.parseExpression(), null);
}
