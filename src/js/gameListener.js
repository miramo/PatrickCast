/**
 * Created by KOALA on 24/02/2016.
 */

Listener = function() {
};

Listener.prototype.onPlayerAvailable = function(event) {
    console.log('Player ' + event.playerInfo.playerId + ' is available');
    game.players_.push(event.playerInfo);
};

Listener.prototype.onPlayerReady = function() {};
Listener.prototype.onPlayerIdle = function() {};
Listener.prototype.onPlayerPlaying = function() {};
Listener.prototype.onPlayerDropped = function() {};
Listener.prototype.onPlayerQuit = function() {};
Listener.prototype.onPlayerDataChanged = function() {};
Listener.prototype.onGameStatusTextChanged = function() {};
Listener.prototype.onGameMessageReceived = function() {};
Listener.prototype.onGameDataChanged = function() {};
Listener.prototype.onGameLoading = function() {};
Listener.prototype.onGameRunning = function() {};
Listener.prototype.onGamePaused = function() {};
Listener.prototype.onGameShowingInfoScreen = function() {};
Listener.prototype.onLobbyOpen = function() {};
Listener.prototype.onLobbyClosed = function() {};