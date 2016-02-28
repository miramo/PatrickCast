/**
 * Created by KOALA on 25/02/2016.
 */

function Game (GameManager) {
    this.gameManager_ = GameManager;

    if (dev)
        this.debugUi = new cast.receiver.games.debug.DebugUI(GameManager);
};

Game.prototype.run = function (loadedCallback) {
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

Game.prototype.chooseRandomQuestioner = function (gameData, eGamePhase) {
    var randomPlayer = _.shuffle(this.gameManager_.getConnectedPlayers())[0];
    gameData.phase = eGamePhase.CHOOSING;
    gameData.questioner = randomPlayer.playerData.name;
    gameData.questioner_id = randomPlayer.playerId;
    gameData.questioner_avatar = randomPlayer.playerData.avatar;
    gameData.skip_avail = false;
    this.setGameData(gameData);
};

Game.prototype.setQuestion = function (question, gameData, eGamePhase) {
    gameData.phase = eGamePhase.VOTING;
    gameData.question = question;
    gameData.skip_avail = false;
    this.setGameData(gameData);
};

Game.prototype.addVote = function (votes, playerId, vote, prognosis) {
    votes[playerId] = { vote: vote, prognosis: prognosis };
};

Game.prototype.calculateVotes = function (votes, players, gameData, eGamePhase) {
    //votes = {
    //    ":0": { vote: "yes", prognosis: "3" },
    //    ":2": { vote: "no", prognosis: "0" },
    //    ":4": { vote: "yes", prognosis: "3" },
    //    ":6": { vote: "yes", prognosis: "3" },
    //    ":8": { vote: "yes", prognosis: "4" },
    //    ":10": { vote: "yes", prognosis: "4" },
    //};

    //players = [
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

    var winnerPts = 2;
    var closerPts = 1;
    var numberOfYes = this.getNumberOfYes(votes);
    var winnersId = this.getWinnersId(votes, numberOfYes);

    //If someone found the right prognosis, he earns 2 points
    if (winnersId.length > 0) {
        angular.forEach(winnersId, function(winnerId) {
            angular.forEach(players, function(player) {
                player.playerData.lastPointsWon = 0;
                if (player.playerId == winnerId) {
                    player.playerData.score += winnerPts;
                    player.playerData.lastPointsWon = winnerPts;
                }
            });
        });
    }
    //If no ones found the right prongnosis, the closest earn 1 point
    else {
        var closersId = this.getClosersId(votes, numberOfYes);
        angular.forEach(closersId, function(closerId) {
            angular.forEach(players, function(player) {
                player.playerData.lastPointsWon = 0;
                if (player.playerId == closerId) {
                    player.playerData.score += closerPts;
                    player.playerData.lastPointsWon = closerPts;
                }
            });
        });
    }

    //gameData.phase = eGamePhase.CHOOSING;
    gameData.skip_avail = false;
    this.setGameData(gameData);
    return numberOfYes;
};
Game.prototype.getNumberOfYes = function (votes) {
    var yes = 0;

    angular.forEach(votes, function(value, key) {
        if (value.vote == "yes")
            yes++;
    });

    return yes;
};
Game.prototype.getWinnersId = function (votes, numberOfYes) {
    var winnersId = [];

    angular.forEach(votes, function(value, key) {
        if (value.prognosis == numberOfYes)
            winnersId.push(key);
    });

    return winnersId;
};
Game.prototype.getClosersId = function (votes, numberOfYes) {
    var closersId = [];

    var differences = {};
    angular.forEach(votes, function(value, key) {
        differences[key] = Math.abs(numberOfYes - value.prognosis);
    });
    var closer = _.min(differences);
    angular.forEach(differences, function(value, key) {
        if (value == closer)
            closersId.push(key);
    });

    return closersId;
};

Game.prototype.stop = function () {

};
