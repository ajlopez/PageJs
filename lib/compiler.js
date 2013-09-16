
var parser = require('./parser');

function preprocess(text) {
    if (text == null || text.trim() == '')
        return '';
        
    var pleft = text.indexOf("<?");
    
    if (pleft >= 0) {
        var left = text.substring(0, pleft);
        text = text.substring(pleft + 2);
        var pright = text.indexOf("?>");
        var right = text.substring(pright + 2);
        
        var center = text.substring(0, pright);
        
        if (center.substring(0, 3) === 'php')
            center = center.substring(3).trim();
        else if (center[0] === '=')
            center = 'echo(' + center.substring(1).trim() + ');';
        else
            center = center.trim();
        
        return preprocess(left) + center + preprocess(right);
    }

    return "echo('" + text + "');";
}

function compile(text) {
    text = preprocess(text);
    var newparser = parser.createParser(text);
    var cmds = [];
    
    for (var cmd = newparser.parseCommand(); cmd; cmd = newparser.parseCommand())
        cmds.push(cmd);
        
    var ncmds = cmds.length;
    var result = '';
    
    for (var k = 0; k < ncmds; k++)
        result += cmds[k].compile();
    
    return result;
}

module.exports = {
    preprocess: preprocess,
    compile: compile
}