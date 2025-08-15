import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import axios from "axios";
import NotesDialog from "./NotesDialog";

export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button,
  .fc-button.fc-next-button,
  .fc-button.fc-button-primary,
  .fc-button.fc-button-primary:not(:disabled) {
    background: #776B5D;
    border: #776B5D;
    box-shadow: none !important;
  }
  .fc-button-primary:not(:disabled).fc-button-active:focus,
  .fc-button-primary:not(:disabled).fc-button-active,
  .fc-button-primary:not(:disabled):active:focus,
  .fc-button-primary:not(:disabled):hover {
    background: #776B5D;
    opacity: .65;
}
  }
`;
interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  id: string;
}

const DoctorDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  let doctorName = "";
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      doctorName = decodedToken.userName;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.log("No token found in localStorage.");
  }

  const url = "http://localhost:5000/bookings";
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [noteInfo, setNoteInfo] = useState<any>();
  const [takeNotes, setTakeNotes] = useState(false);
  const handleOpen = () => setTakeNotes(true);
  const handleClose = () => setTakeNotes(false);

  useEffect(() => {
    if (!doctorName) return;
    const fetchBookings = async () => {
      try {
        console.log("doctor", doctorName);
        const response = await axios.get(url, {
          params: { doctor: doctorName },
        });
        console.log("response", response.data);
        if (response.status !== 200) {
          throw new Error("Failed to fetch bookings");
        }
        const bookings: any[] = await response.data;
        const calendarEvents = bookings.map((booking) => {
          const bookingDate = booking.booking_date.split("T")[0];

          const start = `${bookingDate} ${booking.booking_time}`;

          const [hours, minutes, seconds] = booking.booking_time
            .split(":")
            .map(Number);
          const endHours = hours;
          const endMinutes = minutes + 30;

          const adjustedHours = endMinutes >= 60 ? endHours + 1 : endHours;
          const adjustedMinutes =
            endMinutes >= 60 ? endMinutes - 60 : endMinutes;

          const end = `${bookingDate} ${String(adjustedHours).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

          return {
            title: booking.customer_name,
            start,
            end,
            id: booking.id,
          };
        });
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [doctorName]);

  return (
    <>
      <StyleWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventColor="#776B5D"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          editable={false}
          eventClick={(info) => {
            handleOpen();
            setNoteInfo(info.event);
          }}
        />
      </StyleWrapper>
      <NotesDialog
        open={takeNotes}
        handleClose={handleClose}
        info={noteInfo}
      ></NotesDialog>
    </>
  );
};

export default DoctorDashboard;
