/*!
 * UEditor
 */

//(function(){


// word
function filterWordBefore(_editor, _html) {

    return _html;
}
function filterWordAfter(_editor, _contents) {

    return _contents;
}


// excel
function filterExcelBefore(_editor, _html) {

    return _html;
}
function filterExcelAfter(_editor, _contents) {

    return _contents;
}


// web
function filterWebBefore(_editor, _html) {

    return _html;
}
function filterWebAfter(_editor, _contents) {

    return _contents;
}

/**************************************************/

function import_from_word(_editor, _html) {
    _html = filterTags(_editor, _html);
    return _html;
}

function import_from_excel(_editor, _html) {
    _html = filterTags(_editor, _html);
    return _html;
}

function import_from_wps(_editor, _html) {
    _html = filterTags(_editor, _html);
    return _html;
}

//})();
/**
 * [filterTags] 过滤标签
 * 
 * @param {any} _editor 
 * @param {any} _html 
 */
function filterTags(_editor, _html) {
    // var regx = /(<meta[^>]*(?:\/>|>))|(<title>[^>]*<\/title>)|(<style>[^\/]*<\/style>)/gi;
    var regx = /(<meta[^>]*(?:\/>|>))|(<title>[^>]*<\/title>)/gi;
    _html = _html.replace(regx, "");
    return _html;
}