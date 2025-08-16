// src/pages/Signup.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.data.success) {
        toast({
          title: "Signup successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to connect to server",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, #0f2027, #203a43, #2c5364)"
      color="white"
    >
      <MotionBox
        bg="rgba(255,255,255,0.05)"
        p={8}
        borderRadius="2xl"
        boxShadow="lg"
        backdropFilter="blur(10px)"
        width="sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <VStack spacing={5} as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Create an Account</Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="Username"
              bg="whiteAlpha.200"
              border="none"
              _focus={{ bg: "whiteAlpha.300" }}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              bg="whiteAlpha.200"
              border="none"
              _focus={{ bg: "whiteAlpha.300" }}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              bg="whiteAlpha.200"
              border="none"
              _focus={{ bg: "whiteAlpha.300" }}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            w="full"
            _hover={{ transform: "scale(1.02)" }}
            transition="0.2s"
          >
            Sign Up
          </Button>
          <Text fontSize="sm">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4FD1C5" }}>
              Login
            </Link>
          </Text>
        </VStack>
      </MotionBox>
    </Flex>
  );
}
