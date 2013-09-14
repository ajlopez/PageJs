
var compiler = require('../lib/compiler');
    
exports['compile integer'] = function (test) {
    var result = compiler.compileExpression('1');
    test.ok(result);
    test.equal(result, '1');
}
    
exports['compile variable'] = function (test) {
    var result = compiler.compileExpression('$k');
    test.ok(result);
    test.equal(result, '$k');
}
    
exports['compile single quoted string'] = function (test) {
    var result = compiler.compileExpression("'foo'");
    test.ok(result);
    test.equal(result, "'foo'");
}
