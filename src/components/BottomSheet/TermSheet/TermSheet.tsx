import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button';
import { IVersion } from '@model/index';
import { useDispatch } from 'react-redux';
import { SET_VERSION_OF_TERM } from '@store/common';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
interface IProps {
  title: string;
  versions: IVersion[];
  currentVersion: number;
}

const TermSheet = ({ title, versions, currentVersion }: IProps) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(currentVersion);

  const dispatch = useDispatch();

  const changeRadioHandler = (id: number) => {
    setSelectedVersion(id);
  };

  const submitHandler = () => {
    dispatch(SET_VERSION_OF_TERM(selectedVersion));
    dispatch(INIT_BOTTOM_SHEET());
  };

  versions = versions.slice().reverse();

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {title}
        </TextH5B>
        {versions.map((version: IVersion, index: number) => {
          let formatDate = version.startedAt.split(' ')[0];
          const isSelected = selectedVersion === version.version;
          const isFirst = index === 0;

          if (isFirst) {
            formatDate = `${formatDate} (현재)`;
          }

          return (
            <PickWrapper key={index}>
              <RadioButton onChange={() => changeRadioHandler(version.version)} isSelected={isSelected} />

              {isSelected ? (
                <TextH5B padding="0 0 0 8px">{formatDate}</TextH5B>
              ) : (
                <TextB2R padding="0 0 0 8px">{formatDate}</TextB2R>
              )}
            </PickWrapper>
          );
        })}
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          선택하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(TermSheet);
