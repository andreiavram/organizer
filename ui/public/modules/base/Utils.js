var _ = require('lodash');

function Utils() {
    this.emptyArray = emptyArray;
    this.extendArray = extendArray;
    this.replaceArray = replaceArray;
    
    function emptyArray(array) {
        array.splice(0, array.length);
    }
    
    function extendArray(array, newArray) {
        _.each(newArray, function(val) {
            array.push(val);
        });
    }
    
    function replaceArray(array, newArray) {
        emptyArray(array);
        extendArray(array, newArray);
    }
}

module.exports = new Utils();
