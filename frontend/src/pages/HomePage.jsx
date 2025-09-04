import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { TextType } from "../components/TextType.jsx";
import Login from "./LoginPage.jsx";
import Signup from "./SignupPage.jsx";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "../components/SpotLightCard.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <Flex
        as="nav"
        bg="teal.500"
        color="white"
        px={6}
        py={4}
        align="center"
        boxShadow="md"
        background={"linear-gradient(90deg, #000c3fff, #000622ff)"}
      >
        <Heading size="md">API Tester</Heading>
        <Spacer />
        <HStack spacing={6}>
          <Button variant="link" color="white">
            Home
          </Button>
          <Button
            variant="link"
            color="white"
            onClick={() => navigate("/aboutus")}
          >
            About Us
          </Button>
        </HStack>
      </Flex>
      {/* Main Content */}
      <Container
        centerContent
        maxW="container.lg"
        mt={40}
        fontSize={"4xl"}
        fontWeight={"bold"}
      >
        <TextType
          text={[
            "Welcome to API TESTER! Its great to see you.",
            "Test your API with ease!",
            "Debug faster, Build smarter.",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
        <Text
          fontSize="lg"
          color={"linear-gradient(90deg, #000c3fff, #000622ff)"}
          mb={10}
          textAlign="center"
        >
          A simple and powerful tool to test your APIs with ease.
        </Text>

        <HStack spacing={6}>
          <Button
            colorScheme="whiteAlpha"
            size="lg"
            px={10}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            colorScheme="whiteAlpha"
            size="lg"
            variant="outline"
            px={10}
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </HStack>

        <Spacer />

        <HStack spacing={6} mt={10} width={"150%"} justifyContent="center">
          {" "}
          {/* 👈 spacing adds gap, mt adds space on top */}
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <Box p={6}>
              <Heading size="md" mb={2} color={"white"}>
                📜 History Tracking
              </Heading>
              <Text color={"white"}>
                Save and review past requests anytime to debug faster.
              </Text>
            </Box>
          </SpotlightCard>
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <Box p={6}>
              <Heading size="md" mb={2} color={"white"}>
                Save & Organize Requests
              </Heading>
              <Text color={"white"} fontWeight={"normal"}>
                Keep your API requests organized into collections for quick
                access.
              </Text>
            </Box>
          </SpotlightCard>
        </HStack>
      </Container>
    </>
  );
};

export default HomePage;
