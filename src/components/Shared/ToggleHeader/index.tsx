import React from 'react';
import { bottomSheetButton, FlexCol, FlexRow, FlexBetween, theme } from '@styles/theme';
import { TextH4B, TextH7B, TextB4R, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';

interface IProps {
  isToggle: boolean;
  setIsToggle: (title: string) => void;
  text: string;
}
const ToggleHeader = ({ text, isToggle, setIsToggle }: IProps) => {
  return (
    <FlexBetween padding="16px 0" onClick={() => setIsToggle(text)} pointer>
      <TextB2R>{text}</TextB2R>
      <FlexRow>
        <SVGIcon name={isToggle ? 'triangleUp' : 'triangleDown'} />
      </FlexRow>
    </FlexBetween>
  );
};

export default ToggleHeader;
