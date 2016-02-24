'use strict';

var game = null;
var appName = 'AskNCast';

/**
 * Main entry point. This is not meant to be compiled so suppressing missing
 * goog.require checks.
 */
var initialize = function() {
  var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var appConfig = new cast.receiver.CastReceiverManager.Config();

  appConfig.statusText = appName + ' ready.';
  // In production, use the default maxInactivity instead of using this.
  appConfig.maxInactivity = 6000; // 100 minutes for testing only.

  // Create the game before starting castReceiverManager to make sure any extra
  // cast namespaces can be set up.
  /** @suppress {missingRequire} */
  var gameConfig = new cast.receiver.games.GameManagerConfig();
  gameConfig.applicationName = appName;
  // Allow more than the default number of players for this debugger receiver.
  gameConfig.maxPlayers = 10;
  /** @suppress {missingRequire} */
  var gameManager = new cast.receiver.games.GameManager(gameConfig);
  /** @suppress {missingRequire} */
  game = new Game(gameManager);

  // Note that we will not automatically tear down the debugger if there are no
  // senders to make it easy for playing with the receiver using devtools.
  var startGame = function() {
    game.run(function() {
      console.log(gameConfig.applicationName + ' running.');
      gameManager.updateGameStatusText(gameConfig.applicationName + ' running.');
    });
  };

  castReceiverManager.onReady = function(event) {
    if (document.readyState === 'complete') {
      startGame();
    } else {
      window.onload = startGame;
    }
  };
  castReceiverManager.start(appConfig);
};

