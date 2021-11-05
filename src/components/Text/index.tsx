import React from 'react';
import { theme } from '@styles/theme';
import { Obj } from '@model/index';
import styled from 'styled-components';

export interface IProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  position?: string;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  size?: number;
  weight?: number;
  backgroundColor?: string;
  color?: string;
  textDecoration?: string;
  pointer?: boolean;
  opacity?: number;
  center?: boolean;
}

const Text = (props: IProps) => {
  return <Container {...props}>{props.children}</Container>;
};

const Container = styled.div<IProps>`
  box-sizing: border-box;
  position: ${(props) => props.position && props.position};
  top: ${(props) => props.top && `${props.top}px`};
  right: ${(props) => props.right && `${props.right}px`};
  bottom: ${(props) => props.bottom && `${props.bottom}px`};
  left: ${(props) => props.left && `${props.left}px`};
  width: ${(props) => props.width && props.width};
  height: ${(props) => props.height && props.height};
  margin: ${(props) => props.margin && props.margin};
  padding: ${(props) => props.padding && props.padding};
  background-color: ${(props) =>
    props.backgroundColor && props.backgroundColor};
  color: ${(props) => props.color && props.color};
  text-decoration: ${(props) => props.textDecoration && props.textDecoration};
  cursor: ${(props) => (props.pointer ? 'pointer' : 'static')};
  opacity: ${(props) => props.opacity && props.opacity};
  white-space: pre-wrap;
  text-align: ${(props) => (props.center ? 'center' : '')};
`;

export const TextH1B = styled(Text)`
  font-size: 24px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 38px;
`;

export const TextH2B = styled(Text)`
  font-size: 20px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 30px;
`;

export const TextH3B = styled(Text)`
  font-size: 18px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 26px;
`;

export const TextH4B = styled(Text)`
  font-size: 16px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 24px;
`;

export const TextH5B = styled(Text)`
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 24px;
`;

export const TextH6B = styled(Text)`
  font-size: 12px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 18px;
`;

export const TextH7B = styled(Text)`
  font-size: 10px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 16px;
`;

export const TextB1R = styled(Text)`
  font-size: 16px;
  letter-spacing: -0.4px;
  font-weight: normal;
  line-height: 24px;
`;

export const TextB2R = styled(Text)`
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: normal;
  line-height: 24px;
`;
export const TextB3R = styled(Text)`
  font-size: 12px;
  letter-spacing: -0.4px;
  font-weight: normal;
  line-height: 18px;
`;
export const TextB4R = styled(Text)`
  font-size: 10px;
  letter-spacing: -0.4px;
  font-weight: normal;
  line-height: 16px;
`;

export default Text;
