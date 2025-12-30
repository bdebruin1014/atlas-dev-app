import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings, Printer, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedCalendars, setSelectedCalendars] = useState(['my-calendar', 'subscribed', 'all-appointments']);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get days for mini calendar
  const getMiniCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startingDay = firstDay.getDay() - 1;
    if (startingDay < 0) startingDay = 6;
    
    const days = [];
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  // Get weeks for main calendar (Mon-Fri view)
  const getCalendarWeeks = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const weeks = [];
    let currentWeek = [];
    
    // Find first Monday
    let day = new Date(firstDay);
    while (day.getDay() !== 1) {
      day.setDate(day.getDate() - 1);
    }
    
    // Generate 6 weeks
    for (let w = 0; w < 6; w++) {
      currentWeek = [];
      for (let d = 0; d < 5; d++) { // Mon-Fri only
        currentWeek.push({
          date: new Date(day),
          day: day.getDate(),
          month: day.getMonth(),
          isCurrentMonth: day.getMonth() === month
        });
        day.setDate(day.getDate() + 1);
      }
      // Skip weekend
      day.setDate(day.getDate() + 2);
      weeks.push(currentWeek);
    }
    return weeks;
  };

  const events = [
    { date: '2025-12-01', time: '10 AM', title: 'Joint Closing for 1227 Mountain Sum...' },
    { date: '2025-12-01', time: '11 AM', title: 'Joint Closing for 256 Sweetwater Road' },
    { date: '2025-12-01', time: '1 PM', title: "Seller's Closing for 700 Birnie Street" },
    { date: '2025-12-05', time: '11 AM', title: 'Joint Closing for 105 Mauldin Circle' },
    { date: '2025-12-15', time: '1 PM', title: "Seller's Closing for 124 Golf Lane" },
    { date: '2025-12-17', time: '3 PM', title: 'Joint Closing for 732 Streamside Drive' },
    { date: '2025-12-18', time: '3 PM', title: 'Joint Closing for 38 Gentry Street' },
    { date: '2025-12-19', time: '11 AM', title: 'Joint Closing for 201 Virginia Avenue' },
    { date: '2025-12-19', time: '1 PM', title: 'Joint Closing for 00 Whiteford Road' },
    { date: '2025-12-19', time: '1:30 PM', title: 'Joint Closing for 00 Whiteford Rd' },
    { date: '2025-12-23', time: '3 PM', title: "Borrower's Closing for 200 East Walnu..." },
    { date: '2025-12-29', time: '11 AM', title: 'Joint Closing for 4 Stage Court' },
    { date: '2025-12-30', time: '12 PM', title: 'Joint Closing for 6 Goodrich St' },
  ];

  const getEventsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const calendars = [
    { id: 'my-calendar', label: 'My Calendar', color: 'bg-red-500' },
    { id: 'subscribed', label: 'Subscribed Projects', color: 'bg-green-500' },
    { id: 'company', label: 'VanRock Holdings Calendar', color: 'bg-purple-500' },
    { id: 'all-appointments', label: 'All Appointments', color: 'bg-yellow-500' },
  ];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const miniDays = getMiniCalendarDays(currentDate);
  const weeks = getCalendarWeeks(currentDate);
  const today = new Date();

  return (
    <div className="flex h-[calc(100vh-40px)] bg-white">
      {/* Left Sidebar - Dark Theme */}
      <div className="w-56 bg-[#1e2a3a] flex-shrink-0 flex flex-col">
        {/* Timezone */}
        <div className="px-3 py-2 text-xs text-gray-400 flex items-center justify-between border-b border-gray-700">
          <span>Mountain Time (Denver)</span>
          <button className="text-[#047857] hover:underline text-xs">Change</button>
        </div>

        {/* Mini Calendar */}
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-0.5 text-gray-400 hover:text-white">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={nextMonth} className="p-0.5 text-gray-400 hover:text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {shortDayNames.map(d => (
              <div key={d} className="text-[10px] text-gray-500 py-0.5">{d.charAt(0)}</div>
            ))}
            {miniDays.map((day, i) => {
              const isToday = day.currentMonth && day.day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
              return (
                <button
                  key={i}
                  className={`text-[10px] py-0.5 rounded ${
                    isToday 
                      ? 'bg-[#047857] text-white' 
                      : day.currentMonth 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-600'
                  }`}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Calendar */}
        <div className="px-3 py-2 border-b border-gray-700">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Calendar...
          </button>
        </div>

        {/* Calendars List */}
        <div className="flex-1 p-3">
          <h3 className="text-gray-400 text-xs font-medium mb-2">Calendars</h3>
          <div className="space-y-1">
            {calendars.map(cal => (
              <label key={cal.id} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedCalendars.includes(cal.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCalendars([...selectedCalendars, cal.id]);
                    } else {
                      setSelectedCalendars(selectedCalendars.filter(c => c !== cal.id));
                    }
                  }}
                  className="w-3 h-3 rounded border-gray-600 text-[#047857] focus:ring-0"
                />
                <span className={`w-2 h-2 rounded-full ${cal.color}`}></span>
                {cal.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded border border-gray-200">
              Today
            </button>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h1 className="text-lg font-medium text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
            
            <select className="h-8 text-xs border border-gray-200 rounded px-2 text-gray-600">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
            
            <Button className="bg-[#047857] hover:bg-[#065f46] text-white text-xs h-8">
              Create Appointment
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Day Headers */}
          <div className="grid grid-cols-5 border-b border-gray-200 flex-shrink-0">
            {dayNames.map((day) => (
              <div key={day} className="px-2 py-2 text-center text-xs font-medium text-gray-500 border-r border-gray-100 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Weeks */}
          <div className="flex-1 grid grid-rows-6">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-5 border-b border-gray-100 last:border-b-0">
                {week.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = day.date.toDateString() === today.toDateString();
                  const monthLabel = day.day === 1 ? monthNames[day.month].substring(0, 3) + ' ' : '';
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`border-r border-gray-100 last:border-r-0 p-1 overflow-hidden flex flex-col ${
                        !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <span className={`text-xs mb-0.5 ${
                        !day.isCurrentMonth ? 'text-gray-400' : 
                        isToday ? 'text-white bg-[#047857] rounded-full w-5 h-5 flex items-center justify-center text-[10px]' : 'text-gray-700'
                      }`}>
                        {monthLabel}{day.day}
                      </span>
                      <div className="flex-1 space-y-0.5 overflow-hidden">
                        {dayEvents.map((event, i) => (
                          <div
                            key={i}
                            className="text-[10px] leading-tight cursor-pointer hover:opacity-80 flex items-start gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-0.5 flex-shrink-0"></span>
                            <span className="text-gray-700 truncate">
                              <span className="text-gray-500">{event.time}</span> {event.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
