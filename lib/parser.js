
var sg = require('simplegrammar');

var get = sg.get;

function IntegerExpression(integer) {
    this.compile = function () { return integer; }
}

function StringExpression(string) {
    this.compile = function () { return string; }
}

function VariableExpression(name) {
    this.compile = function () { return name; }
}

var rules = [
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value); }),
    get('$', ['a-z', 'A-Z', '_'], get(['a-z', 'A-Z', '_', '0-9']).zeroOrMore()).generate('Variable', function (value) { return new VariableExpression(value); }),
    get("'").upTo("'").generate('String', function (value) { return new StringExpression(value); }),
    get('Integer').generate('Expression'),
    get('Variable').generate('Expression'),
    get('String').generate('Expression')
];

function parseExpression(text) {
    var parser = sg.createParser(text, rules);
    var result = parser.parse("Expression");
    
    if (result)
        return result.value;
       
    return null;
}

module.exports = {
    parseExpression: parseExpression
};