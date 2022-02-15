import React from 'react';
import styled from 'styled-components';
import { TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';

export interface ITagProps {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  width?: string;
  center?: boolean;
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
  center,
  width,
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
      width={width}
      center={center}
    >
      {children}
    </Container>
  );
};

const Container = styled(TextH7B)<ITagProps>`
  display: inline-block;
  width: ${(props) => props.width && props.width};
  padding: ${(props) => (props.padding ? props.padding : '4px 8px')};
  margin: ${(props) => props.margin && props.margin};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 4)}px;
  background-color: ${(props) => props.backgroundColor && props.backgroundColor};
  color: ${(props) => props.color && props.color};
  text-align: ${(props) => props.center && 'center'};
`;

export default React.memo(Tag);
