/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

app.controller('mainController', ['$scope', function ($scope) {

    $scope.people = [
        { name: 'piouff', img: 'https://api.adorable.io/avatars/50/piouff.png' },
        { name: 'edmond', img: 'https://api.adorable.io/avatars/50/edmond.png' },
        { name: 'miramo', img: 'https://api.adorable.io/avatars/50/miramo.png' }
    ];

}]);