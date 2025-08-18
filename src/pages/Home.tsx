import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Footer from "components/Footer";
import Header from "components/Header";
import NavigationBar from "components/NavigationBar";
import React, { useRef } from "react";
import Theme from "themes/theme";
import Box from "@mui/material/Box";
import Advantage from "components/Advantage";
import Services from "components/Services";
import HomeTeam from "components/HomeTeam";
import ContactUs from "components/ContactUs";
import useRevealOnScroll from "hooks/useRevealOnScroll";

// TODO: breadcrumb, account

const Home: React.FC = () => {
  const bookingRef = useRef<null | HTMLDivElement>(null);
  const serviceRef = useRef<null | HTMLDivElement>(null);
  const contactRef = useRef<null | HTMLDivElement>(null);

  const { isVisible: advantageVisible, elementRef: advantageScrollRef } =
    useRevealOnScroll();
  const { isVisible: servicesVisible, elementRef: serviceScrollRef } =
    useRevealOnScroll();
  const { isVisible: teamVisible, elementRef: teamScrollRef } =
    useRevealOnScroll();

  const handleSectionClick = (section: string) => {
    if (section === "Schedule" && bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "Services" && serviceRef.current) {
      serviceRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "Contact" && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <NavigationBar onSectionClick={handleSectionClick} />
        <div ref={bookingRef}>
          <Header />
        </div>
        <Container maxWidth="xl">
          <Box
            ref={advantageScrollRef}
            sx={{
              opacity: advantageVisible ? 1 : 0,
              transform: advantageVisible
                ? "translateY(0)"
                : "translateY(50px)",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <Stack
              spacing={1}
              direction="row"
              sx={{
                opacity: advantageVisible ? 1 : 0,
                transform: advantageVisible
                  ? "translateY(0)"
                  : "translateY(50px)",
                transition: "all 0.5s ease-in-out",
                display: "flex",
                my: "64px",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: "180px",
                }}
              >
                Why Choose US
              </Box>
              <Box>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here',
              </Box>
            </Stack>
            <Advantage />
          </Box>
          <Box
            ref={serviceScrollRef}
            sx={{
              opacity: servicesVisible ? 1 : 0,
              transform: servicesVisible ? "translateY(0)" : "translateY(50px)",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <Stack
              spacing={1}
              direction="row"
              sx={{ display: "flex", my: "64px" }}
              ref={serviceRef}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: "180px",
                }}
              >
                Our services
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", md: "none", lg: "none", xl: "none" },
                }}
              >
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here',
              </Box>
            </Stack>
            <Services />
          </Box>
          <Stack
            direction={{ md: "column", lg: "row" }}
            gap={15}
            spacing={1}
            sx={{
              opacity: teamVisible ? 1 : 0,
              transform: teamVisible ? "translateY(0)" : "translateY(50px)",
              transition: "all 0.5s ease-in-out",
              my: "64px",
              maxWidth: "1440px",
            }}
            ref={teamScrollRef}
          >
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: "180px",
                }}
              >
                Meet the team
              </Box>
              <Box>
                <HomeTeam />
              </Box>
            </Box>
            <Box ref={contactRef} sx={{ width: "100%" }}>
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: "180px",
                }}
              >
                Contact us
              </Box>
              <Box>
                <ContactUs />
              </Box>
            </Box>
          </Stack>
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Home;
