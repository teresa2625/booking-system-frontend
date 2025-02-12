import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const NotesDialog: React.FC<any> = ({ open, handleClose, info }) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
            // const email = formJson.email;
            console.log(info?.title);
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
