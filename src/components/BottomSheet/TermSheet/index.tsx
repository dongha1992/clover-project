import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button';
import { IVersion } from '@model/index';

interface IProps {
  title: string;
  versions: IVersion[];
  currentVersion: number;
}

const TermSheet = ({ title, versions, currentVersion }: IProps) => {
  const [selectedVersion, setSelectedVersion] =
    useState<number>(currentVersion);
  console.log(versions, 'versions');

  const changeRadioHandler = (id: number) => {
    setSelectedVersion(id);
  };

  versions = versions.slice().reverse();

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {title}
        </TextH5B>
        {versions.map((version: IVersion, index: number) => {
          const formatDate = version.startedAt.split(' ')[0];
          const isSelected = selectedVersion === version.version;
          return (
            <PickWrapper key={index}>
              <RadioButton
                onChange={() => changeRadioHandler(version.version)}
                isSelected={isSelected}
              />
              {isSelected ? (
                <TextH5B padding="0 0 0 8px">{formatDate} (현재)</TextH5B>
              ) : (
                <TextB2R padding="0 0 0 8px">{formatDate}</TextB2R>
              )}
            </PickWrapper>
          );
        })}
      </Wrapper>
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

export default TermSheet;
