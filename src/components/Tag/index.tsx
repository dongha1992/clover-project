import React from 'react';
import styled from 'styled-components';
import { TextH7B } from '@components/Text';
import { theme } from '@styles/theme';

export interface ITagProps {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  children: React.ReactNode;
}

export const Tag = ({
  padding,
  margin,
  backgroundColor = theme.greyScale6,
  color = theme.greyScale45,
  children,
}: ITagProps) => {
  return (
    <Container
      padding={padding}
      margin={margin}
      backgroundColor={backgroundColor}
      color={color}
    >
      {children}
    </Container>
  );
};

const Container = styled(TextH7B)<ITagProps>`
  display: inline-block;
  padding: ${(props) => (props.padding ? props.padding : '4px 8px')};
  margin: ${(props) => (props.margin ? props.margin : '0px 8px 8px 0px')};
  border-radius: 4px;
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  color: ${(props) => props.color && props.color};
`;
