import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Obj } from '@model/index';
import debounce from 'lodash-es/debounce';
import SVGIcon from '@utils/SVGIcon';
import { textBody2 } from '@styles/theme';

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'text'
  | 'url'
  | 'week';

export interface ITextFieldProps {
  eventHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStateAction?: React.Dispatch<React.SetStateAction<string>>;
  keyPressHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: boolean;
  inputType?: InputType;
  placeholder?: string;
  name?: string;
  value?: string;
  width?: string;
  height?: string;
  size?: string;
  style?: Obj;
  search?: boolean;
  padding?: string;
  svg?: string;
}

const defaultProps = {
  width: '100%',
  height: '48px',
  name: 'input',
  padding: '12px 16px',
  inputType: 'string',
  style: { minWidth: 312 },
};

function TextInput({
  eventHandler,
  keyPressHandler,
  setStateAction,
  inputType,
  placeholder,
  name,
  value,
  width,
  height,
  size,
  style,
  search,
  padding,
  svg,
}: ITextFieldProps) {
  const debounceChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    eventHandler && eventHandler(e);
  };

  const debounceSetStateValue = useRef(
    debounce((value) => setStateAction && setStateAction(value), 500)
  ).current;

  return (
    <Container
      width={width}
      height={height}
      size={size}
      search={search ?? false}
      style={style}
      padding={padding}
      svg={svg}
    >
      <div className="wrapper">
        {svg ? <SVGIcon name={svg} /> : ''}
        <input
          style={style}
          type={inputType ? inputType : 'string'}
          defaultValue={value}
          onChange={(e) =>
            eventHandler
              ? debounceChangeEvent(e)
              : debounceSetStateValue(e.target.value)
          }
          placeholder={placeholder}
          name={name}
          onKeyPress={keyPressHandler}
        />
      </div>
    </Container>
  );
}

TextInput.defaultProps = defaultProps as ITextFieldProps;

const Container = styled.div<{
  width?: string;
  height?: string;
  size?: string;
  search?: boolean;
  style?: Obj;
  padding?: string;
  svg?: string;
}>`
  position: relative;
  margin: 5px 0;

  ${({ search }) =>
    search &&
    css`
      background-color: #ffffff1d;
      backdrop-filter: blur(5px);
    `}

  .wrapper {
    svg {
      position: absolute;
      left: 16px;
      top: 12px;
    }
    input {
      width: ${({ width }) => width};
      height: ${({ height }) => height};
      size: ${({ size }) => size};
      padding: ${({ padding }) => padding};
      padding-left: ${({ svg }) => (svg ? 48 : 12)}px;
      ${({ size, search }) => search && `size: calc(${size} + 1rem)`};
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      outline: none;
      cursor: text;
      ${({ search }) =>
        search &&
        css`
          background-color: #ffffff1d;
          backdrop-filter: blur(5px);
        `};
    }

    input::placeholder {
      ${textBody2}
      position: absolute;
      color: ${({ theme }) => theme.greyScale45};
      padding-left: 8px;
    }
  }
`;

export default React.memo(TextInput);
