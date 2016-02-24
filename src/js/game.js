Game = function (GameManager)
{
    this.gameManager_ = GameManager;

    if (dev)
        this.debugUi = new cast.receiver.games.debug.DebugUI(GameManager);

    var listener = new Listener();
    this.gameManager_.addGameManagerListener(listener);

    this.players_ = [];
};

Game.prototype.run = function (loadedCallback)
{
    this.gameManager_.updateGameplayState(cast.receiver.games.GameplayState.RUNNING, null);
    loadedCallback();
};

Game.prototype.stop = function ()
{

};
