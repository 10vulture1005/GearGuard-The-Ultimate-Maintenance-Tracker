import React from 'react';
import moment from 'moment';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToMonth = () => {
    toolbar.onView('month');
  };

  const goToWeek = () => {
    toolbar.onView('week');
  };

  const goToDay = () => {
    toolbar.onView('day');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-xl font-black uppercase tracking-tight">
        {toolbar.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-2 bg-white rounded-xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToCurrent}
          className="rounded-lg border-2 border-black bg-gray-200 px-4 py-1 font-bold text-black transition-all hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Today
        </button>
        <button
          type="button"
          onClick={goToBack}
          className="rounded-lg border-2 border-black bg-white px-4 py-1 font-bold text-black transition-all hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="rounded-lg border-2 border-black bg-white px-4 py-1 font-bold text-black transition-all hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Next
        </button>
      </div>

      <div className="text-center">
        <span className="text-xl font-black uppercase tracking-tight">
            {toolbar.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToMonth}
          className={`rounded-lg border-2 border-black px-4 py-1 font-bold transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            toolbar.view === 'month' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Month
        </button>
        <button
          type="button"
          onClick={goToWeek}
          className={`rounded-lg border-2 border-black px-4 py-1 font-bold transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            toolbar.view === 'week' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Week
        </button>
        <button
          type="button"
          onClick={goToDay}
          className={`rounded-lg border-2 border-black px-4 py-1 font-bold transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            toolbar.view === 'day' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
