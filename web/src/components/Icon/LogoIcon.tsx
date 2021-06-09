import { Icon, IconProps } from '@chakra-ui/react';

interface LogoIconProps extends IconProps {
  onClick: () => void;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ onClick }) => (
  <Icon
    width="32px"
    height="32px"
    borderRadius="3px"
    viewBox="0 0 32 32"
    fill="none"
    boxShadow="1px 1px 3px 1px rgba(0, 0, 0, 0.25)"
    xmlns="http://www.w3.org/2000/svg"
    _hover={{
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    <rect width="32px" height="32px" fill="white" />
    <rect
      x="11.5"
      y="6.5"
      width="10.5"
      height="10.5"
      rx="0.5"
      fill="white"
      stroke="black"
      strokeLinejoin="bevel"
    />
    <line opacity="0.9" x1="11.5" y1="6" x2="11.5" y2="29" stroke="black" />
  </Icon>
);
