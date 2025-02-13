import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

const NotesDialog: React.FC<any> = ({ open, handleClose, info }) => {
  const handleChange = (patientId: string, patientNotes: string) => {
    console.log("handleChange");
    const bookingUpdateFormat = {
      id: patientId,
      note: patientNotes,
      status: "Completed",
    };
    handleSubmit(bookingUpdateFormat);
  };
  const handleSubmit = async (data: any) => {
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
        onClose={handleClose}
        PaperProps={{
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
        }}
      >
        <DialogTitle>Notes - {info?.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="notes"
            label="Notes"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ bgcolor: "primary.dark" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button sx={{ bgcolor: "primary.dark" }} type="submit">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default NotesDialog;
