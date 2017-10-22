## What's included
- npm and bower dependencies

- gulp with:
    - [browser-sync](http://www.browsersync.io/docs/gulp/)
    - less
    - jshint
    - browserify
    - sourcemaps for js and less
    - uglify and minify at build
    - debug build (sourcemaps, unminified)

- "base" module with:
    - `Config` browserify service
    - `RootScope` browserify service exposing `$rootScope`
    - `Promise` wrapper over [npm-promise](https://www.npmjs.com/package/promise) automatically calling `$rootScope.$apply`
    - `Request` wrapper over [superagent](https://github.com/visionmedia/superagent) automatically handling authentication exceptions
    - `Base` module and `Router` browserify service wrapping [angular-ui-router](https://github.com/angular-ui/ui-router)'s `$stateProvider` and `$urlRouterProvider` services
    - other useful stuff

- jQuery, Bootstrap and [Angular UI Bootstrap](https://angular-ui.github.io/bootstrap/)

## How to set up:

    apt-get install nodejs
    npm install
    bower install


### How to run:

    gulp serve

Now navigate to [http://localhost:3000/](http://localhost:3000/)


### How to build (you need to run it once first):

    gulp serve
    gulp build