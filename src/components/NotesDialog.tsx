import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { PatientDetail, PatientForm } from "types/booking";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import useLazyFetch from "hooks/useLazyFetch";

const NotesDialog: React.FC<any> = ({ open, handleClose, info }) => {
  const patientUrl = "http://localhost:5000/patients";
  const [fetchData, { data, loading, error }] =
    useLazyFetch<PatientDetail[]>(patientUrl);
  const [isNew, setIsNew] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [notes, setNotes] = useState("");
  const [patientForm, setPatientForm] = useState<PatientForm>({
    dob: "",
    address: "",
    occupation: "",
    complaint: "",
    currentRX: "",
    tests: "",
    medication: "",
    others: "",
    neuro: "",
    ortho: "",
    vasc: "",
    oe: "",
    rx: "",
    dx: "",
    pxrec: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (bookingId: number) => {
    console.log("doctor Notes submitted:", bookingId);

    try {
      if (isNew) {
        const payload = {
          fileNum: 1,
          patientName: info?.title,
          email: info?.extendedProps.patientEmail,
          phoneNum: info?.extendedProps.patientPhone,
          notes: "",
          ...patientForm,
        };
        const response = await axios.post(
          "http://localhost:5000/patients",
          payload,
        );
        console.log("Patients updated:", response);
      } else {
        const payload = {
          patientName: info?.title,
          email: info?.extendedProps.patientEmail,
          notes,
        };
        const response = await axios.patch(
          "http://localhost:5000/patients",
          payload,
        );
        console.log("Patients updated:", response);
      }
      const bookingUpdate = { id: bookingId, status: "Completed" };
      console.log("PATCH bookings payload:", bookingUpdate);
      await axios.patch("http://localhost:5000/bookings", bookingUpdate);
      handleClose();
      setIsNew(false);
      setIsReturn(false);
      setNotes("");
      setPatientForm({
        dob: "",
        address: "",
        occupation: "",
        complaint: "",
        currentRX: "",
        tests: "",
        medication: "",
        others: "",
        neuro: "",
        ortho: "",
        vasc: "",
        oe: "",
        rx: "",
        dx: "",
        pxrec: "",
      });
    } catch (err) {
      console.log("Patients update failed:", err);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (isReturn) {
        try {
          const patientName = info?.title;

          const res = await axios.get("http://localhost:5000/patients", {
            params: { patientName },
          });

          setNotes(res.data?.notes || "");
        } catch (err) {
          console.error("Failed to fetch notes:", err);
        }
      }
    };

    fetchNotes();
  }, [isReturn, info]);

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
              handleSubmit(info?.id);
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
                  name="dob"
                  label="DOB"
                  value={patientForm.dob}
                  onChange={handleInputChange}
                  id="outlined-basic"
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
                />
                <TextField
                  name="address"
                  value={patientForm.address}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="occupation"
                  value={patientForm.occupation}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="complaint"
                  value={patientForm.complaint}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="currentRX"
                  value={patientForm.currentRX}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="tests"
                  value={patientForm.tests}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="medication"
                  value={patientForm.medication}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="others"
                  value={patientForm.others}
                  onChange={handleInputChange}
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
                  name="neuro"
                  value={patientForm.neuro}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="ortho"
                  value={patientForm.ortho}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="vasc"
                  value={patientForm.vasc}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="oe"
                  value={patientForm.oe}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="rx"
                  value={patientForm.rx}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="dx"
                  value={patientForm.dx}
                  onChange={handleInputChange}
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
                />
                <TextField
                  id="outlined-basic"
                  name="pxrec"
                  value={patientForm.pxrec}
                  onChange={handleInputChange}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
          {!isNew && !isReturn ? (
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
                  fetchData({
                    patient: info?.title,
                    email: info?.extendedProps.patientEmail,
                  });
                }}
              >
                Add Notes
              </Button>
            </>
          ) : (
            <>
              <Button sx={{ bgcolor: "primary.dark" }} onClick={handleClose}>
                Cancel
              </Button>
              <Button sx={{ bgcolor: "primary.dark" }} type="submit">
                Send
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default NotesDialog;
