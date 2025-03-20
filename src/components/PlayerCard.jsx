import '../styles/App.css'

function getPlayerProfileUrl(playerId, playerName) {
    let formattedName = getFormattedName(playerName)
    let playerProfileUrl = `https://www.mlb.com/player/${formattedName}-${playerId}`;
    return playerProfileUrl;
}

function getFormattedName(playerName) {
    let res = playerName.toLowerCase();
    res = res.replaceAll(" ", "-");
    
    if (res[playerName.length - 1] === ".") {
      res = res.substring(0, playerName.length - 1)
    }
    res = res.replaceAll(".", "-");
    res = res.replaceAll("'", "-");
    res = res.replaceAll("á", "a");
    res = res.replaceAll("é", "e");
    res = res.replaceAll("í", "i");
    res = res.replaceAll("ó", "o");
    res = res.replaceAll("ú", "u");
    res = res.replaceAll("ñ", "n");
    res = res.replaceAll("--", "-");
    return res
}

function isPitcher(playerPosition) {
    if (playerPosition === "Pitcher") {
        return true;
    } else {
        return false;
    }
}

function PlayerCard(props) {
    let playerProfileUrl = getPlayerProfileUrl(props.playerId, props.playerName);

    return (
        <>
            <article className="player-card">
                <a href={playerProfileUrl}>
                    <img src={props.playerImg} className="player-image"/>
                </a>
                <p className="player-summary">{props.playerName} {isPitcher(props.playerPosition)? props.playerPitchingSummary : props.playerBattingSummary}</p>
            </article>
        </>
    );
}

export default PlayerCard