
var sg = require('simplegrammar');

var get = sg.get;

var rules = [
    get('0-9').oneOrMore().generate('Integer'),
    get('$', ['a-z', 'A-Z', '_'], get(['a-z', 'A-Z', '_', '0-9']).zeroOrMore()).generate('Variable'),
    get("'").upTo("'").generate('String'),
    get('Integer').generate('Expression'),
    get('Variable').generate('Expression'),
    get('String').generate('Expression')
];

function compileExpression(text) {
    var parser = sg.createParser(text, rules);
    var result = parser.parse("Expression");
    
    if (result)
        return result.value;
       
    return null;
}

module.exports = {
    compileExpression: compileExpression
};