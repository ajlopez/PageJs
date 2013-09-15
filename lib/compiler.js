
function preprocess(text) {
    if (text == null || text.trim() == '')
        return '';

    return "echo('" + text + "');";
}

module.exports = {
    preprocess: preprocess
}