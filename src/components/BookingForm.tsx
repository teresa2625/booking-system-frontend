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
import { useId } from "react";
import { usePickerContext } from "@mui/x-date-pickers/hooks";
import Chip from "@mui/material/Chip";
import { DateViewRendererProps } from "@mui/x-date-pickers";
import { DateOrTimeViewWithMeridiem } from "@mui/x-date-pickers/internals";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// TODO: clean up, validation, pre submit check, first name last name, remove submit from date, isReturn, remove email

const BookingForm: React.FC = () => {
  const url = "http://localhost:5000/bookings";
  const [bookedSlots, setBookedSlots] = React.useState<BookedSlots[]>([]);
  const [bookingDateTime, setBookingDateTime] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [currentView, setCurrentView] =
    React.useState<DateOrTimeViewWithMeridiem>("day");
  const [fullName, setFullName] = React.useState<string>("");
  const [contactEmail, setContactEmail] = React.useState<string>("");
  const [phoneNum, setPhoneNum] = React.useState<string>("");
  const [doctor, setDoctor] = React.useState<string>("");

  function CustomAction(props: PickersActionBarProps) {
    const { className } = props;
    const id = useId();
    const { clearValue, acceptValueChanges } = usePickerContext();
    return (
      <DialogActions className={className}>
        <Button
          id={`picker-actions-${id}`}
          aria-haspopup="true"
          onClick={() => {
            setBookingDateTime(null); // reset your controlled value
            clearValue?.(); // still call MUI’s internal clear just in case
          }}
        >
          Clear
        </Button>
        <Button
          id={`picker-actions-${id}`}
          aria-haspopup="true"
          disabled={!doctor}
          onClick={() => {
            handleChange(
              fullName,
              phoneNum,
              contactEmail,
              doctor,
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
            acceptValueChanges();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    );
  }

  const TimeChipsRenderer = ({
    value,
    onChange,
  }: DateViewRendererProps<"hours">) => {
    const times = React.useMemo(() => {
      const baseDate = value ?? dayjs();
      const start = baseDate.hour(8).minute(0).second(0);
      const end = baseDate.hour(18).minute(0).second(0);
      const arr: Dayjs[] = [];
      let cur = start;
      while (cur.isBefore(end) || cur.isSame(end)) {
        arr.push(cur);
        cur = cur.add(45, "minute");
      }
      return arr;
    }, [value]);

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 2 }}>
        {times.map((time) => {
          const isBooked = bookedSlots.some(
            (slot) =>
              time.isSame(slot.date, "year") &&
              time.isSame(slot.date, "month") &&
              time.isSame(slot.date, "date") &&
              time.isSame(slot.date + slot.time, "hour") &&
              time.isSame(slot.date + slot.time, "minute"),
          );

          return (
            <Chip
              key={time.format("HH:mm")}
              label={time.format("HH:mm")}
              color={
                value && value.isSame(time, "minute") ? "primary" : "default"
              }
              onClick={() => !isBooked && onChange?.(time)}
              disabled={isBooked || !doctor}
            />
          );
        })}
      </Box>
    );
  };

  const handleChange = (
    fullName: string,
    phone: string,
    email: string,
    doctor: string,
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
      doctor: doctor,
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
    if (!doctor) return;
    const fetchBookings = async () => {
      try {
        const response = await axios.get(url, {
          params: { doctor },
        });
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
  }, [doctor]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["StaticDateTimePicker"]}
        sx={{ mb: "64px", ".MuiPickersLayout-root": { display: "block" } }}
      >
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
          required
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
          required
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
          required
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
        <Box
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
        >
          <FormControl fullWidth>
            <InputLabel id="doctor">Doctor</InputLabel>
            <Select
              labelId="doctor"
              id="doctor"
              value={doctor}
              label="Doctor"
              required
              onChange={(event) => {
                setDoctor(event.target.value);
                setBookingDateTime(null); // reset time
                setBookedSlots([]); // clear old bookings
              }}
            >
              <MenuItem value={"Doctor 1"}>Doctor 1</MenuItem>
              <MenuItem value={"Doctor 2"}>Doctor 2</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <StaticDateTimePicker
          views={["year", "month", "day", "hours", "minutes"]}
          defaultValue={dayjs()}
          value={bookingDateTime}
          disablePast
          ampm={false}
          disabled={!doctor}
          viewRenderers={{
            hours: (params) => <TimeChipsRenderer {...params} />,
          }}
          shouldDisableTime={(time, view) => {
            return bookedSlots.some((slot) => {
              if (
                time.isSame(slot.date, "year") &&
                time.isSame(slot.date, "month") &&
                time.isSame(slot.date, "date")
              ) {
                return true;
              } else {
                return false;
              }
            });
          }}
          minutesStep={1}
          onViewChange={(view) => {
            // NEW: track view and zero time when returning to the day tab
            setCurrentView(view);
            if (view === "day") {
              setBookingDateTime((prev) => (prev ? prev.startOf("day") : prev));
            }
          }}
          onChange={(newValue) => {
            if (!newValue) return;
            // NEW: when picking a date while on the 'day' view, snap to 00:00
            if (currentView === "day") {
              newValue = newValue.startOf("day");
            }
            setBookingDateTime(newValue);
          }}
          slots={{
            actionBar: CustomAction,
          }}
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
