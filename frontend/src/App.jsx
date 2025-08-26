import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { WorkPage } from "./pages/WorkPage";
import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={"gray.800"}>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>

          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/workPage" element={<WorkPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
