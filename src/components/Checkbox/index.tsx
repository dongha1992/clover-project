import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled, { css } from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';

type TProps = {
  item?: any;
  onChange: React.MouseEventHandler<HTMLElement>;
};

/* TODO: 체크박스 다시 */

function Checkbox({ item, onChange }: TProps) {
  return (
    <CheckboxContainer onClick={onChange}>
      {/* {item.isChecked ? (
        <SVGIcon name="checkedRectBox" />
      ) : (
        <SVGIcon name="uncheckedRectBox" />
      )} */}
      <TextWrapper>
        {/* {isAllCheck ? (
          <TextH5B>{item.text}</TextH5B>
        ) : (
          <TextB2R>{item.text}</TextB2R>
        )} */}
      </TextWrapper>
    </CheckboxContainer>
  );
}

export default React.memo(Checkbox);

const CheckboxContainer = styled.div`
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TextWrapper = styled.div`
  margin-left: 8px;
`;

// const CheckboxContainer = styled.label<{ isChecked: boolean }>`
//   padding: 3px;
//   display: block;
//   position: relative;
//   width: 20px;
//   height: 20px;
//   box-sizing: border-box;
//   border: 1px solid #e4e4e4;
//   border-radius: 8px;
//   cursor: pointer;

//   font-size: 0;
//   -webkit-tap-highlight-color: transparent;

//   ${({ isChecked }) => {
//     if (isChecked) {
//       return css`
//         background-color: #35ad73;
//       `;
//     }
//   }}
// `;

// const InputBox = styled.input`
//   position: absolute;
//   width: 0;
//   height: 0;
//   overflow: hidden;
//   opacity: 0;
// `;

// const SVGContainer = styled.span<{ isChecked: boolean }>`
//   display: block;
//   width: 100%;
//   height: 100%;
//   box-sizing: border-box;

//   > svg {
//     color: #e7e7e7;
//     transition: color $speed-form-focus ease-out;

//     ${({ isChecked }) => {
//       if (isChecked) {
//         return css`
//           color: white;
//         `;
//       }
//     }}
//   }
// `;
