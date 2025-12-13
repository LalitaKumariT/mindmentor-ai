import { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '12:00',
    description: ''
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const dateKey = selectedDate.toDateString();
    const event = {
      id: Date.now(),
      ...newEvent,
      date: selectedDate
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), event]
    }));

    setNewEvent({ title: '', time: '12:00', description: '' });
    setShowEventModal(false);
  };

  const deleteEvent = (date, eventId) => {
    const dateKey = new Date(date).toDateString();
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(event => event.id !== eventId) || []
    }));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const days = [];
      
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
          days.push(<div key={`empty-${i}-${j}`} className="h-12"></div>);
        } else {
          const currentDay = day;
          const dateKey = new Date(year, month, currentDay).toDateString();
          const dayEvents = events[dateKey] || [];
          const isSelected = selectedDate && 
            selectedDate.getDate() === currentDay && 
            selectedDate.getMonth() === month && 
            selectedDate.getFullYear() === year;
          
          days.push(
            <div 
              key={`day-${currentDay}`}
              onClick={() => handleDateClick(currentDay)}
              className={`h-12 p-1 border border-gray-700 cursor-pointer hover:bg-gray-800 ${isSelected ? 'bg-blue-900/30' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                  {currentDay}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="h-1 mt-1">
                {dayEvents.length > 0 && (
                  <div className="w-full h-1 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
          day++;
        }
      }
      
      weeks.push(
        <div key={`week-${i}`} className="grid grid-cols-7">
          {days}
        </div>
      );
      
      if (day > daysInMonth) break;
    }
    
    return weeks;
  };

  const selectedDateEvents = events[selectedDate.toDateString()] || [];

  return (
    <div className="dash-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-700 rounded"
          >
            &lt;
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-700 rounded"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-400 mb-1">
          {days.map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          {renderCalendar()}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
          <button 
            onClick={() => setShowEventModal(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            + Add Event
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">No events scheduled</p>
          ) : (
            selectedDateEvents.map(event => (
              <div key={event.id} className="bg-gray-800 p-2 rounded text-sm">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{event.title}</span>
                    <span className="text-gray-400 ml-2">{event.time}</span>
                  </div>
                  <button 
                    onClick={() => deleteEvent(event.date, event.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
                {event.description && (
                  <p className="text-gray-400 text-xs mt-1">{event.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    disabled
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-sm rounded border border-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
