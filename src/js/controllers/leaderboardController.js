/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

app.controller('leaderboardController', function ($scope, cast) {

    $scope.labels = ["Yes", "No"];
    $scope.datas = [];
    $scope.datasQuestions = [];

    var feedDatas = function () {
        angular.forEach($scope.lastQuestions, function(value, key) {
            $scope.datas.push([value.yes, value.no]);
            $scope.datasQuestions.push(value.question);
        });
    };

    feedDatas();
});