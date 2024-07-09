import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style.scss";

const KabanBoard = () => {
  const tradesData = []; // Your trades data
  const [events, setEvents] = useState([]);

  

  const handleDateClick = (arg) => {
    // Handle date click logic
  };

  return (
    <div className="kaban_wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        selectable={true}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        height={"auto"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridYear",
        }}
      />
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div className="event_wrapper">
      <b>{eventInfo.event.title}</b>
      <div className={eventInfo.event.extendedProps.type}>
        {eventInfo.event.extendedProps.trade}
      </div>
    </div>
  );
};

export default KabanBoard;
