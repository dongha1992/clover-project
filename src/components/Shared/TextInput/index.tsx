import React, { useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Obj } from '@model/index';
import { SVGIcon } from '@utils/common';
import { textBody2, theme } from '@styles/theme';

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
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
  inputType?: InputType;
  placeholder?: string;
  name?: string;
  value?: string | ReadonlyArray<string> | number | undefined;
  width?: string;
  height?: string;
  size?: string;
  fontSize?: string;
  style?: Obj;
  search?: boolean;
  padding?: string;
  svg?: string;
  margin?: string;
  accept?: string;
  disabled?: boolean;
  pattern?: string;
  withValue?: boolean;
  maxLength?: number;
}

const defaultProps = {
  width: '100%',
  height: '48px',
  name: 'input',
  padding: '12px 16px',
  inputType: 'text',
};

const TextInput = React.forwardRef(
  (
    {
      eventHandler,
      keyPressHandler,
      setStateAction,
      onFocus,
      onBlur,
      inputType,
      placeholder,
      name,
      value,
      width,
      height,
      size,
      fontSize,
      style,
      search,
      padding,
      svg,
      margin,
      accept,
      disabled,
      pattern,
      withValue,
      maxLength,
    }: ITextFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      eventHandler && eventHandler(e);
    };

    return (
      <Container
        width={width}
        height={height}
        size={size}
        fontSize={fontSize}
        search={search ?? false}
        style={style}
        padding={padding}
        margin={margin}
        svg={svg}
      >
        <div className="wrapper">
          {svg ? <SVGIcon name={svg} /> : ''}
          {ref ? (
            withValue ? (
              <input
                style={style}
                type={inputType ? inputType : 'text'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                onKeyPress={keyPressHandler}
                ref={ref}
                onFocus={onFocus}
                onBlur={onBlur}
                accept={accept}
                disabled={disabled}
                pattern={pattern}
                maxLength={maxLength}
              />
            ) : (
              <input
                style={style}
                type={inputType ? inputType : 'text'}
                defaultValue={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                onKeyPress={keyPressHandler}
                ref={ref}
                onFocus={onFocus}
                onBlur={onBlur}
                accept={accept}
                disabled={disabled}
                pattern={pattern}
                maxLength={maxLength}
              />
            )
          ) : (
            <input
              style={style}
              type={inputType ? inputType : 'text'}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              name={name}
              onKeyPress={keyPressHandler}
              ref={ref}
              onFocus={onFocus}
              onBlur={onBlur}
              accept={accept}
              disabled={disabled}
              pattern={pattern}
              maxLength={maxLength}
            />
          )}
        </div>
      </Container>
    );
  }
);

TextInput.defaultProps = defaultProps as ITextFieldProps;

const Container = styled.div<{
  width?: string;
  height?: string;
  size?: string;
  fontSize?: string;
  search?: boolean;
  style?: Obj;
  padding?: string;
  svg?: string;
  margin?: string;
}>`
  position: relative;
  margin: ${({ margin }) => (margin ? margin : 0)}px;
  width: 100%;
  height: ${({ height }) => height};
  ${({ search }) =>
    search &&
    css`
      background-color: #ffffff1d;
      backdrop-filter: blur(5px);
    `}
  .wrapper {
    height: ${({ height }) => height};
    svg {
      position: absolute;
      left: 16px;
      top: 12px;
    }
    input {
      width: ${({ width }) => width};
      height: ${({ height }) => height};
      size: ${({ size }) => size};
      font-size: ${({ fontSize }) => fontSize};
      padding: ${({ padding }) => padding};
      padding-left: ${({ svg }) => (svg ? 48 : 16)}px;
      ${({ size, search }) => search && `size: calc(${size} + 1rem)`};
      border: 1px solid ${theme.greyScale15};
      border-radius: 8px;
      outline: none;
      cursor: text;
      ${({ search }) =>
        search &&
        css`
          background-color: #ffffff1d;
          backdrop-filter: blur(5px);
        `};
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    input::placeholder {
      ${textBody2}
      color: ${({ theme }) => theme.greyScale45};
    }

    input:disabled {
      background: ${theme.greyScale3};
    }
  }
`;

TextInput.displayName = 'TextInput';

export default React.memo(TextInput);
