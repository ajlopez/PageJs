
var compiler = require('./compiler');

function compile(text) {
    return new Function('php', compiler.compile(text));
}

module.exports = {
    compile: compile,
    compileFile: compiler.compileFile
}