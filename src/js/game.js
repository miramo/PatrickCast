/**
 * Created by KOALA on 25/02/2016.
 */

Game = function (GameManager)
{
    this.gameManager_ = GameManager;

    if (dev)
        this.debugUi = new cast.receiver.games.debug.DebugUI(GameManager);
};

Game.prototype.run = function (loadedCallback)
{
    this.gameManager_.updateGameplayState(cast.receiver.games.GameplayState.RUNNING, null);
    loadedCallback();
};

Game.prototype.setDebugUi = function (toggle) {
    if (toggle)
        this.debugUi.open();
    else
        this.debugUi.close();
};

Game.prototype.setGameData = function (gameData) {
    this.gameManager_.updateGameData(gameData);
};

Game.prototype.chooseRandomQuestioner = function (players, gameData, eGamePhase) {
    var randomPlayer = _.shuffle(players)[0];
    gameData.phase = eGamePhase.CHOOSING;
    gameData.questioner = randomPlayer.playerData.name;
    gameData.questioner_id = randomPlayer.playerId;
    gameData.skip_avail = false;
    this.setGameData(gameData);
};

Game.prototype.stop = function ()
{

};
