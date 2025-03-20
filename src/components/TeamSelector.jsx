function TeamSelector({ handleTeamSelect, currTeam }) {
    return (
        <>
            <label htmlFor="team-select"></label>
            <select value={currTeam} name="teams" id="team-select" onChange={e => handleTeamSelect(e.target.value)}>
                <hr />
                <optgroup label="AL East">
                    <option value="Baltimore Orioles">Baltimore Orioles</option>
                    <option value="Boston Red Sox">Boston Red Sox</option>
                    <option value="New York Yankees">New York Yankees</option>
                    <option value="Tampa Bay Rays">Tampa Bay Rays</option>
                    <option value="Toronto Blue Jays">Toronto Blue Jays</option>
                </optgroup>
                <hr />
                <optgroup label="AL Central">
                    <option value="Chicago White Sox">Chicago White Sox</option>
                    <option value="Cleveland Guardians">Cleveland Guardians</option>
                    <option value="Detroit Tigers">Detroit Tigers</option>
                    <option value="Kansas City Royals">Kansas City Royals</option>
                    <option value="Minnesota Twins">Minnesota Twins</option>
                </optgroup>
                <hr />
                <optgroup label="AL West">
                    <option value="Houston Astros">Houston Astros</option>
                    <option value="Los Angeles Angels">Los Angeles Angels</option>
                    <option value="Athletics">Oakland Athletics</option>
                    <option value="Seattle Mariners">Seattle Mariners</option>
                    <option value="Texas Rangers">Texas Rangers</option>
                </optgroup>
                <hr />
                <optgroup label="NL East">
                    <option value="Atlanta Braves">Atlanta Braves</option>
                    <option value="Miami Marlins">Miami Marlins</option>
                    <option value="New York Mets">New York Mets</option>
                    <option value="Philadelphia Phillies">Philadelphia Phillies</option>
                    <option value="Washington Nationals">Washington Nationals</option>
                </optgroup>
                <hr />
                <optgroup label="NL Central">
                    <option value="Chicago Cubs">Chicago Cubs</option>
                    <option value="Cincinnati Reds">Cincinnati Reds</option>
                    <option value="Milwaukee Brewers">Milwaukee Brewers</option>
                    <option value="Pittsburgh Pirates">Pittsburgh Pirates</option>
                    <option value="St. Louis Cardinals">St. Louis Cardinals</option>
                </optgroup>
                <hr />
                <optgroup label="NL West">
                    <option value="Colorado Rockies">Colorado Rockies</option>
                    <option value="Arizona Diamondbacks">Arizona Diamondbacks</option>
                    <option value="Los Angeles Dodgers">Los Angeles Dodgers</option>
                    <option value="San Diego Padres">San Diego Padres</option>
                    <option value="San Francisco Giants">San Francisco Giants</option>
                </optgroup>
            </select>
        </>
    )
}

export default TeamSelector