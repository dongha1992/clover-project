import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
interface IToggleProsp {
  onChange: React.ChangeEventHandler<HTMLElement>;
  status: boolean;
}

const ToggleButton = ({ onChange, status }: IToggleProsp) => {
  return (
    <Container>
      <input type="checkbox" onChange={onChange} checked={status} />
      <Slider className="slider" />
      <Off />
      <On />
    </Container>
  );
};

const Container = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 28px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
    z-index: 1;

    &::placeholder {
      color: ${theme.black};
    }

    &:checked + .slider::before {
      transform: translateX(13px);
    }

    &:checked + .slider {
      background-color: ${theme.greyScale15};
    }
  }
`;

const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.brandColor};
  border-radius: 20px;
  cursor: pointer;
  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: ${theme.white};
    border-radius: 50%;
    transition: all 0.4s;
    cursor: pointer;
  }
`;
const Off = styled.span`
  position: absolute;
  left: 5px;
  top: 7px;
  opacity: 0.78;
  color: #ffffff;
  cursor: pointer;
`;
const On = styled.span`
  position: absolute;
  right: 10px;
  top: 7px;
  opacity: 0.78;
  color: #ffffff;
  cursor: pointer;
`;

export default ToggleButton;
