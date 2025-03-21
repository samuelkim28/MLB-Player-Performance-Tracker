import { useState, useEffect } from 'react'
import './styles/App.css'
import PlayerCard from './components/PlayerCard';
import TeamSelector from './components/TeamSelector';
import DateSelector from './components/DateSelector';

function getPlayersByPosition(jsonData, team, positionFilter) {
  let players = [];
  let awayTeam = jsonData["teams"]["away"]["team"]["name"];
  let playersJson = (awayTeam === team)? 
      jsonData["teams"]["away"]["players"] : jsonData["teams"]["home"]["players"];
  for (let playerId in playersJson) {
    let player = playersJson[playerId];
    let playerPosition = player.position.name;
    if (playedInGame(player) && positionFilter(playerPosition)) {
      players.push(player);
    }
  }
  return players;
}

function playedInGame(playerJson) {
  const playerStats = playerJson["stats"];
  if (isEmpty(playerStats["batting"]) && isEmpty(playerStats["pitching"]) 
      && isEmpty(playerStats["fielding"])) {
    return false;
  } else {
    return true;
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getPlayerImageUrl(playerId, size) {
  return `https://midfield.mlbstatic.com/v1/people/${playerId}/spots/${size}`;
}

function getBoxScoreOfGameUrl(gameId) {
  return `https://statsapi.mlb.com/api/v1/game/${gameId}/boxscore`;
}

function getScheduleUrl(date) {
  return `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;
}

// Note: a team could play twice in one day
function getGameId(jsonData, team) {
  let dates = jsonData.dates;
  let gameId = "000";

  for (let date of dates) {
    for (let game of date.games) {
      let teams = game.teams;
      if (teams.away.team.name === team || teams.home.team.name === team) {
        gameId = game.gamePk;
      }
    }
  }
  return gameId;
}

function getGameStatus(jsonData, gameId) {
  let gameStatus;
  let dates = jsonData.dates;
  for (let date of dates) {
    for (let game of date.games) {
      if (game.gamePk === gameId) {
        gameStatus = game.status.detailedState;
      }
    }
  }
  return gameStatus;
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function getPerformanceScore(player) {
  let battingStats = player.stats.batting;
  let pitchingStats = player.stats.pitching;

  let groundOuts = battingStats.groundOuts ?? 0;
  let airOuts = battingStats.airOuts ?? 0;
  let strikeOuts = battingStats.strikeOuts ?? 0;
  let baseOnBalls = battingStats.baseOnBalls ?? 0;
  let hits = battingStats.hits ?? 0;
  let hitByPitch = battingStats.hitByPitch ?? 0;
  let caughtStealing = battingStats.caughtStealing ?? 0;
  let stolenBases = battingStats.stolenBases ?? 0;
  let gidps = battingStats.groundIntoDoublePlay ?? 0;
  let gitps = battingStats.groundIntoTriplePlay ?? 0;
  let totalBases = battingStats.totalBases ?? 0;
  let rbi = battingStats.rbi ?? 0;
  let sacBunts = battingStats.sacBunts ?? 0;
  let sacFlies = battingStats.sacFlies ?? 0;
  let pickoffs = battingStats.pickoffs ?? 0;

  let outs = pitchingStats.outs ?? 0;
  let earnedRuns = pitchingStats.earnedRuns ?? 0;
  let hitsAllowed = pitchingStats.hits ?? 0;
  let walksAllowed = pitchingStats.baseOnBalls ?? 0;
  let battersStruckOut = pitchingStats.strikeOuts ?? 0;
  let holds = pitchingStats.holds ?? 0;
  let saves = pitchingStats.saves ?? 0;
  let blownSaves = pitchingStats.blownSaves ?? 0;

  let performanceScore = (-1 * groundOuts) + (-1 * airOuts) + (-1 * strikeOuts) + baseOnBalls + hits +
      (.25 * hitByPitch) + (-1 * caughtStealing) + stolenBases + (-1 * gidps) + (-2 * gitps) + totalBases +
      rbi + sacBunts + sacFlies + (-1 * pickoffs) + (outs / 3) + (-1 * earnedRuns) + (-.5 * hitsAllowed) +
      (-.5 * walksAllowed) + (.5 * battersStruckOut) + holds + (2 * saves) + (-2 * blownSaves);

  return performanceScore;
}

function comparePlayers(player, player2) {
  return getPerformanceScore(player2) - getPerformanceScore(player);
}

function App() {
  const [currPositionPlayers, setCurrPositionPlayers] = useState([])
  const [currPitchers, setCurrPitchers] = useState([]);
  const [currTeam, setCurrTeam] = useState("Boston Red Sox");
  const [currDate, setCurrDate] = useState(getTodaysDate());
  const [isLoading, setIsLoading] = useState(true);

  function handleTeamSelect(value) {
    setCurrTeam(value);
  }

  function handleDateSelect(value) {
    setCurrDate(value);
  }

  useEffect(() => {
    let team = currTeam;
    let date = currDate;
    let intervalId;
    setIsLoading(true);

    const fetchBaseballData = () => {
      fetch(getScheduleUrl(date))
        .then(response => response.json())
        .then(result => {
          let gameId = getGameId(result, team);
          let gameStatus = getGameStatus(result, gameId);

          fetch(getBoxScoreOfGameUrl(gameId))
            .then(resp => resp.json())
            .then(res => {
              let positionPlayers = getPlayersByPosition(res, team, pos => pos !== "Pitcher");
              let pitchers = getPlayersByPosition(res, team, pos => pos === "Pitcher");
              positionPlayers.sort(comparePlayers);
              pitchers.sort(comparePlayers);
              setCurrPositionPlayers(positionPlayers);
              setCurrPitchers(pitchers);
            })
            .finally(() => {
              setIsLoading(false);
            });
          
          if (gameStatus === "In Progress") {
            if (!intervalId) {
              intervalId = setInterval(fetchBaseballData, 10000);
            }
          } else {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        });
    };

    fetchBaseballData();

    return () => {
      if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
      }
    };
  }, [currTeam, currDate]);

  const getPlayerCard = player => {
    const playerId = player.person.id;
    const playerImg = getPlayerImageUrl(player.person.id, 100);
    const playerName = player.person.fullName;
    const playerPosition = player.position.name;
    const playerBattingSummary = player.stats.batting.summary;
    const playerPitchingSummary = player.stats.pitching.summary;
    return <PlayerCard key={playerId} playerId={playerId} playerImg={playerImg} playerName={playerName} playerPosition={playerPosition} playerBattingSummary={playerBattingSummary} playerPitchingSummary={playerPitchingSummary}/>;
  }
  const currPositionPlayerElements = currPositionPlayers.map(getPlayerCard);
  const currPitcherElements = currPitchers.map(getPlayerCard);

  return (
    <>
      <h1>MLB Performance Tracker</h1>
      <div className="input-container">
        <TeamSelector handleTeamSelect={handleTeamSelect} currTeam={currTeam}/>
        <DateSelector handleDateSelect={handleDateSelect} currDate={currDate}/>        
      </div>
      <div className="player-card-container">
        <div className="position-player-container">
          {currPositionPlayerElements}
        </div>
        <div className="pitcher-container">
          {currPitcherElements}
        </div>        
      </div>
      {(!isLoading && currPositionPlayers.length === 0)? <p>The {currTeam} have not played on {currDate}. Please select another team/date or check back later.</p> : null}
    </>
  );
}

export default App