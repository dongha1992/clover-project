import styled from 'styled-components';
import { memo } from 'react';
import { TextH6B } from '../Text';
interface Props {
  message?: string;
  bgColor?: string;
  color?: string;
}

const TimerTooltip: React.FC<Props> = (props) => {
  return (
    <Container {...props}>
      <TextH6B margin="3px 0 0" color={props.color}>
        {props.message}
      </TextH6B>
    </Container>
  );
};
const Container = styled.div<Props>`
  width: auto;
  min-width: 128px;
  display: inline-block;
  text-align: center;
  position: absolute;
  left: 24px;
  top: -13px;
  z-index: 9;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${(props) => props.bgColor};
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -4px;
    transform: translateX(-50%);
    width: 0px;
    height: 0px;
    border-top: 4px solid ${({ theme }) => theme.brandColor};
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
  }
`;
export default memo(TimerTooltip);
