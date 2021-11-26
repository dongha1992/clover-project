import { theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Text';
export interface IButtonProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  filled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  color?: string;
  backgroundColor: string;
  pointer?: boolean;
  border?: boolean;
}
const defaultProps = {
  filled: true,
  width: '100%',
  height: '52px',
  padding: '4px 0 0 0',
  backgroundColor: theme.black,
  color: theme.white,
  pointer: true,
};

const Button = (props: IButtonProps) => {
  return <Container {...props}>{props.children}</Container>;
};

Button.defaultProps = defaultProps as IButtonProps;

export const Container = styled(TextH5B)<IButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width && props.width};
  height: ${(props) => props.height && props.height};
  padding: ${(props) => props.padding && props.padding};
  margin: ${(props) => props.margin && props.margin};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 8)}px;
  color: ${(props) => props.color && props.color};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  cursor: ${(props) => (props.pointer ? 'pointer' : 'static')};
  border: ${(props) => (props.border ? '1px solid black' : '')};
  div {
    cursor: ${(props) => (props.pointer ? 'pointer' : 'static')};
  }
`;

export default Button;
