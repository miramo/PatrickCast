/**
 * Created by KOALA on 25/02/2016.
 */
'use strict';

angular.module('AskNCast.services', []).service('cast',function Cast($window, $rootScope, $q) {

    this.game = null;
    this.appName = 'AskNCast';
    var service = this;
    var castReceiverManager;

    this.SENDER_CONNECTED = "sender-connected";
    this.SENDER_DISCONNECTED = "sender-disconnected";
    this.PLAYER_AVAILABLE = "player-available";
    this.PLAYER_QUIT = "player-quit";
    this.PLAYER_DROPPED = "player-dropped";
    this.GAME_MESSAGE_RECEIVED = "game-message-received";

    var initializeCast = function () {
        castReceiverManager = $window.cast.receiver.CastReceiverManager.getInstance();
        var appConfig = new $window.cast.receiver.CastReceiverManager.Config();

        appConfig.statusText = service.appName + ' ready.';
        // In production, use the default maxInactivity instead of using this.
        appConfig.maxInactivity = 6000; // 100 minutes for testing only.

        // Create the game before starting castReceiverManager to make sure any extra
        // cast namespaces can be set up.
        /** @suppress {missingRequire} */
        var gameConfig = new $window.cast.receiver.games.GameManagerConfig();
        gameConfig.applicationName = service.appName;
        // Allow more than the default number of players for this debugger receiver.
        gameConfig.maxPlayers = 10;
        /** @suppress {missingRequire} */
        var gameManager = new $window.cast.receiver.games.GameManager(gameConfig);
        /** @suppress {missingRequire} */
        service.game = new Game(gameManager);

        // Note that we will not automatically tear down the debugger if there are no
        // senders to make it easy for playing with the receiver using devtools.
        var startGame = function() {
            service.game.run(function() {
                console.log(gameConfig.applicationName + ' running.');
                gameManager.updateGameStatusText(gameConfig.applicationName + ' running.');
            });
        };

        castReceiverManager.onSenderConnected = function (event) {
            $rootScope.$apply(function () {
                $rootScope.$broadcast(service.SENDER_CONNECTED, event);
            });
        };
        castReceiverManager.onSenderDisconnected = function (event) {
            $rootScope.$apply(function () {
                $rootScope.$broadcast(service.SENDER_DISCONNECTED, event);
            });
        };

        gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_AVAILABLE,
            function(event) {
                //console.log('Player ' + event.playerInfo.playerId + ' is available');
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.PLAYER_AVAILABLE, event);
                });
            });

        gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT,
            function(event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.PLAYER_QUIT, event);
                });
            });

        gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED,
            function(event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.PLAYER_DROPPED, event);
                });
            });

        gameManager.addEventListener(cast.receiver.games.EventType.GAME_MESSAGE_RECEIVED,
            function(event) {
                //console.log(event);
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.GAME_MESSAGE_RECEIVED, event);
                });
            });

        castReceiverManager.onReady = function(event) {
            startGame();
        };
        castReceiverManager.start(appConfig);

    };

    this.boot = function () {
        if (document.readyState === 'complete') {
            initializeCast();
        } else {
            $window.onload = initializeCast;
        }
    };

    this.finish = function () {
        castReceiverManager.stop();
    };
}).
run(function (cast) {
    cast.boot();
});