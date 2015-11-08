var base_url = window.BASE_URL || "http://192.168.33.16:8000";
var config = window.Config || {
    LOGIN_API_URL: base_url + '/rest-auth/login/',
    LOGOUT_API_URL: base_url + '/rest-auth/logout/',
    PROFILE_API_URL: base_url + '/rest-auth/user/',
    TEMPLATE_URL: base_url + "/templates/",
    URL_PREFIX: base_url
};
