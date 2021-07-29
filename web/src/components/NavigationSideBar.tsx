import { useRouter as useNextRouter } from 'next/router';
import React, { useCallback } from 'react';
import axios from 'axios';
import { chakra } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';
import { Tooltip } from '@chakra-ui/tooltip';
import { Flex, Divider } from '@chakra-ui/layout';
import { Icon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu';
import { LogoIcon } from '@components/Icon';
import { FcTodoList, FcAreaChart } from 'react-icons/fc';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import {
  useTokenStore,
  accessToken as ACCESS_TOKEN_LOCAL_STORAGE_ID,
} from '@globalStore/client/useTokenStore';
import { API_BASE_URL } from 'src/config';

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
  const { push } = useNextRouter();
  const setToken = useTokenStore((s) => s.setTokens);

  const handleLogoIconClick = useCallback(() => history.push('/'), []);
  const handleNavigateTodo = useCallback(() => history.push('/todo'), []);
  const handleNavigateProfile = useCallback(() => history.push('/profile'), []);
  const handleNavigateAnalysis = useCallback(
    () => history.push('/analysis'),
    []
  );

  const handleSignOut = async () => {
    setToken({ accessToken: '' });
    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_ID, '');
    try {
      await axios({
        method: 'POST',
        baseURL: API_BASE_URL,
        url: '/auth/logout',
        withCredentials: true,
      });
    } catch {}

    push('/');
  };

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

      <Flex flex="1" pt="4" flexDirection="column" alignItems="center">
        <Tooltip label="Todo" fontSize="sm" placement="auto-start">
          <chakra.span>
            <Icon
              as={FcTodoList}
              w="30px"
              h="30px"
              borderRadius="3px"
              boxShadow="1px 1px 3px 1px rgba(0, 0, 0, 0.25)"
              _hover={{ cursor: 'pointer' }}
              onClick={handleNavigateTodo}
            />
          </chakra.span>
        </Tooltip>
        <Tooltip label="Analysis" fontSize="sm" placement="right-end">
          <chakra.span>
            <Icon
              as={FcAreaChart}
              w="32px"
              h="32px"
              mt="5"
              borderRadius="3px"
              boxShadow="1px 1px 3px 1px rgba(0, 0, 0, 0.25)"
              _hover={{ cursor: 'pointer' }}
              onClick={handleNavigateAnalysis}
            />
          </chakra.span>
        </Tooltip>
      </Flex>

      <Divider w="80%" />
      <Menu placement="right-start">
        <MenuButton>
          <Avatar name={placeholder} src={avatar} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleNavigateProfile} icon={<FaUser />}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleSignOut} icon={<FaSignOutAlt />}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
