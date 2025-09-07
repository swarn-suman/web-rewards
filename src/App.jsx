import { useState, useEffect, useRef } from 'react';
import Todo from './Todo';
import Calendar from './calendar';
import { motion, spring } from 'motion/react';

// Function to get today's date in YYYY-MM-DD format based on local time
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [findIndex, setFindIndex] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);

  // New states for calendar integration
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const [allTodos, setAllTodos] = useState(() => {
    const saved = localStorage.getItem('allTodos');
    return saved ? JSON.parse(saved) : {};
  });

  // Load todos from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('allTodos');
    if (saved) {
      setAllTodos(JSON.parse(saved));
    }
  }, []);

  // Save allTodos to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('allTodos', JSON.stringify(allTodos));
  }, [allTodos]);

  // Stopwatch state
  const [accumulatedTime, setAccumulatedTime] = useState(() => {
    const saved = localStorage.getItem('stopwatchAccumulatedTime');
    return saved ? parseInt(saved) : 0;
  });

  const [startTimestamp, setStartTimestamp] = useState(() => {
    const saved = localStorage.getItem('stopwatchStartTimestamp');
    return saved ? parseInt(saved) : null;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('stopwatchIsRunning');
    return saved === 'true';
  });

  const [breaks, setBreaks] = useState(() => {
    const savedBreaks = localStorage.getItem('stopwatchBreaks');
    return savedBreaks ? JSON.parse(savedBreaks) : [];
  });

  const [breakCount, setBreakCount] = useState(() => {
    const savedBreakCount = localStorage.getItem('stopwatchBreakCount');
    return savedBreakCount ? parseInt(savedBreakCount) : 0;
  });

  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef(null);

  const drawRandom = () => {
    const randomIndex = Math.floor(Math.random() * rewards.length);
    setFindIndex(randomIndex);
    setHasDrawn(true);
  };

  const reset = () => {
    setHasDrawn(false);
    setFindIndex(0);
  };

  // Stopwatch functions
  const startStopwatch = () => {
    if (!isRunning) {
      setStartTimestamp(Date.now());
      setIsRunning(true);
    }
  };

  const pauseStopwatch = () => {
    if (isRunning) {
      const now = Date.now();
      const elapsed =
        (startTimestamp ? now - startTimestamp : 0) + accumulatedTime;
      setAccumulatedTime(elapsed);
      setIsRunning(false);
      setStartTimestamp(null);
      // Add a new break with current time
      const newBreakCount = breakCount + 1;
      setBreakCount(newBreakCount);
      setBreaks((prevBreaks) => [
        ...prevBreaks,
        {
          id: newBreakCount,
          time: formatDurationPlain(elapsed),
          rawTime: elapsed,
        },
      ]);
    }
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setAccumulatedTime(0);
    setStartTimestamp(null);
    setDisplayTime(0);
    setBreaks([]);
    setBreakCount(0);
    // Clear localStorage when resetting
    localStorage.removeItem('stopwatchBreaks');
    localStorage.removeItem('stopwatchBreakCount');
    localStorage.removeItem('stopwatchAccumulatedTime');
    localStorage.removeItem('stopwatchStartTimestamp');
    localStorage.removeItem('stopwatchIsRunning');
  };

  // Format time to display as HH:MM:SS and milliseconds separately
  const formatTimeParts = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0'),
    };
  };

  // Format duration as hh:mm:ss.ms (for breaks and pause)
  const formatDurationPlain = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    // const milliseconds = Math.floor((ms % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}h:${minutes
      .toString()
      .padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  // Effect for stopwatch
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed =
          (startTimestamp ? now - startTimestamp : 0) + accumulatedTime;
        setDisplayTime(elapsed);
      }, 10);
    } else {
      setDisplayTime(accumulatedTime);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTimestamp, accumulatedTime]);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stopwatchBreaks', JSON.stringify(breaks));
  }, [breaks]);

  useEffect(() => {
    localStorage.setItem('stopwatchBreakCount', breakCount.toString());
  }, [breakCount]);

  useEffect(() => {
    localStorage.setItem('stopwatchAccumulatedTime', accumulatedTime.toString());
  }, [accumulatedTime]);

  useEffect(() => {
    if (startTimestamp !== null) {
      localStorage.setItem('stopwatchStartTimestamp', startTimestamp.toString());
    } else {
      localStorage.removeItem('stopwatchStartTimestamp');
    }
  }, [startTimestamp]);

  useEffect(() => {
    localStorage.setItem('stopwatchIsRunning', isRunning.toString());
  }, [isRunning]);

  const rewards = [
    'Do Nothing',
    'Watch Youtube',
    'Read Documentations',
    'Watch Movies',
    'Read News',
    'Read a Book',
    'Watch Anime',
    'Social Media',
    'Do Nothing',
    'Read a Book',
    'Watch Series',
    'Read Documentations',
    'Work on Fun Projects',
    'Do Nothing',
    'Work on Fun Projects',
  ];

  return (
    <>
      <div className="bg-[#003631] min-h-screen w-full flex flex-col items-center p-4 relative overflow-auto">
        {/* Header Section */}
        <div className="w-full max-w-lg text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-mono font-bold text-[#ffeda8] mb-6"
            style={{ fontFamily: 'docade' }}
          >
            Check Reward
          </h1>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, transition: { duration: 0.01 } }}
              whileTap={{ scale: 0.9 }}
              onClick={drawRandom}
              className="bg-[#ffeda8] text-[#003631] cursor-pointer font-semibold font-[docade] py-3 px-6 rounded-md shadow hover:bg-[#29504a] hover:text-[#ffeda8] transition"
            >
              Draw
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, transition: { duration: 0.01 } }}
              whileTap={{ scale: 0.9 }}
              onClick={reset}
              className="bg-[#29504a] text-[#ffeda8] font-semibold cursor-pointer font-[docade] py-3 px-6 rounded-md shadow hover:bg-[#ffeda8] hover:text-[#003631] transition"
            >
              Reset
            </motion.button>
          </div>
          {hasDrawn && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 8 }}
              className="bg-[#ffeda8] text-center p-6 rounded-lg mt-8 shadow-lg w-80 mx-auto h-[180px] flex justify-center flex-col"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#003631] font-[docade]">
                Your Reward
              </h2>
              <p className="text-2xl font-[bright] font-semibold text-gray-900 tracking-wide">
                {rewards[findIndex]}
              </p>
            </motion.div>
          )}
        </div>

        {/* Floating Calendar Button on mobile */}
        <div className="sm:hidden fixed bottom-4 left-4 z-30">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-[#ffeda8] text-[#003631] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open Calendar"
          >
            <span className="flex items-center justify-center w-full h-full">
              📅
            </span>
          </button>
        </div>

        {/* Calendar Card - top left */}
        <div className="absolute top-4 left-4 z-20">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            allTodos={allTodos}
          />
        </div>

        {/* Stopwatch Card - top right */}
        <div className="absolute top-4 right-4 bg-[#ffeda8] p-3 sm:p-4 rounded-lg shadow-lg w-[90%] max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-s z-10">
          <div className="text-xl sm:text-2xl font-[docade] mb-2 text-center">
            {(() => {
              const t = formatTimeParts(displayTime);
              return (
                <span>
                  {t.hours}h:{t.minutes}m:{t.seconds}s
                </span>
              );
            })()}
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 mb-3 justify-center">
            <button
              onClick={startStopwatch}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base cursor-pointer font-[docade] ${
                isRunning ? 'bg-gray-300' : 'bg-[#1e7637] text-white'
              }`}
              disabled={isRunning}
            >
              Start
            </button>
            <button
              onClick={pauseStopwatch}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base cursor-pointer font-[docade] ${
                !isRunning ? 'bg-gray-300' : 'bg-yellow-500 text-white'
              }`}
              disabled={!isRunning}
            >
              Pause
            </button>
            <button
              onClick={resetStopwatch}
              className="px-2 sm:px-3 py-1 font-[docade] rounded text-sm sm:text-base bg-red-500 text-white cursor-pointer"
            >
              Reset
            </button>
          </div>
          {/* Break history - responsive */}
          {breaks.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <h3 className="text-2xl sm:text-md font-semibold mb-1 font-[bright]">
                Breaks:
              </h3>
              <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                {breaks.map((breakItem, idx) => {
                  let duration = breakItem.rawTime;
                  if (idx > 0) {
                    duration = breakItem.rawTime - breaks[idx - 1].rawTime;
                  }
                  const formatDuration = (ms) => {
                    const hours = Math.floor(ms / 3600000);
                    const minutes = Math.floor((ms % 3600000) / 60000);
                    const seconds = Math.floor((ms % 60000) / 1000);
                    const milliseconds = Math.floor((ms % 1000) / 10);
                    return (
                      `${hours.toString().padStart(2, '0')}:${minutes
                        .toString()
                        .padStart(2, '0')}:${seconds
                        .toString()
                        .padStart(2, '0')}.` +
                      `<span class="text-xs align-top ml-1">${milliseconds
                        .toString()
                        .padStart(2, '0')}</span>`
                    );
                  };
                  return (
                    <div
                      key={breakItem.id}
                      className="font-[bright] sm:text-md mb-1 flex flex-wrap sm:flex-nowrap"
                    >
                      <span className="text-lg font-[bright]">
                        Break {breakItem.id}:
                      </span>
                      <span className="ml-1 text-lg">
                        {formatDurationPlain(breakItem.rawTime)}
                      </span>
                      <span className="ml-2 text-lg text-gray-500">
                        (Session: {formatDurationPlain(duration)})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Todo Card is not absolutely positioned to remain in the flow */}
        <div className="mt-48 relative w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Todo
            selectedDate={selectedDate}
            allTodos={allTodos}
            setAllTodos={setAllTodos}
          />
        </div>
      </div>
    </>
  );
}

export default App;