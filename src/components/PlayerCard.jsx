function getPlayerProfileUrl(playerId, playerName) {
    let temp = playerName.toLowerCase();
    temp = temp.replaceAll(" ", "-");
    let playerProfileUrl = `https://www.mlb.com/player/${temp}-${playerId}`;
    return playerProfileUrl;
}

function PlayerCard(props) {
    let playerProfileUrl = getPlayerProfileUrl(props.playerId, props.playerName);

    return (
        <>
            <article className="player-card">
                <a href={playerProfileUrl}>
                    <img src={props.playerImg}/>
                </a>
                <p>{props.playerName} {props.playerStats}</p>
            </article>
        </>
    );
}

export default PlayerCard