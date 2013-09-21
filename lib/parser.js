
var sg = require('simplegrammar');

var get = sg.get;

function ExpressionCommand(expr) {
    this.compile = function () { return expr.compile() + ';'; };
}

function IfCommand(expr, cmd) {
    this.compile = function () {
        return 'if (' + expr.compile() + ') ' + cmd.compile();
    };
}

function WhileCommand(expr, cmd) {
    this.compile = function () {
        return 'while (' + expr.compile() + ') ' + cmd.compile();
    };
}

function CompositeCommand(cmds) {
    this.compile = function () {
        if (!cmds || cmds.length == 0)
            return '{ }';
            
        var result = '{';
        
        for (var k = 0; k < cmds.length; k++) {        
            result += ' ' + cmds[k].compile();
        }
        
        return result + ' }';
    };
}

function IntegerExpression(integer) {
    this.compile = function () { return integer; }
}

function StringExpression(string) {
    var newstring = '';
    var l = string.length;
    
    for (var k = 0; k < l; k++) {
        var ch = string[k];
        
        if (ch == '\t') {
            newstring += "\\t";
            continue;
        }
        
        if (ch == '\r') {
            newstring += "\\r";
            continue;
        }
        
        if (ch == '\n') {
            newstring += "\\n";
            continue;
        }
        
        newstring += ch;
    }
    
    this.compile = function () { return newstring; }
}

function NameExpression(name) {
    this.compile = function () { return 'php.' + name; }
}

function VariableExpression(name) {
    this.compile = function () { return name; }
}

function BinaryExpression(oper, left, right) {
    var jsoper = oper;
    
    if (oper == '<>')
        jsoper = '!=';
        
    this.compile = function () {
        return left.compile() + " " + jsoper + " " + right.compile();
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
    get(['+', '-', '*', '/', '==', '!=', '<>', '<=', '>=', '=']).generate('BinaryOperator'),
    get('(').generate('LeftPar'),
    get(')').generate('RightPar'),

    get('if', 'LeftPar', 'Expression', 'RightPar', 'Command').generate('Command', function (values) { return new IfCommand(values[2].value, values[4].value); }),
    get('while', 'LeftPar', 'Expression', 'RightPar', 'Command').generate('Command', function (values) { return new WhileCommand(values[2].value, values[4].value); }),
    get('{', 'CommandList', '}').generate('Command', function (values) { return new CompositeCommand(values[1].value); }),

    get('Expression', ';').generate('Command', function (values) { return new ExpressionCommand(values[0].value); }),
    get('Expression').generate('Command', function (value) { return new ExpressionCommand(value); }),
    get('Expression', 'BinaryOperator', 'Expression').generate('Expression', function (values) { return new BinaryExpression(values[1].value, values[0].value, values[2].value); }),
    get('Expression', 'LeftPar', 'ExpressionList', 'RightPar').generate('Expression', function (values) { return new CallExpression(values[0].value, values[2].value); }),

    get('ExpressionList', ',', 'Expression').generate('ExpressionList', function (values) { var result = values[0].value.slice(); result.push(values[2].value); return result; }),
    get('Expression').generate('ExpressionList', function (value) { return [ value ]; }),    
    get('').generate('ExpressionList', function (value) { return [ ]; }),    

    get('CommandList', 'Command').generate('CommandList', function (values) { var result = values[0].value.slice(); result.push(values[1].value); return result; }),
    get('Command').generate('CommandList', function (value) { return [ value ]; }),    
    get('').generate('CommandList', function (value) { return [ ]; }),    

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

function parseCommand(text) {
    var parser = sg.createParser(text, rules);
    var result = parser.parse("Command");
    
    if (result)
        return result.value;
       
    return null;
}

function Parser(text) {
    var parser = sg.createParser(text, rules);
    
    this.parseExpression = function () {
        var result = parser.parse("Expression");
        
        if (result)
            return result.value;
            
        return null;
    }
    
    this.parseCommand = function () {
        var result = parser.parse("Command");
        
        if (result)
            return result.value;
            
        return null;
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    parseExpression: parseExpression,
    parseCommand: parseCommand,
    createParser: createParser
};

