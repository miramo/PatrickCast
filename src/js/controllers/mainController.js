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
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:0.png', name: "test1", score: 0, },
    //        playerId: ":0",
    //        playerState: 6,
    //    },
    //    {
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:2.png', name: "test2", score: 0, },
    //        playerId: ":2",
    //        playerState: 6,
    //    },
    //    {
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:4.png', name: "test3", score: 0, },
    //        playerId: ":4",
    //        playerState: 6,
    //    },
    //    {
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:6.png', name: "test4", score: 0, },
    //        playerId: ":6",
    //        playerState: 6,
    //    },
    //    {
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:8.png', name: "test5", score: 0, },
    //        playerId: ":8",
    //        playerState: 6,
    //    },
    //    {
    //        playerData: { avatar: 'https://api.adorable.io/avatars/50/:10.png', name: "test6", score: 0, },
    //        playerId: ":10",
    //        playerState: 6,
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
        phase: eGamePhase.CHOOSING,
        question: '',
        questioner: '',
        questioner_id: '',
        questioner_avatar: '',
        skip_avail: false,
    };
    //$scope.gameData = {
    //    phase: eGamePhase.VOTING,
    //    question: 'Tu suces pour un Mars ?',
    //    questioner: 'test1',
    //    questioner_id: ':0',
    //    questioner_avatar: avatarUrlBase+":0.png",
    //    skip_avail: false,
    //};

    $scope.votes = {};
    //$scope.votes = {
    //    ":0": { vote: "yes", prognosis: "3" },
    //    ":2": { vote: "no", prognosis: "0" },
    //    ":4": { vote: "yes", prognosis: "3" },
    //    ":6": { vote: "yes", prognosis: "3" },
    //    ":8": { vote: "yes", prognosis: "4" },
    //    ":10": { vote: "yes", prognosis: "4" },
    //};

    $scope.lastQuestions = [];
    //$scope.lastQuestions = [
    //    {question: "question1?", yes: 2, no: 1},
    //    {question: "question2?", yes: 1, no: 2},
    //    {question: "question3?", yes: 1, no: 1},
    //];

    var idleTimeout = function () {
        if ($scope.connected == 0) {
            cast.finish();
        }
    };

    var calculateVotes = function (votes) {
        if (!_.isEmpty(votes) && _.size(votes) == _.size(cast.game.gameManager_.getPlayersInState($window.cast.receiver.games.PlayerState.PLAYING))) {
            var numberOfYes = cast.game.calculateVotes(votes, $scope.players, $scope.gameData, eGamePhase);
            var numberOfNo = _.size(cast.game.gameManager_.getPlayersInState($window.cast.receiver.games.PlayerState.PLAYING)) - numberOfYes;
            $scope.lastQuestions.push({question: $scope.gameData.question, yes: numberOfYes, no: numberOfNo});
            cast.game.chooseRandomQuestioner($scope.gameData, eGamePhase);
            $scope.votes = {};
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
        if ($scope.gameData.phase == eGamePhase.CHOOSING && cast.game.gameManager_.getConnectedPlayers().length == 1) {
            cast.game.chooseRandomQuestioner($scope.gameData, eGamePhase);
        }
    });

    $scope.$on(cast.PLAYER_QUIT, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
        if ($scope.gameData.phase == eGamePhase.VOTING) {
            calculateVotes($scope.votes);
        }
    });

    $scope.$on(cast.PLAYER_DROPPED, function (ev, castEvent) {
        if (dev)
            $log.debug(castEvent);
        if ($scope.gameData.phase == eGamePhase.VOTING) {
            calculateVotes($scope.votes);
        }
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
                if ($scope.gameData.phase == eGamePhase.VOTING) {
                    cast.game.addVote($scope.votes, castEvent.playerInfo.playerId, castEvent.requestExtraMessageData.vote, castEvent.requestExtraMessageData.prognosis);
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

    $scope.$watchCollection("votes", function (newValue, oldValue) {
        if ($scope.gameData.phase == eGamePhase.VOTING)
            calculateVotes(newValue);
    });

});