// components/Sidebar.js
import {
  Box,
  VStack,
  Text,
  Button,
  Divider,
  Collapse,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reqName, setReqName] = useState("");

  const [requests, setRequests] = useState([]);

  const toggleFolder = (folderId) => {
    setExpandedFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  const addRequest = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc5NDA0MTQyOTg5NWY1YzIyMzRjNTEiLCJpYXQiOjE3NTQwMjczODQsImV4cCI6MTc1NDYzMjE4NH0.l15a4MZLNplAS3uoYmR2yCB7R5c8pqQNFSO5LZfzJRo";
    try {
      const response = await axios.post(
        "http://localhost:5000/history/createReq",
        { name: reqName, folderId: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Request saved:", response.data);
      setReqName("");
      onClose();
    } catch (error) {
      console.error(
        "Error adding request:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc5NDA0MTQyOTg5NWY1YzIyMzRjNTEiLCJpYXQiOjE3NTQwMjczODQsImV4cCI6MTc1NDYzMjE4NH0.l15a4MZLNplAS3uoYmR2yCB7R5c8pqQNFSO5LZfzJRo";
        const response = await axios.get(
          "http://localhost:5000/history/getFolders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFolders(response.data);
      } catch (error) {
        console.error("Failed to fetch folders", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchreq = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc5NDA0MTQyOTg5NWY1YzIyMzRjNTEiLCJpYXQiOjE3NTQwMjczODQsImV4cCI6MTc1NDYzMjE4NH0.l15a4MZLNplAS3uoYmR2yCB7R5c8pqQNFSO5LZfzJRo";
        const response = await axios.get("http://localhost:5000/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching no-folder requests", error);
      }
    };
    fetchreq();
  });

  return (
    <Box
      w="300px"
      h="100vh"
      bg="gray.900"
      color="white"
      p={4}
      overflowY="auto"
      borderRight="1px solid #444"
    >
      {/* Top Buttons */}
      <HStack margin={"6px"}>
        <Button fontSize={"14px"} onClick={onOpen}>
          Add Request
          <AddIcon marginLeft={"5px"} />
        </Button>
        <Button fontSize={"14px"}>
          Add Folder
          <AddIcon marginLeft={"5px"} />
        </Button>
      </HStack>

      {/* Folder list */}
      <VStack align="stretch" spacing={2}>
        {folders.map((folder) => (
          <Box key={folder._id}>
            <HStack justify="space-between" width="100%">
              <Button
                onClick={() => toggleFolder(folder._id)}
                variant="ghost"
                justifyContent="flex-start"
                flex="1"
                color="teal.300"
                rightIcon={
                  expandedFolderId === folder._id ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )
                }
                _hover={{ bg: "gray.700" }}
                fontWeight="semibold"
              >
                {folder.name}
              </Button>

              <Button
                size="xs"
                variant="ghost"
                colorScheme="green"
                onClick={() => console.log("Edit folder", folder._id)}
                _hover={{ bg: "gray.700" }}
                px={2}
              >
                <EditIcon boxSize={3} />
              </Button>

              <Button
                size="xs"
                variant="ghost"
                colorScheme="green"
                onClick={onOpen}
                _hover={{ bg: "gray.700" }}
                px={2}
              >
                <AddIcon boxSize={3} />
              </Button>
            </HStack>

            <Collapse in={expandedFolderId === folder._id} animateOpacity>
              <VStack align="start" pl={4} pt={2} spacing={1}>
                {folder.requests.length === 0 ? (
                  <Text fontSize="sm" color="gray.400">
                    No requests
                  </Text>
                ) : (
                  folder.requests.map((req) => (
                    <Button
                      key={req._id}
                      variant="ghost"
                      size="sm"
                      color="gray.300"
                      justifyContent="flex-start"
                      width="100%"
                      _hover={{ bg: "gray.700" }}
                    >
                      <Text fontWeight="bold" as="span" mr={2}>
                        {req.name}
                      </Text>
                    </Button>
                  ))
                )}
              </VStack>
            </Collapse>

            <Divider my={2} borderColor="gray.600" />
          </Box>
        ))}
      </VStack>

      <VStack align="stretch" spacing={2}>
        {/* No folder requests */}
        {requests.length > 0 && (
          <>
            <Text fontSize="sm" color="gray.400" fontWeight="bold">
              Unassigned Requests
            </Text>
            {requests.map((req) => (
              <Button
                key={req._id}
                variant="ghost"
                size="sm"
                color="gray.300"
                justifyContent="flex-start"
                width="100%"
                _hover={{ bg: "gray.700" }}
              >
                {req.name}
              </Button>
            ))}
            <Divider borderColor="gray.600" />
          </>
        )}

        {/* Folder requests here */}
      </VStack>

      {/* Add Request Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Request</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter request name"
              value={reqName}
              onChange={(e) => setReqName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={addRequest}
              isDisabled={!reqName.trim()}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
