
var pagejs = require('..'),
    assert = require('assert');
    
// compile integer

var result = pagejs.compileExpression('1');
assert.ok(result);
assert.equal(result, '1');
    
// compile variable

var result = pagejs.compileExpression('$k');
assert.ok(result);
assert.equal(result, '$k');
