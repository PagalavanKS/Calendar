import { useState } from 'react';
import './cal.css';

const CalenderWeb = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [eventText, setEventText] = useState('');
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrev = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const now = new Date();
    if (clickedDate >= new Date(now.setHours(0, 0, 0, 0))) {
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
      setEditIndex(null);
      setEventText('');
      setHours('');
      setMinutes('');
    }
  };

  const handleSubmitEvent = () => {
    if (!eventText.trim()) {
      alert('Please enter event text.');
      return;
    }
    const eventTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    const newEvent = {
      date: selectedDate.toDateString(),
      time: eventTime,
      text: eventText,
      color: getRandomColor(),
    };

    if (editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = newEvent;
      setEvents(updatedEvents);
    } else {
      setEvents([...events, newEvent]);
    }

    setShowEventPopup(false);
  };

  const getRandomColor = () => {
    const colors = ['#00a3ff', '#ef9011', '#4caf50', '#e91e63', '#9c27b0'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderDays = () => {
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      const dateObj = new Date(currentYear, currentMonth, i);
      const dateString = dateObj.toDateString();
      const dayEvents = events.filter((event) => event.date === dateString);

      const style = i === 1 ? { gridColumnStart: firstDayOfMonth + 1 } : {};

      daysArray.push(
        <div
          key={i}
          className={`calendar-day ${isToday ? 'current-day' : ''}`}
          onClick={() => handleDayClick(i)}
          style={style}
        >
          <div className="date-number">{i}</div>
          <div className="cell-events">
            {dayEvents.map((event, index) => (
              <div className="cell-event" key={index} style={{ backgroundColor: event.color }}>
                <span className="event-time">{event.time}</span>
                <span className="event-text">{event.text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="calendar-web">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <div className="navigation">
          <button onClick={handlePrev}>❮</button>
          <span>{monthOfYear[currentMonth]} {currentYear}</span>
          <button onClick={handleNext}>❯</button>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div className="weekday" key={day}>{day}</div>
        ))}
        {renderDays()}
      </div>

      {showEventPopup && (
        <div className="event-popup">
          <div className="time-input">
            <input
              type="number"
              name="hours"
              min={0}
              max={23}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="HH"
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="MM"
            />
          </div>
          <textarea
            placeholder="Enter Event Text"
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            maxLength={60}
          />
          <button onClick={handleSubmitEvent}>
            {editIndex !== null ? 'Update' : 'Add'} Event
          </button>
          <button onClick={() => setShowEventPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CalenderWeb;
