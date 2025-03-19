function DateSelector({ handleDateSelect }) {
    return (
        <input type="date" onChange={e => handleDateSelect(e.target.value)}/>
    );
}

export default DateSelector