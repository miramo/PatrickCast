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

Game.prototype.stop = function ()
{

};
