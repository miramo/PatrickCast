/**
 * Created by KOALA on 21/02/2016.
 */
'use strict';

app.controller('mainController', function ($scope, $log, $window, $timeout, $state, cast) {

    $scope.window = $window;
    $scope.connected = 0;
    $scope.sessionCount = 0;

    var avatarUrlBase = 'https://api.adorable.io/avatars/50/';

    var idlePromise;

    $scope.players = [];
    //$scope.players = [
    //    {
    //        playerData: { avatar: avatarUrlBase+":0.png", name: "test1", score: 0, },
    //        playerId: ":0",
    //        playerState: $scope.window.cast.receiver.games.PlayerState.AVAILABLE,
    //    },
    //    {
    //        playerData: { avatar: avatarUrlBase+":2.png", name: "test2", score: 0, },
    //        playerId: ":2",
    //        playerState: $scope.window.cast.receiver.games.PlayerState.AVAILABLE,
    //    },
    //];

    var eGameMessageType = {
        DEBUG_UI: 'debugUI',
        QUESTION: 'question',
        VOTE: 'vote',
        SKIP: 'skip',
    };

    var eGamePhase = {
        CHOOSING: 'choosing',
        VOTING: 'voting',
    };
    $scope.gameData = {
        phase: null,
        question: '',
        questioner: '',
        questioner_id: '',
        questioner_avatar: '',
        skip_avail: false,
    };

    var idleTimeout = function () {
        if ($scope.connected == 0) {
            cast.finish();
        }
    };

    $scope.$on(cast.SENDER_CONNECTED, function (ev, castEvent) {
        $log.info('Sender connected: ' + JSON.stringify(castEvent));
        if (idlePromise) {
            $scope.idle = false;
            $timeout.cancel(idlePromise);
            idlePromise = null;
        }
        $scope.connected++;
        $scope.sessionCount++;
    });
    $scope.$on(cast.SENDER_DISCONNECTED, function (ev, castEvent) {
        $scope.connected--;
        if ($scope.connected == 0) {
            if ($scope.getSessionCount() <= 0) {
                cast.finish();
            } else {
                $scope.idle = true;
                if (idlePromise) {
                    $timeout.cancel(idlePromise);
                }
                idlePromise = $timeout(idleTimeout, 10000);
            }
        }
    });

    $scope.getSessionCount = function () {
        return $scope.sessionCount;
    };

    $scope.$on(cast.PLAYER_AVAILABLE, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
        $scope.players = $scope.players.filter(function(e){return e.playerId !== castEvent.playerInfo.playerId});
        $scope.players.push(castEvent.playerInfo);
        cast.game.gameManager_.updatePlayerData(castEvent.playerInfo.playerId, {name: castEvent.requestExtraMessageData.name, score: 0, avatar: avatarUrlBase+castEvent.playerInfo.playerId+'.png'});
        if ($scope.gameData.phase == null && $scope.players.length == 1) {
            cast.game.chooseRandomQuestioner($scope.players, $scope.gameData, eGamePhase);
        }
    });

    $scope.$on(cast.PLAYER_QUIT, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
    });

    $scope.$on(cast.PLAYER_DROPPED, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
    });

    $scope.$on(cast.GAME_MESSAGE_RECEIVED, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
        switch (castEvent.requestExtraMessageData.type) {
            case eGameMessageType.DEBUG_UI:
                if (dev)
                    cast.game.setDebugUi(castEvent.requestExtraMessageData.toggle);
                break;
            case eGameMessageType.QUESTION:
                if ($scope.gameData.phase == eGamePhase.CHOOSING && $scope.gameData.questioner_id == castEvent.playerInfo.playerId)
                    cast.game.setQuestion(castEvent.requestExtraMessageData.question, $scope.gameData, eGamePhase);
                break;
            case eGameMessageType.VOTE:
                if ($scope.gameData == eGamePhase.VOTING) {

                }
                break;
            case eGameMessageType.SKIP:
                if ($scope.gameData.skip_avail) {

                }
                break;
            default:
                break;
        }
    });

    $scope.$watch("gameData.phase", function (newValue, oldValue) {
        switch (newValue) {
            case null:
                break;
            case eGamePhase.CHOOSING:
                $state.go('leaderboard');
                break;
            case eGamePhase.VOTING:
                $state.go('question');
                break;
            default:
                break;
        }
    });

});