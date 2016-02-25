/**
 * Created by KOALA on 25/02/2016.
 */
'use strict';

angular.module('AskNCast.services', []).service('cast',function Cast($window, $rootScope, $q) {

    this.game = null;
    this.appName = 'AskNCast';
    var service = this;

    this.PLAYER_AVAILABLE = "player-available";

    var initializeCast = function () {
        var castReceiverManager = $window.cast.receiver.CastReceiverManager.getInstance();
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

        gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_AVAILABLE,
            function(event) {
                //console.log('Player ' + event.playerInfo.playerId + ' is available');
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.PLAYER_AVAILABLE, event);
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
}).
run(function (cast) {
    cast.boot();
});