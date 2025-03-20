function DateSelector({ handleDateSelect, currDate }) {
    return (
        <input type="date" value={currDate} onChange={e => handleDateSelect(e.target.value)}/>
    );
}

export default DateSelector