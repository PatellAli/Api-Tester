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
      >
        <Heading size="md">API Tester</Heading>
        <Spacer />
        <HStack spacing={6}>
          <Button variant="link" color="white">
            Home
          </Button>
          <Button variant="link" color="white">
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
        <Text fontSize="lg" color="gray.600" mb={10} textAlign="center">
          A simple and powerful tool to test your APIs with ease.
        </Text>

        <HStack spacing={6}>
          <Button
            colorScheme="teal"
            size="lg"
            px={10}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            colorScheme="teal"
            size="lg"
            variant="outline"
            px={10}
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </HStack>
      </Container>
    </>
  );
};

export default HomePage;
