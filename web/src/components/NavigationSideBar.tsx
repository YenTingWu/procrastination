import React, { useCallback } from 'react';
import { Flex, Divider, Avatar, Button } from '@chakra-ui/react';
import { LogoIcon } from '@components/Icon';
import { useHistory } from 'react-router-dom';

const SideBarItemContainer: React.FC = ({ children }) => {
  return (
    <Flex
      w="100%"
      pr="3px"
      mb="2"
      justifyContent="center"
      borderLeft="5px solid black"
      borderRadius="3"
      _notFirst={{
        mt: '2',
      }}
    >
      {children}
    </Flex>
  );
};

interface NavigationSideBarProps {
  avatar?: string;
  placeholder?: string;
}

/**
 *
 * @returns
 */

export const NavigationSideBar: React.FC<NavigationSideBarProps> = ({
  avatar = 'https://bit.ly/broken-link',
  placeholder = '',
}) => {
  let history = useHistory();

  const handleLogoIconClick = useCallback(() => history.push('/'), []);
  const handleNavigateTodo = useCallback(() => history.push('/todo'), []);
  const handleNavigateProfile = useCallback(() => history.push('/profile'), []);
  const handleNavigateAnalysis = useCallback(
    () => history.push('/analysis'),
    []
  );

  return (
    <Flex
      w="3.5rem"
      h="100vh"
      flexDirection="column"
      alignItems="center"
      pt="5"
      pb="5"
      boxShadow="1px 0 3px 1px rgba(0, 0, 0, 0.25)"
    >
      <SideBarItemContainer>
        <LogoIcon onClick={handleLogoIconClick} />
      </SideBarItemContainer>
      <Divider w="80%" />

      <Flex flex="1" pt="5" flexDirection="column">
        <Button onClick={handleNavigateTodo}>todo</Button>
        <Button mt="3" onClick={handleNavigateAnalysis}>
          analysis
        </Button>
      </Flex>
      <Divider w="80%" />

      <Flex
        flexDirection="column"
        alignItems="center"
        pt="3"
        onClick={handleNavigateProfile}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Avatar name={placeholder} src={avatar} />
      </Flex>
    </Flex>
  );
};
