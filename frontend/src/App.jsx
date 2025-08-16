import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { WorkPage } from "./pages/WorkPage";
import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={"gray.800"}>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>

          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/" element={<WorkPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
