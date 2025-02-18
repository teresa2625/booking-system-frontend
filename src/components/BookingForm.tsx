import React, { useEffect } from "react";
import axios from "axios";
import { BookedSlots, Booking } from "../types/booking";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { PickersActionBarProps } from "@mui/x-date-pickers/PickersActionBar";
import useId from "@mui/material/utils/useId";

const BookingForm: React.FC = () => {
  const url = "http://localhost:5000/bookings";
  const [selectedDateTime, setSelectedDateTime] = React.useState<Dayjs | null>(
    null,
  );
  const [bookedSlots, setBookedSlots] = React.useState<BookedSlots[]>([]);
  const [bookingDateTime, setBookingDateTime] = React.useState<Dayjs | null>(
    null,
  );
  const [fullName, setFullName] = React.useState<string>("");
  const [contactEmail, setContactEmail] = React.useState<string>("");
  const [phoneNum, setPhoneNum] = React.useState<string>("");

  function CustomAction(props: PickersActionBarProps) {
    const { onAccept, onClear, className } = props;
    const id = useId();
    return (
      <DialogActions className={className}>
        <Button
          id={`picker-actions-${id}`}
          aria-haspopup="true"
          onClick={() => {
            onClear();
          }}
        >
          Clear
        </Button>
        <Button
          id={`picker-actions-${id}`}
          aria-haspopup="true"
          onClick={() => {
            handleChange(
              fullName,
              phoneNum,
              contactEmail,
              bookingDateTime?.year() ? bookingDateTime?.year().toString() : "",
              bookingDateTime?.month()
                ? (bookingDateTime?.month() + 1).toString()
                : "",
              bookingDateTime?.date() ? bookingDateTime?.date().toString() : "",
              bookingDateTime?.hour() ? bookingDateTime?.hour().toString() : "",
              bookingDateTime?.minute().toString()
                ? bookingDateTime?.minute().toString()
                : "",
            );
            onAccept();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    );
  }

  const handleChange = (
    fullName: string,
    phone: string,
    email: string,
    year: string,
    month: string,
    date: string,
    hour: string,
    min: string,
  ) => {
    const bookingFormat = {
      name: fullName,
      phone: phone,
      email: email,
      date: year + " " + month + " " + date,
      time: hour + ":" + (min === "0" ? "00" : min),
      status: "Pending",
    };
    handleSubmit(bookingFormat);
  };
  const handleSubmit = async (data: Booking) => {
    console.log("Booking data submitted:", data);

    try {
      const response = await axios.post("http://localhost:5000/bookings", data);
      console.log("Booking successful:", response);
    } catch (err) {
      console.log("Booking failed:", err);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(url);
        console.log("response", response.data);
        if (response.status !== 200) {
          throw new Error("Failed to fetch bookings");
        }
        const bookings: any[] = await response.data;
        const BookedData = bookings.map((booking) => {
          const bookingDate = booking.booking_date.split("T")[0];
          return {
            date: bookingDate,
            time: booking.booking_time,
          };
        });
        console.log(BookedData);
        setBookedSlots(BookedData);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchBookings();
  }, []);

  const isSlotBooked = (date: Dayjs, time: Dayjs) => {
    return bookedSlots.some(
      (slot) =>
        slot.date === date.format("YYYY-MM-DD") &&
        slot.time === time.format("HH:mm"),
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["StaticDateTimePicker"]} sx={{ mb: "64px" }}>
        <Box
          sx={{
            fontSize: "2rem",
          }}
        >
          Book Your Reservation
        </Box>
        <Stack direction="row" gap={1}>
          <Typography>{"Home >"}</Typography>
          <Typography>{"Book Appointment"}</Typography>
        </Stack>
        <TextField
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          sx={{
            width: "100%",
            backgroundColor: "primary.light",
            "& label.Mui-focused": {
              color: "#776B5D",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#776B5D",
              },
            },
          }}
          onChange={(event) => {
            setFullName(event.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(event) => {
            setContactEmail(event.target.value);
          }}
          sx={{
            width: "100%",
            backgroundColor: "primary.light",
            "& label.Mui-focused": {
              color: "#776B5D",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#776B5D",
              },
            },
          }}
        />
        <TextField
          id="outlined-basic"
          label="Phone number"
          variant="outlined"
          onChange={(event) => {
            setPhoneNum(event.target.value);
          }}
          sx={{
            width: "100%",
            backgroundColor: "primary.light",
            "& label.Mui-focused": {
              color: "#776B5D",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#776B5D",
              },
            },
          }}
        />
        <StaticDateTimePicker
          views={["year", "month", "day", "hours", "minutes"]}
          defaultValue={dayjs()}
          disablePast
          shouldDisableTime={(time, view) => {
            return bookedSlots.some((slot) => {
              if (
                time.isSame(slot.date, "year") &&
                time.isSame(slot.date, "month") &&
                time.isSame(slot.date, "date") &&
                time.isSame(slot.date + slot.time, "hour") &&
                time.isSame(slot.date + slot.time, "minute")
              ) {
                return true;
              } else {
                return false;
              }
            });
          }}
          minutesStep={30}
          ampmInClock
          onChange={(newValue, context) => {
            if (context.validationError == null) {
              setBookingDateTime(newValue);
            }
          }}
          slots={{ actionBar: CustomAction }}
          slotProps={{
            actionBar: {
              actions: ["clear", "today"],
            },
          }}
          sx={{
            ".MuiDateCalendar-root": {
              width: "inherit",
              maxHeight: "none",
              gap: "10px",
            },
            ".MuiPickersCalendarHeader-root": {
              width: "inherit",
              maxHeight: "none",
            },
            ".MuiPickersLayout-root": { gap: "50px" },
            ".MuiMonthCalendar-root": { width: "inherit" },
            ".MuiYearCalendar-root": { width: "inherit" },
            ".MuiDayCalendar-weekDayLabel": {
              gap: "50px",
              fontSize: "1.1rem",
            },
            ".MuiDayCalendar-header": { gap: "50px" },
            ".MuiDayCalendar-weekContainer": {
              width: "inherit",
              gap: "50px",
            },
            ".MuiPickersDay-root": {
              fontSize: "1.1rem",
            },
            ".MuiPickersCalendarHeader-label": {
              fontSize: "1.3rem",
            },
            ".Mui-selected": {
              "&:hover": { bgcolor: "primary.dark", color: "primary.light" },
            },
            ".MuiClock-pmButton": {
              width: "36px",
              height: "36px",
              ".MuiTypography-root": {
                fontSize: "1rem",
              },
            },
            ".MuiClock-amButton": {
              width: "36px",
              height: "36px",
              ".MuiTypography-root": {
                fontSize: "1rem",
              },
            },
            ".MuiClockNumber-root": {
              fontSize: "1.1rem",
            },
            ".MuiDialogActions-root": {
              ".MuiButtonBase-root": {
                bgcolor: "primary.dark",
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BookingForm;
