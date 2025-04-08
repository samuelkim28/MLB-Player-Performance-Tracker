function GameNumberSelector({ handleGameNumberSelect, currGameNumber }) {
    return (
        <>
            <label htmlFor="game-number-select"></label>
            <select value={currGameNumber} name="teams" id="game-number-select" onChange={e => handleGameNumberSelect(e.target.value)}>                
                <option value={1}>Game 1</option>
                <option value={2}>Game 2</option>
            </select>
        </>
    )
}

export default GameNumberSelector