import React from "react";
import { Box, Heading, Text, Flex, VStack, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "../components/ProfileCard.jsx";
import AllyImage from "../../public/images/Ally.png";
import Divit from "../../public/images/Divit.png";
import Atharva from "../../public/images/Atharva.png";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <Box minH="100vh" bg="gray.900" color="white" px={6} py={12}>
      {/* Page Header */}
      <Flex align="center" justify="center" mb={12} gap={4}>
        <IconButton
          aria-label="Go Home"
          icon={<ArrowBackIcon boxSize={10} />}
          size="lg"
          colorScheme="blue"
          variant="ghost"
          onClick={() => navigate("/")}
        />
        <VStack spacing={3} textAlign="center">
          <Heading size="2xl">About Us</Heading>
          <Text fontSize="lg" color="gray.400" maxW="600px">
            Meet the team behind <b>API Tester</b>. We are passionate developers
            building tools to make your API testing faster and smarter.
          </Text>
        </VStack>
      </Flex>

      {/* Profiles Section */}
      <Flex justify="center" align="center" wrap="wrap" gap={10} px={4}>
        <ProfileCard
          name="Atharva Patil"
          title="Software Engineer"
          handle="GITHUB"
          status="Online"
          contactText="GO TO GITHUB"
          avatarUrl={Atharva}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() =>
            window.open("https://github.com/Bioflex", "_blank")
          }
        />

        <ProfileCard
          name="Ali Patel"
          title="Full Stack Developer"
          handle="GITHUB"
          status="Available"
          contactText="GO TO GITHUB"
          avatarUrl={AllyImage}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() =>
            window.open("https://github.com/PatellAli", "_blank")
          }
        />

        <ProfileCard
          name="Divit Parekh"
          title="UI/UX Designer"
          handle="divitdesigns"
          status="Busy"
          contactText="Connect"
          avatarUrl={Divit}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => console.log("Contact Divit")}
        />
      </Flex>
    </Box>
  );
};

export default AboutUs;
