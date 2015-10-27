/**
 * Created by yeti on 21.10.2015.
 */

var Tags = require("tags/Tags");

function LuminanceCalculator() {
    return function (color) {
        color = color || "#000000";
        var number_color = parseInt(color.slice(1), 16);
        var r = (number_color & 0xff0000) >> 16;
        var g = (number_color & 0xff00) >> 8;
        var b = (number_color & 0xff);
        if ((r * 0.299 + g * 0.587 + b * 0.114) / 256.0 < 0.5) {
            return "#FFFFFF";
        } else {
            return "#000000";
        }
    };
}

Tags.factory("LuminanceCalculator", [
    LuminanceCalculator
]);

module.exports = new LuminanceCalculator();