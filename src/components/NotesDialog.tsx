import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { UpdateBooking } from "types/booking";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";

const NotesDialog: React.FC<any> = ({ open, handleClose, info }) => {
  const [isNew, setIsNew] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [complaint, setComplaint] = useState("");
  const [occupation, setOccupation] = useState("");
  const [currentRX, setCurrentRX] = useState("");
  const [tests, setTests] = useState("");
  const [medication, setMedication] = useState("");
  const [others, setOthers] = useState("");
  const [neuro, setNeuro] = useState("");
  const [ortho, setOrtho] = useState("");
  const [vasc, setVasc] = useState("");
  const [oe, setOe] = useState("");
  const [rx, setRx] = useState("");
  const [dx, setDx] = useState("");
  const [pxrec, setPxrec] = useState("");

  const handleChange = (patientId: number, patientNotes: string) => {
    console.log("handleChange");
    const bookingUpdateFormat = {
      id: patientId,
      note: patientNotes,
      status: "Completed",
    };
    handleSubmit(bookingUpdateFormat);
  };
  const handleSubmit = async (data: UpdateBooking) => {
    console.log("doctor Notes submitted:", data);

    try {
      const response = await axios.patch(
        "http://localhost:5000/bookings",
        data,
      );
      console.log("Booking updated:", response);
    } catch (err) {
      console.log("Booking update failed:", err);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={() => {
          handleClose();
          setIsNew(false);
          setIsReturn(false);
        }}
        onTransitionExited={() => {
          setIsNew(false);
          setIsReturn(false);
        }}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const notesDetail = formJson.notes;

              console.log(info?.id);
              handleChange(info?.id, notesDetail);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>File - {info?.title}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        {isNew && (
          <DialogContent>
            <Stack minWidth={"500px"} spacing={2}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    fontSize: "2rem",
                  }}
                >
                  Patient Information
                </Box>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  disabled
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
                  defaultValue={info?.extendedProps.patientEmail}
                />
                <TextField
                  id="outlined-basic"
                  label="Phone"
                  variant="outlined"
                  disabled
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
                  defaultValue={info?.extendedProps.patientPhone}
                />
                <TextField
                  id="outlined-basic"
                  label="DOB"
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
                    setDob(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Address"
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
                    setAddress(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Occupation"
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
                    setOccupation(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Complaint"
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
                    setComplaint(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="CurrentRX"
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
                    setCurrentRX(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Tests"
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
                    setTests(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Medication"
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
                    setMedication(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Others"
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
                    setOthers(event.target.value);
                  }}
                />
              </Stack>
              <Stack spacing={2}>
                <Box
                  sx={{
                    fontSize: "2rem",
                  }}
                >
                  Clinical findings
                </Box>
                <TextField
                  id="outlined-basic"
                  label="Neuro"
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
                    setNeuro(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Ortho"
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
                    setOrtho(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Vasc"
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
                    setVasc(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Oe"
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
                    setOe(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Rx"
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
                    setRx(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Dx"
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
                    setDx(event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Px/Rec"
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
                    setPxrec(event.target.value);
                  }}
                />
              </Stack>
            </Stack>
          </DialogContent>
        )}
        {isReturn && (
          <DialogContent>
            <Stack minWidth={"500px"} spacing={2}>
              <Box
                sx={{
                  fontSize: "2rem",
                }}
              >
                Notes
              </Box>
              <TextField
                autoFocus
                required
                margin="dense"
                name="notes"
                label="Notes"
                fullWidth
                variant="outlined"
                slotProps={{
                  htmlInput: {
                    style: {
                      minHeight: "300px",
                    },
                  },
                }}
                sx={{
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
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          {!isNew && !isReturn && (
            <>
              <Button
                sx={{ bgcolor: "primary.dark" }}
                onClick={() => {
                  setIsNew(true);
                  setIsReturn(false);
                }}
              >
                New Patient
              </Button>
              <Button
                sx={{ bgcolor: "primary.dark" }}
                onClick={() => {
                  setIsNew(false);
                  setIsReturn(true);
                }}
              >
                Add Notes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default NotesDialog;
