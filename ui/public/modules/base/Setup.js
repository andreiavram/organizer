/**
 * Created by yeti on 21.10.2015.
 */

function OrganizerSetup($interpolateProvider, $resourceProvider, $httpProvider, msdElasticConfig) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;

    msdElasticConfig.append = "\n\n";
}

module.exports = OrganizerSetup;