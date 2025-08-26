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
  Toast,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ onSelectRequest }) => {
  const [folders, setFolders] = useState([]);
  const [expandedFolderId, setExpandedFolderId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isFolderOpen,
    onOpen: onFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [reqName, setReqName] = useState("");
  const [folderName, setFolderName] = useState("");

  const [requests, setRequests] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null); // ✅ Track which folder we’re adding to
  // ---------- Fetch helpers ----------
  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/history/getFolders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched folders:", response);
      setFolders(response.data);
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  };

  const fetchUnassigned = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching no-folder requests", error);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchFolders();
    fetchUnassigned();
  }, []);

  // ---------- Create / Add ----------
  const addRequest = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/history/createReq",
        { name: reqName, folderId: currentFolderId }, // ✅ Use picked folder
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReqName("");
      setCurrentFolderId(null);
      onClose();

      // Refresh data
      await fetchFolders();
      await fetchUnassigned();
    } catch (error) {
      console.error(
        "Error adding request:",
        error.response?.data || error.message
      );
    }
  };

  const createFolder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/history/createFolder",
        { name: folderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFolderName("");
      onFolderClose();

      // Refresh folders
      await fetchFolders();
    } catch (error) {
      console.error(
        "Error in creating folder: ",
        error.response?.data || error.message
      );
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  //Delete request
  const deleteReq = async (id) => {
    const token = localStorage.getItem("token");
    console.log("delete btn clicked");

    try {
      const response = await axios.delete(
        `http://localhost:5000/history/deleteReq/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.success);

      if (response.data.success) {
        Toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setRequests((prev) => prev.filter((req) => req._id !== id));
        // Refresh data
        await fetchFolders();
        await fetchUnassigned();
      }
    } catch (error) {
      console.error("ERROR in deleting req: ", error);
      Toast({
        title: "ERROR",
        description:
          error.response?.data?.message || "Failed to delete the request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteFolder = async () => {
    console.log("my2", currentFolderId);

    if (!currentFolderId) {
      console.error("No folder ID set!");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:5000/history/deleteFolder/${currentFolderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        await fetchFolders();
        await fetchUnassigned();
      }
    } catch (error) {
      console.error(
        "ERROR in deleting folder: ",
        error.response?.data || error
      );
    } finally {
      // ✅ close modal after action
      onConfirmClose();
    }
  };

  // ✅ open modal when delete button clicked
  const handleDeleteClick = () => {
    onConfirmOpen(); // just opens modal
  };
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
        <Button
          fontSize={"14px"}
          onClick={() => {
            setCurrentFolderId(null);
            onOpen();
          }}
        >
          Add Request <AddIcon marginLeft={"5px"} />
        </Button>
        <Button fontSize={"14px"} onClick={onFolderOpen}>
          Add Folder <AddIcon marginLeft={"5px"} />
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
                onClick={() => {
                  setCurrentFolderId(folder._id);
                  onOpen();
                }} // ✅ Add request to that folder
                _hover={{ bg: "gray.700" }}
                px={2}
              >
                <AddIcon boxSize={3} />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  console.log("My", folder._id);

                  setCurrentFolderId(folder._id);
                  handleDeleteClick();
                }} // ✅ Add request to that folder
                _hover={{ bg: "gray.700" }}
                px={2}
              >
                <DeleteIcon />
              </Button>
            </HStack>

            {/* Requests inside folder */}
            <Collapse in={expandedFolderId === folder._id} animateOpacity>
              <VStack align="start" pl={4} pt={2} spacing={1}>
                {folder.requests.length === 0 ? (
                  <Text fontSize="sm" color="gray.400">
                    No requests
                  </Text>
                ) : (
                  folder.requests.map((req) => (
                    <HStack key={req._id} justifyContent={"space-between"}>
                      <Button
                        key={req._id}
                        variant="ghost"
                        size="sm"
                        color="gray.300"
                        justifyContent="flex-start"
                        width="100%"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => onSelectRequest(req)}
                      >
                        {req.name}
                      </Button>
                      <Button
                        variant="ghost"
                        color="red.400"
                        size="xs"
                        onClick={() => {
                          deleteReq(req._id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </HStack>
                  ))
                )}
              </VStack>
            </Collapse>

            <Divider my={2} borderColor="gray.600" />
          </Box>
        ))}
      </VStack>

      {/* Unassigned requests */}
      {requests.length > 0 && (
        <VStack align="stretch" spacing={2}>
          <Text fontSize="sm" color="gray.400" fontWeight="bold">
            Unassigned Requests
          </Text>
          {requests.map((req) => (
            <HStack>
              <Button
                key={req._id}
                variant="ghost"
                size="sm"
                color="gray.300"
                justifyContent="flex-start"
                width="100%"
                _hover={{ bg: "gray.700" }}
                onClick={() => onSelectRequest(req)}
              >
                {req.name}
              </Button>
              <Button
                variant="ghost"
                color="red.400"
                size="xs"
                onClick={() => {
                  deleteReq(req._id);
                }}
              >
                <DeleteIcon />
              </Button>
            </HStack>
          ))}
          <Divider borderColor="gray.600" />
        </VStack>
      )}

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

      {/* Add Folder Modal */}
      <Modal isOpen={isFolderOpen} onClose={onFolderClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Folder</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onFolderClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={createFolder}
              isDisabled={!folderName.trim()}
            >
              ADD
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Folder?</ModalHeader>
          <ModalBody>Are you sure you want to delete this folder?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteFolder}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
