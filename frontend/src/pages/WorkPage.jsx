import {
  Box,
  Button,
  Code,
  Container,
  Divider,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";

export const WorkPage = () => {
  const [method, setMethod] = useState("GET");
  const [url, setURL] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");

  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleSelectRequest = (req) => {
    setSelectedRequestId(req._id);
    setMethod(req.method || "GET");
    setURL(req.url || "");
    setHeaders(JSON.stringify(req.headers || {}, null, 2));
    setBody(JSON.stringify(req.body || {}, null, 2));
    setResponse(req.response || null);
  };

  const bg = useColorModeValue("gray.100", "gray.800");
  const boxBg = useColorModeValue("gray.700", "gray.700");
  const inputBg = useColorModeValue("gray.700", "gray.900");

  const sendRequest = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const startTime = Date.now();

    try {
      let parsedHeaders = {};
      let parsedBody = {};

      if (headers.trim() !== "") {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          alert("Headers must be valid JSON.");
          setLoading(false);
          return;
        }
      }

      if (body.trim() !== "") {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          alert("Body must be valid JSON.");
          setLoading(false);
          return;
        }
      }

      // ✅ Send request to EXTERNAL API only
      const res = await axios({
        method,
        url, // full external API URL
        headers: parsedHeaders,
        data: method === "GET" ? undefined : parsedBody,
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseData = {
        status: res.status,
        time: duration,
        headers: res.headers,
        body: res.data,
      };

      setTime(duration);
      setResponse(responseData);

      // ✅ Now update your backend history separately
      if (selectedRequestId) {
        await axios.patch(
          `http://localhost:5000/history/updateReq/${selectedRequestId}`,
          {
            method,
            url,
            headers: parsedHeaders,
            body: parsedBody,
            response: responseData, // ✅ not res.data
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const saved = await axios.post("http://localhost:5000/history", {
          method,
          url,
          headers: parsedHeaders,
          body: parsedBody,
          response: responseData,
        });
        setSelectedRequestId(saved.data._id);
      }
    } catch (error) {
      const errData = {
        status: error.response?.status || 500,
        time: Date.now() - startTime,
        headers: error.response?.headers || {},
        body: error.response?.data || { message: "ERROR" },
      };
      setResponse(errData);
    } finally {
      setLoading(false);
    }
  };
  const methodColor = {
    GET: "blue",
    POST: "green",
    PUT: "orange",
    PATCH: "purple",
    DELETE: "red",
  };

  return (
    <HStack>
      <Sidebar onSelectRequest={handleSelectRequest} />
      <Container maxW="container.xl" py={12} bg={"gray.700"} textColor="white">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Select
              bg={inputBg}
              color={`${methodColor[method]}.400`}
              borderColor="gray.600"
              width={"40"}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m} value={m} style={{ color: "black" }}>
                  {m}
                </option>
              ))}
            </Select>

            <Input
              bg={inputBg}
              borderColor="gray.600"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setURL(e.target.value)}
            />

            <Button
              variant="solid"
              isLoading={loading}
              onClick={sendRequest}
              colorScheme={methodColor[method]}
            >
              Send
            </Button>
          </HStack>

          <Textarea
            bg={inputBg}
            borderColor="gray.600"
            placeholder="Headers (JSON FORMAT)"
            rows={6}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />

          <Textarea
            bg={inputBg}
            borderColor="gray.600"
            placeholder="Body (JSON FORMAT, optional)"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          {response && (
            <Box
              mt={6}
              p={4}
              bg={boxBg}
              borderRadius="md"
              overflow="auto"
              maxH="500px"
            >
              <Text fontWeight="bold">RESPONSE</Text>
              <Divider my={2} />
              <Text>
                Status: {response.status} | Time: {time}ms
              </Text>

              <Text mt={2} fontWeight="semibold">
                Headers:
              </Text>
              <Code
                p={2}
                display="block"
                whiteSpace="pre-wrap"
                bg={"gray.800"}
                textColor={"white"}
                borderRadius={"md"}
              >
                {JSON.stringify(response.headers, null, 2)}
              </Code>

              <Text mt={2} fontWeight="semibold">
                Body:
              </Text>
              <Code
                p={2}
                display="block"
                whiteSpace="pre-wrap"
                bg={"gray.800"}
                textColor={"white"}
                borderRadius={"md"}
              >
                {JSON.stringify(response.body, null, 2)}
              </Code>
            </Box>
          )}
        </VStack>
      </Container>
    </HStack>
  );
};
