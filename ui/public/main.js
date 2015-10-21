var Base = require('base/Base');
var BaseRoutes = require('base/Routes');
var Auth = require('auth/Auth');
var AuthRoutes = require('auth/Routes');
var Tasks = require('tasks/Tasks');
var TasksRoutes = require('tasks/Routes');
var Tags = require('tags/Tags');


Base.requires.push('Auth');
Base.requires.push('Tasks');
Base.requires.push('Tags');

Base.initialize(function() {
    BaseRoutes();
    AuthRoutes();
    TasksRoutes();
});
