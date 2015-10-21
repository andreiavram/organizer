var BasePromise = require('promise');

function Q(promises) {
    return BasePromise.all(promises);
}

module.exports = Q;
