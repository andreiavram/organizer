var Base = require('base/Base');
var BaseRoutes = require('base/Routes');
var Auth = require('auth/Auth');
var AuthRoutes = require('auth/Routes');
var Tasks = require('tasks/Tasks');
var TasksRoutes = require('tasks/Routes');
var Tags = require('tags/Tags');
var TagsRoutes = require("tags/Routes");
var Projects = require("projects/Projects");
var ProjectsRoutes = require("projects/Routes");

var ApplicationController = require("auth/controllers/ApplicationController");

Base.requires.push('Auth');
Base.requires.push('Tasks');
Base.requires.push('Tags');
Base.requires.push('Projects');

Base.initialize(function() {
    "use strict";
    BaseRoutes();

    AuthRoutes();
    TasksRoutes();
    ProjectsRoutes();
    TagsRoutes();
});
