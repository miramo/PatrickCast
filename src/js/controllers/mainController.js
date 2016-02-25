/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

app.controller('mainController', function ($scope, $log, cast) {

    $scope.players = [];

    $scope.$on(cast.PLAYER_AVAILABLE, function (ev, castEvent) {
        $scope.players.push(castEvent.playerInfo);
        cast.game.gameManager_.updatePlayerData(castEvent.playerInfo.playerId, {name: castEvent.requestExtraMessageData.name, score: 0, avatar: 'https://api.adorable.io/avatars/50/'+castEvent.playerInfo.playerId+'.png'});
        $log.info(castEvent);
    });

});