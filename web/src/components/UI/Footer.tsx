import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/layout';
import { FaGithub } from 'react-icons/fa';
export const Footer = () => (
  <Flex w="100%" bg="gray.700" h="200px" justifyContent="center">
    <Flex w="60%" justifyContent="center" alignItems="center" flexDir="column">
      <Text color="white" mb="1rem">
        copyright &copy; {new Date().getFullYear()} Cool Procrastination
      </Text>
      <Flex w="200px" justifyContent="space-around">
        <Link target="_blank" href="https://github.com/YenTingWu">
          <FaGithub color="white" size="28px" />
        </Link>
      </Flex>
    </Flex>
  </Flex>
);
