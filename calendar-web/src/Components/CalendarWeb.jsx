import { useState } from 'react';
import React from 'react';
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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
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
    setEventText('');
    setHours('');
    setMinutes('');
  };

  const handleEdit = (index) => {
    const event = events[index];
    const [h, m] = event.time.split(':');
    setSelectedDate(new Date(event.date));
    setEventText(event.text);
    setHours(h);
    setMinutes(m);
    setEditIndex(index);
    setShowEventPopup(true);
  };

  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
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

      const style = i === 1 ? { gridColumnStart: firstDayOfMonth + 1 } : {};

      daysArray.push(
        <span
          key={i}
          className={isToday ? 'current-day' : ''}
          onClick={() => handleDayClick(i)}
          style={style}
        >
          {i}
        </span>
      );
    }
    return daysArray;
  };

  return (
    <div className={`calendar-web ${showEventPopup ? 'popup-open' : ''}`}>
      <div className="calendar">
        <h1 className="heading">Calendar</h1>
        <div className="navigate-date">
          <h2 className="month">{monthOfYear[currentMonth]},</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={handlePrev}></i>
            <i className="bx bx-chevron-right" onClick={handleNext}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">{renderDays()}</div>
      </div>

      {showEventPopup && (
        <div className="event-popup">
          <div className="time-input">
            <div className="event-popup-time">Time</div>
            <input
              type="number"
              name="hours"
              min={0}
              max={23}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="hours"
              placeholder="HH"
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="minutes"
              placeholder="MM"
            />
          </div>
          <textarea
            placeholder="Enter Event Text (Max 60 char)"
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            maxLength={60}
          />
          <button className="event-popup-btn" onClick={handleSubmitEvent}>
            {editIndex !== null ? 'Update Event' : 'Add Event'}
          </button>
          <button className="close-event-popup" onClick={() => setShowEventPopup(false)}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      <div className="events">
        {events.map((event, index) => (
          <div className="event" key={index} style={{ backgroundColor: event.color }}>
            <div className="event-date-wrapper">
              <div className="event-date">{event.date}</div>
              <div className="event-time">{event.time}</div>
            </div>
            <div className="event-text">
              <div
                className="event-line"
                style={{
                  width: '5px',
                  height: '100%',
                  backgroundColor: 'white',
                  marginRight: '1rem',
                  display: 'inline-block',
                }}
              />
              {event.text}
            </div>
            <div className="event-buttons">
              <i className="bx bxs-edit-alt" onClick={() => handleEdit(index)}></i>
              <i className="bx bxs-message-alt-x" onClick={() => handleDelete(index)}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalenderWeb;