
var parser = require('../lib/parser');
    
exports['parse assignment'] = function (test) {
    var result = parser.parseCommand('$a=1');
    test.ok(result);
    test.equal(result.compile(), '$a = 1;');
}
    
exports['parse two assignments'] = function (test) {
    var myparser = parser.createParser('$a=1; $b = 2;');
    
    var result = myparser.parseCommand();
    test.ok(result);
    test.equal(result.compile(), '$a = 1;');

    result = myparser.parseCommand();
    test.ok(result);
    test.equal(result.compile(), '$b = 2;');
    
    test.equal(myparser.parseCommand(), null);
}

exports['parse composite command'] = function (test) {
    var myparser = parser.createParser('{$a=1; $b = 2;}');
    
    var result = myparser.parseCommand();
    test.ok(result);
    test.equal(result.compile(), '{ $a = 1; $b = 2; }');
    
    test.equal(myparser.parseCommand(), null);
}

exports['parse simple if command'] = function (test) {
    var myparser = parser.createParser('if ($k) \r\n $a=1;');
    
    var result = myparser.parseCommand();
    test.ok(result);
    test.equal(result.compile(), 'if ($k) $a = 1;');
    
    test.equal(myparser.parseCommand(), null);
}
