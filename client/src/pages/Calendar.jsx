import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PageHeader from '../components/PageHeader';

import CustomToolbar from '../components/CustomToolbar';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Maintenance: Drill 1',
      start: new Date(2025, 11, 18, 10, 0), // Dec 18, 2025 10:00 AM
      end: new Date(2025, 11, 18, 12, 0),
      resourceId: 1,
    },
    {
      id: 2,
      title: 'Repair: Assembly Line',
      start: new Date(2025, 11, 19, 14, 0),
      end: new Date(2025, 11, 19, 16, 30),
      resourceId: 2,
    },
  ]);

  const { components, defaultDate, views } = useMemo(() => ({
    components: {
      toolbar: CustomToolbar,
    },
    defaultDate: new Date(2025, 11, 14),
    views: ['month', 'week', 'day'],
  }), []);

  // Custom styling for calendar events to match Neo-Brutalist theme
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #000000',
      borderRadius: '0px',
      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
      fontWeight: 'bold',
      fontSize: '0.85rem',
    };
    return { style };
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="Maintenance Calendar" 
      />
      
      <div className="flex-1 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <style>{`
          .rbc-calendar {
            font-family: 'Inter', sans-serif;
          }
          .rbc-header {
            padding: 12px;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 2px solid #000000;
            background-color: #f8f9fa;
          }
          .rbc-time-header-content {
            border-left: 2px solid #000000;
          }
          .rbc-time-content {
            border-top: 2px solid #000000;
          }
          .rbc-time-view {
            border: none;
          }
          .rbc-timeslot-group {
            border-bottom: 1px solid #e9ecef;
          }
          .rbc-day-slot .rbc-time-slot {
            border-top: 1px solid #f1f3f5;
          }
          .rbc-current-time-indicator {
            background-color: #000000;
            height: 2px;
          }
          .rbc-today {
            background-color: #f8f9fa;
          }
          .rbc-event {
            border-radius: 0;
          }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 250px)' }}
          defaultView="week"
          views={views}
          eventPropGetter={eventStyleGetter}
          defaultDate={defaultDate}
          components={components}
        />
      </div>
    </div>
  );
};

export default Calendar;
