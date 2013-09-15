
function preprocess(text) {
    return "echo('" + text + "');";
}

module.exports = {
    preprocess: preprocess
}