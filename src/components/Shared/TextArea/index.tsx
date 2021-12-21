import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Obj } from '@model/index';
import debounce from 'lodash-es/debounce';
import SVGIcon from '@utils/SVGIcon';
import { textBody3, theme } from '@styles/theme';

export interface ITextAreaProps {
  eventHandler?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  value?: string | number;
  width?: string;
  height?: string;
  size?: string;
  style?: Obj;
  padding?: string;
  margin?: string;
  minLength?: number;
  maxLength: number;
  rows: number;
}

const defaultProps = {
  width: '100%',
  height: '208px',
  name: 'textarea',
  padding: '16px',
};

const TextArea = React.forwardRef(
  (
    {
      eventHandler,
      placeholder,
      name,
      value,
      width,
      height,
      size,
      style,
      padding,
      margin,
      minLength,
      maxLength,
      rows,
    }: ITextAreaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    const debounceChangeEvent = debounce(
      (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        eventHandler && eventHandler(e);
      },
      10
    );

    return (
      <Container
        width={width}
        height={height}
        size={size}
        padding={padding}
        margin={margin}
      >
        <textarea
          style={style}
          defaultValue={value}
          onChange={debounceChangeEvent}
          placeholder={placeholder}
          name={name}
          ref={ref}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </Container>
    );
  }
);

TextArea.defaultProps = defaultProps as ITextAreaProps;

const Container = styled.div<{
  width?: string;
  height?: string;
  size?: string;
  style?: Obj;
  padding?: string;
  margin?: string;
}>`
  position: relative;
  margin: ${({ margin }) => margin && margin}px;
  width: 100%;

  textarea {
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    size: ${({ size }) => size};
    padding: ${({ padding }) => padding};
    border: 1px solid ${theme.greyScale15};
    border-radius: 8px;
    outline: none;
    resize: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  textarea::placeholder {
    ${textBody3}
    position: absolute;
    color: ${({ theme }) => theme.greyScale45};
  }

  &:focus {
    border: 1px solid ${theme.greyScale15};
    outline: 0;
  }
`;

export default React.memo(TextArea);
