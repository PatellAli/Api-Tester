import { Box, Button, Code, Container, Divider, HStack, Input, Select, Text, Textarea, VStack} from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { data } from 'react-router-dom'

export const WorkPage = () => {

    const [method, setMethod] = useState('GET')
    const [url, setURL] = useState('')
    const [headers, setHeaders] = useState('')
    const [body, setBody] = useState('')
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState('')

    const sendRequest = async () => {
  setLoading(true);
  const startTime = Date.now();

  try {
    let parsedHeaders = {};
    let parsedBody = {};

    // Safely parse headers
    if (headers.trim() !== "") {
      try {
        parsedHeaders = JSON.parse(headers);
      } catch (e) {
        alert("Headers must be valid JSON.");
        setLoading(false);
        return;
      }
    }

    // Safely parse body
    if (body.trim() !== "") {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        alert("Body must be valid JSON.");
        setLoading(false);
        return;
      }
    }

    // Send request
    const res = await axios({
      method,
      url,
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

    // Save history
    await axios.post("http://localhost:5000/history", {
      method,
      url,
      headers,
      body: body.trim() !== "" ? JSON.parse(body) : {},
      response: responseData,
    });
  } catch (error) {
    console.error(error.message);

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

  return (
    <Container maxW={'container.xl'} py={12}>
        <VStack spacing={4} alignItems={'stretch'}>

        <HStack alignItems={'center'} justifyContent={'space-between'}>
            <Select width={'-webkit-fit-content'} value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value='GET'>GET</option>
                <option value='POST'>POST</option>
                <option value='PUT'>PUT</option>
                <option value='PATCH'>PATCH</option>
                <option value='DELETE'>DELETE</option>

            </Select>

            <Input
                placeholder='Enter URL or paste Text' 
                value={url}
                onChange={(e) => setURL(e.target.value)}       
                />

            <Button variant={'outline'} isLoading={loading} onClick={sendRequest}>
                Send
            </Button>

        </HStack>

        <Textarea
            placeholder='Headers (JSON FORMAT)'
            rows={6}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
        />

        <Textarea
            placeholder='Body (JSON FORMAT, optional)'
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
        />

        {response && (

            <Box mt={6} p={4} borderWidth={1} borderRadius={'md'}>
                <Text fontWeight={'bold'}>
                    RESPONSE
                </Text>
                <Divider my={2}/>

                <Text>Status: {response.status} Time: {time}ms</Text>
                <Text mt={2} fontWeight={'semibold'}>Headers</Text>
                <Code p={2} display={'block'} whiteSpace={'pre'}>{JSON.stringify(response.headers, null, 2)}</Code>
                <Text mt={2} fontWeight='semibold'>Body:</Text>
                <Code p={2} display='block' whiteSpace='pre'>{JSON.stringify(response.body, null, 2)}</Code>  
            </Box>
        )

        }

    </VStack>

    </Container>
  )
}
