
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
        
        if (center.substring(0, 3) == 'php')
            center = center.substring(3);
            
        center = center.trim();
        
        return preprocess(left) + center + preprocess(right);
    }

    return "echo('" + text + "');";
}

module.exports = {
    preprocess: preprocess
}