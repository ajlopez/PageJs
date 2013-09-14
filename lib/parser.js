
var sg = require('simplegrammar');

var get = sg.get;

function IntegerExpression(integer) {
    this.compile = function () { return integer; }
}

function StringExpression(string) {
    this.compile = function () { return string; }
}

function NameExpression(name) {
    this.compile = function () { return name; }
}

function VariableExpression(name) {
    this.compile = function () { return name; }
}

function BinaryExpression(oper, left, right) {
    this.compile = function () {
        return left.compile() + " " + oper + " " + right.compile();
    }
}

function CallExpression(expr, exprs) {
    this.compile = function () {
        var fn = expr.compile();
        if (!exprs || exprs.length == 0)
            return fn + "()";
            
        fn += "(";
        
        for (var k = 0; k < exprs.length; k++) {
            if (k)
                fn += ", ";
            fn += exprs[k].compile();
        }
        
        return fn + ")";
    }
}

var rules = [
    get([' ','\t','\r','\n']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value); }),
    get('$', ['a-z', 'A-Z', '_'], get(['a-z', 'A-Z', '_', '0-9']).zeroOrMore()).generate('Variable', function (value) { return new VariableExpression(value); }),
    get(['a-z', 'A-Z', '_'], get(['a-z', 'A-Z', '_', '0-9']).zeroOrMore()).generate('Name', function (value) { return new NameExpression(value); }),
    get("'").upTo("'").generate('String', function (value) { return new StringExpression(value); }),
    get(['+', '-', '*', '/']).generate('BinaryOperator'),
    get('(').generate('LeftPar'),
    get(')').generate('RightPar'),
    get('Expression', 'BinaryOperator', 'Expression').generate('Expression', function (values) { return new BinaryExpression(values[1].value, values[0].value, values[2].value); }),
    get('Expression', 'LeftPar', 'RightPar').generate('Expression', function (values) { return new CallExpression(values[0].value); }),
    get('Expression', 'LeftPar', 'ExpressionList', 'RightPar').generate('Expression', function (values) { return new CallExpression(values[0].value, values[2].value); }),
    get('Expression', ',', 'ExpressionList').generate('ExpressionList', function (values) { var result = values[2].value.slice(); result.unshift(values[0].value); return result; }),
    get('Expression').generate('ExpressionList', function (value) { return [ value ]; }),
    get('Integer').generate('Expression'),
    get('Variable').generate('Expression'),
    get('Name').generate('Expression'),
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

