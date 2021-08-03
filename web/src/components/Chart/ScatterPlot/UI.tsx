import styled from '@emotion/styled';

type StyledLabelProps = {
  fontSize: string;
};

export const StyledSvg = styled.svg`
  user-select: none;
`;

export const StyledLine = styled.line`
  stroke: #c5c4c4;
`;

export const StyledText = styled.text`
  fill: #616161;
`;

export const StyledCircle = styled.circle`
  fill: #137b80;
`;

export const StyledLabel = styled.text(({ fontSize }: StyledLabelProps) => ({
  fill: '#333333',
  fontSize,
  fontWeight: 900,
}));
