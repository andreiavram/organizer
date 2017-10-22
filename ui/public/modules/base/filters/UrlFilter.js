/**
 * Created by yeti on 28.10.2015.
 */

var Base = require("base/Base");

function parseUrlFilter() {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target) {
        if (!text) return "";
        text = text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
        text = text.replace(/\n/g, "<br>");
        return text;

    };
}

Base.filter('parseUrlFilter', [
    parseUrlFilter
]);

module.exports = parseUrlFilter;