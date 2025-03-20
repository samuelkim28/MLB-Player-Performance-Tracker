import { useState, useEffect } from 'react'
import './styles/App.css'
import PlayerCard from './components/PlayerCard';
import TeamSelector from './components/TeamSelector';
import DateSelector from './components/DateSelector';

function getPlayers(jsonData, team) {
  const players = [];
  const awayTeam = jsonData["teams"]["away"]["team"]["name"];
  const playersJson = (awayTeam === team)? 
      jsonData["teams"]["away"]["players"] : jsonData["teams"]["home"]["players"];

  for (let playerId in playersJson) {
    const player = playersJson[playerId];
    if (playedInGame(player)) {
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
  const dates = jsonData.dates;
  let gameId = "000";

  for (let date of dates) {
    for (let game of date.games) {
      const teams = game.teams;
      if (teams.away.team.name === team || teams.home.team.name === team) {
        gameId = game.gamePk;
      }
    }
  }
  return gameId;
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function App() {
  const [currPlayers, setCurrPlayers] = useState([])
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
    setIsLoading(true);

    const fetchBaseballData = () => {
      fetch(getScheduleUrl(date))
        .then(response => response.json())
        .then(result => {
          let gameId = getGameId(result, team);
          fetch(getBoxScoreOfGameUrl(gameId))
            .then(resp => resp.json())
            .then(res => {
              setCurrPlayers(getPlayers(res, team));
            })
            .finally(() => {
              setIsLoading(false);
            })
        });
    };

    fetchBaseballData();

    if (date === getTodaysDate()) {
      const intervalId = setInterval(fetchBaseballData, 30000);
      return () => clearInterval(intervalId);       
    }
  }, [currTeam, currDate]);

  const currPlayerElements = currPlayers.map(player => {
    const playerId = player.person.id;
    const playerImg = getPlayerImageUrl(player.person.id, 100);
    const playerName = player.person.fullName;
    const playerPosition = player.position.name;
    const playerBattingSummary = player.stats.batting.summary;
    const playerPitchingSummary = player.stats.pitching.summary;
    return <PlayerCard key={playerId} playerId={playerId} playerImg={playerImg} playerName={playerName} playerPosition={playerPosition} playerBattingSummary={playerBattingSummary} playerPitchingSummary={playerPitchingSummary}/>;
  });

  return (
    <>
      <h1>MLB Performance Tracker</h1>
      <div className="input-container">
        <TeamSelector handleTeamSelect={handleTeamSelect} currTeam={currTeam}/>
        <DateSelector handleDateSelect={handleDateSelect} currDate={currDate}/>        
      </div>
      {currPlayerElements}
      {(!isLoading && currPlayers.length === 0)? <p>The {currTeam} have not played on {currDate}. Please select another team/date or check back later.</p> : null}
    </>
  );
}

export default App
