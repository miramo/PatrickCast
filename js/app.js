/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

var app = angular.module('AskNCast', ['ui.router', 'ngMaterial']);

var dev = true;

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html'
        });

});

app.config(function($mdThemingProvider) {
    //$mdThemingProvider.theme('black')
    //    .backgroundPalette('grey', {
    //        'default': '900',
    //    })
    //    .dark();
    //
    //$mdThemingProvider.setDefaultTheme('black');

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('red')
        .dark();
});

if (document.readyState === 'complete') {
    initialize();
} else {
    /** Main entry point. */
    window.onload = initialize;
}