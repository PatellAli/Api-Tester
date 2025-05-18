import { Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export const Navbar = () => {
  return (
    <>
        <Container maxW={"1140px"} px={4}>

            <Flex 
                h={16}
                alignItems={'center'}
                justifyContent={'space-between'}
                flexDir={{
                    base: "column",
                    sm: "row"
                }}
            >

                <Text
                    fontSize={{ base: "22", sm: "28" }}
					fontWeight={"bold"}
					textTransform={"uppercase"}
					textAlign={"center"}
					bgGradient={"linear(to-r, gray.100, gray.300)"}
					bgClip={"text"}
                >
                    API-TEST.COM
                </Text>

            </Flex>

        </Container>
    </>
  )
}
