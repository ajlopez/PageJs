
var pagejs = require('..'),
    assert = require('assert');
    
// compile integer

var result = pagejs.compileExpression('1');
assert.ok(result);
assert.equal(result, '1');