function DateSelector({ handleDateSelect, todaysDate }) {
    return (
        <input type="date" value={todaysDate} onChange={e => handleDateSelect(e.target.value)}/>
    );
}

export default DateSelector