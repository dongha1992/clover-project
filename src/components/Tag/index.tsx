import React from 'react';
import styled from 'styled-components';
import { TextH7B } from '@components/Text';
import { theme } from '@styles/theme';

export interface ITagProps {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

const Tag = ({
  padding,
  margin,
  backgroundColor = theme.greyScale6,
  color = theme.greyScale45,
  children,
  borderRadius,
  onClick,
}: ITagProps) => {
  return (
    <Container
      padding={padding}
      margin={margin}
      backgroundColor={backgroundColor}
      color={color}
      onClick={onClick}
      borderRadius={borderRadius}
    >
      {children}
    </Container>
  );
};

const Container = styled(TextH7B)<ITagProps>`
  display: inline-block;
  padding: ${(props) => (props.padding ? props.padding : '4px 8px')};
  margin: ${(props) => (props.margin ? props.margin : '0px 8px 8px 0px')};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 4)}px;
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  color: ${(props) => props.color && props.color};
`;

export default React.memo(Tag);
