
var sg = require('simplegrammar');

var get = sg.get;

function ExpressionCommand(expr) {
    this.compile = function () { return expr.compile() + ';'; };
}

function ExpressionsExpression(exprs) {
    this.compile = function () { 
        var result = '';
        
        for (var k = 0; k < exprs.length; k++) {
            if (k)
                result += ', ';
            result += exprs[k].compile();
        }
        
        return result;
    };
}

function IfCommand(expr, cmd) {
    this.compile = function () {
        return 'if (' + expr.compile() + ') ' + cmd.compile();
    };
}

function ForCommand(expr1, expr2, expr3, cmd) {
    this.compile = function () {
        return 'for (' + expr1.compile() + '; ' + expr2.compile() + '; ' + expr3.compile() + ') ' + cmd.compile();
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

function PostUnaryExpression(expr, oper) {
    this.compile = function () { return expr.compile() + oper; }
}

function PreUnaryExpression(oper, expr) {
    this.compile = function () { return oper + expr.compile(); }
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

function IncludeExpression(expr) {
    this.compile = function () {
        return "eval(php._includeFile(" + expr.compile() + "))";
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
    get(';').generate('SemiColon'),
    get('++').generate('Increment'),
    get('--').generate('Increment'),

    get('for', 'LeftPar', 'ExpressionList', 'SemiColon', 'ExpressionList', 'SemiColon', 'ExpressionList', 'RightPar', 'Command').generate('Command', 
        function (values) { 
            return new ForCommand(new ExpressionsExpression(values[2]), new ExpressionsExpression(values[4]), 
                new ExpressionsExpression(values[6]), values[8]); 
        }),
    get('if', 'LeftPar', 'Expression', 'RightPar', 'Command').generate('Command', function (values) { return new IfCommand(values[2], values[4]); }),
    get('while', 'LeftPar', 'Expression', 'RightPar', 'Command').generate('Command', function (values) { return new WhileCommand(values[2], values[4]); }),
    get('{', 'CommandList', '}').generate('Command', function (values) { return new CompositeCommand(values[1]); }),

    get('Expression', 'Increment').generate('Expression', function (values) { return new PostUnaryExpression(values[0], values[1]); }),
    get('Increment', 'Expression').generate('Expression', function (values) { return new PreUnaryExpression(values[0], values[1]); }),
    
    get('Expression', ';').generate('Command', function (values) { return new ExpressionCommand(values[0]); }),
    get('Expression').generate('Command', function (value) { return new ExpressionCommand(value); }),
    get('Expression', 'BinaryOperator', 'Expression').generate('Expression', function (values) { return new BinaryExpression(values[1], values[0], values[2]); }),
    get('include', 'LeftPar', 'Expression', 'RightPar').generate('Expression', function (values) { return new IncludeExpression(values[2]); }),
    get('Expression', 'LeftPar', 'ExpressionList', 'RightPar').generate('Expression', function (values) { return new CallExpression(values[0], values[2]); }),

    get('ExpressionList', ',', 'Expression').generate('ExpressionList', function (values) { var result = values[0].slice(); result.push(values[2]); return result; }),
    get('Expression').generate('ExpressionList', function (value) { return [ value ]; }),    
    get('').generate('ExpressionList', function (value) { return [ ]; }),    

    get('CommandList', 'Command').generate('CommandList', function (values) { var result = values[0].slice(); result.push(values[1]); return result; }),
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

