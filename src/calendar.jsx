import { useState } from 'react';
import { motion } from 'motion/react';

//function for formating date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Calendar({
  selectedDate,
  setSelectedDate,
  showCalendar,
  setShowCalendar,
  allTodos,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCalendarDays = (month, year) => {
    const calendarDays = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - startingDayOfWeek);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendarDays.push(date);
    }

    return calendarDays;
  };

  const calendarDays = getCalendarDays(currentMonth, currentYear);

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear(currentYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear(currentYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(formatDate(date));
    setShowCalendar(false);
  };

  return (
    <div
      className={`${
        showCalendar
          ? 'fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40'
          : 'hidden'
      } sm:block relative w-full max-w-sm`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 150, damping: 10 }}
        className="bg-[#ffeda8] p-4 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-2xl text-[#003631] font-bold"
            aria-label="Previous Month"
          >
            &lt;
          </button>
          <h2 className="text-xl font-bold font-[docade] text-[#003631]">
            {new Date(currentYear, currentMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="text-2xl text-[#003631] font-bold"
            aria-label="Next Month"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-[#003631] font-bold font-[bright]">
              {day}
            </div>
          ))}
          {calendarDays.map((date, index) => {
            const formattedDate = formatDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth;

//checking if there is any todo for that particular date
            const todosForDate = allTodos[formattedDate];
            const hasTodos = todosForDate && todosForDate.length > 0;

            const isSelected = formattedDate === selectedDate;

//agr todo complete hae
            const isAllCompleted = hasTodos
              ? todosForDate.every((todo) => todo.completed)
              : false;

            return (
              <div
                key={formattedDate}
                className={`p-1 rounded-full cursor-pointer transition-colors duration-200 relative ${
                  isCurrentMonth ? 'text-[#003631]' : 'text-gray-400 opacity-60'
                } ${isSelected ? 'bg-[#003631] text-[#ffeda8]' : 'hover:bg-gray-200'}`}
                onClick={() => handleDateClick(date)}
              >
                {date.getDate()}



                {hasTodos && (
                  <span
                    className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${
                      isSelected
                        ? 'bg-[#ffeda8]'
                        : isAllCompleted
                        ? 'bg-green-500' 
                        : 'bg-red-500' 
                    }`}
                  ></span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default Calendar;