/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

var app = angular.module('AskNCast', ['ui.router']);

var dev = true;

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html'
        });

});

if (document.readyState === 'complete') {
    initialize();
} else {
    /** Main entry point. */
    window.onload = initialize;
}