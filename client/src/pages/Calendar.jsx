import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PageHeader from '../components/PageHeader';

import CustomToolbar from '../components/CustomToolbar';
import { useData } from '../context/DataContext';

const localizer = momentLocalizer(moment);

import MaintenanceModal from '../components/MaintenanceModal';

const Calendar = () => {
  const { maintenanceRequests, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const events = useMemo(() => {
    return maintenanceRequests.map(req => {
      const start = req.scheduledDate ? new Date(req.scheduledDate) : new Date();
      const end = req.scheduledDate ? moment(req.scheduledDate).add(1, 'hours').toDate() : moment(start).add(1, 'hours').toDate();
      return {
        id: req._id,
        title: req.subject,
        start,
        end,
        resourceId: req.equipment?._id,
        originalRequest: req // Pass full object for editing
      };
    });
  }, [maintenanceRequests]);

  const [date, setDate] = useState(new Date(2025, 11, 14));
  const [view, setView] = useState('week');

  const onNavigate = (newDate) => {
    setDate(newDate);
  };

  const onView = (newView) => {
    setView(newView);
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedRequest(null); // Clear edit mode
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
      console.log('Selected Event Clicked:', event);
      // Look up independent of the event object to ensure we have the full, fresh data
      const fullRequest = maintenanceRequests.find(req => req._id === event.id);
      console.log('Found Full Request:', fullRequest);
      
      if (fullRequest) {
        setSelectedRequest(fullRequest);
        setIsModalOpen(true);
      } else {
        console.error('Could not find original request for event:', event);
      }
  };

  const handleRefresh = () => {
    refreshData();
  };

  const { components } = useMemo(() => ({
    components: {
      toolbar: CustomToolbar,
    },
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
      <MaintenanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={handleRefresh}
        initialDate={selectedDate}
        requestToEdit={selectedRequest}
      />
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
          view={view}
          date={date}
          onNavigate={onNavigate}
          onView={onView}
          eventPropGetter={eventStyleGetter}
          components={components}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          scrollToTime={new Date(1970, 1, 1, 8)} // Scroll to 8 AM
        />
      </div>
    </div>
  );
};

export default Calendar;
