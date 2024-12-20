import React from "react";
import BookingForm from "../components/BookingForm";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "themes/theme";
import CssBaseline from "@mui/material/CssBaseline";
import NavigationBar from "components/NavigationBar";
import Container from "@mui/material/Container";
import Footer from "components/Footer";

const Booking: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <NavigationBar />
        <Container maxWidth="xl">
          <BookingForm />
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Booking;
