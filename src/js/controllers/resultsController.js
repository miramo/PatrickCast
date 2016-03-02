/**
 * Created by KOALA on 28/02/2016.
 */
'use strict';

app.controller('resultsController', function ($scope, $timeout, $state, cast) {

    $scope.labels = ["Yes", "No"];
    $scope.data = [];
    $scope.dataQuestion = "";

    var feedDatas = function () {
        var lastQuestion = _.last($scope.lastQuestions);
        $scope.data = [lastQuestion.yes, lastQuestion.no];
        $scope.dataQuestion = lastQuestion.question;
    };

    $timeout(function() {
        cast.game.chooseRandomQuestioner($scope.gameData, $scope.geteGamePhase());
    }, 10000);

    $scope.$on('$destroy', function () {
        //if (angular.isDefined(goToLeaderBoard)) {
        //    $interval.cancel(goToLeaderBoard);
        //    goToLeaderBoard = undefined;
        //}
    });

    feedDatas();

});