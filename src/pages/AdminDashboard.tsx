import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "themes/theme";
import CssBaseline from "@mui/material/CssBaseline";
import NavigationBar from "components/NavigationBar";
import Container from "@mui/material/Container";
import Footer from "components/Footer";
import DoctorDashboard from "components/DoctorDashboard";

interface AdminDashboardProps {
  role: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ role }) => {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <NavigationBar />
        <Container maxWidth="xl">
          {role === "Admin" && <DoctorDashboard />}
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default AdminDashboard;
