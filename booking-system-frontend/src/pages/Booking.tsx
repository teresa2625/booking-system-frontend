import React from "react";
import BookingForm from "../components/BookingForm";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "themes/theme";
import CssBaseline from "@mui/material/CssBaseline";
import NavigationBar from "components/NavigationBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CopyRight from "components/CopyRight";

const Booking: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <NavigationBar />
        <Container maxWidth="xl">
          <Typography>Booking Page</Typography>
          <BookingForm />
        </Container>
        <CopyRight />
      </ThemeProvider>
    </>
  );
};

export default Booking;