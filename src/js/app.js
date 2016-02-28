/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

var app = angular.module('AskNCast', ['AskNCast.services', 'ui.router', 'ngMaterial']);

var dev = true;

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('leaderboard', {
            templateUrl: 'views/leaderboard.html'
        })
        .state('question', {
            templateUrl: 'views/question.html'
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
        .primaryPalette('grey', {
            'default': '800',
        })
        .accentPalette('red')
        .dark();
});
