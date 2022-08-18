import { homePadding } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { MypageMenu } from '../index';
import { Button } from '@components/Shared/Button';
import { TextH5B, TextB2R, TextH4B } from '@components/Shared/Text';
import { FlexCol, theme, FlexBetween, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';

const customServicePage = () => {
  const goToLink = (link: string) => {
    // TODO: ios, 안드로이드, window 나눠야함
    window.open(link, '_blank');
  };
  return (
    <Container>
      <PaddingWrapper>
        <MypageItem onClick={() => goToLink('https://freshcode.notion.site/FAQ-ca6ff2c62f1141be9c1e60f95ac3424d')}>
          <FlexBetween padding="24px 0">
            <TextH4B>FAQ</TextH4B>
            <FlexRow>
              <div>
                <SVGIcon name="arrowRight" />
              </div>
            </FlexRow>
          </FlexBetween>
        </MypageItem>
        <MypageItem onClick={() => goToLink('https://bit.ly/fco_partnership')}>
          <FlexBetween padding="24px 0">
            <TextH4B>기업제휴</TextH4B>
            <FlexRow>
              <div>
                <SVGIcon name="arrowRight" />
              </div>
            </FlexRow>
          </FlexBetween>
        </MypageItem>
      </PaddingWrapper>
      <FlexCol margin="0" padding="0 24px">
        <TextH5B>고객센터</TextH5B>
        <TimeInfoWrapper>
          <TextB2R color={theme.greyScale65}>평일 9:00 - 18:00 (점심시간 13:00 - 14:00)</TextB2R>
          <TextB2R color={theme.greyScale65}>토요일 9:00 - 13:00 (홈페이지 채팅문의만 운영)</TextB2R>
          <TextB2R color={theme.greyScale65}>공휴일 휴무</TextB2R>
        </TimeInfoWrapper>
        <ButtonWrapper>
          <Button width="148px">채팅문의</Button>
        </ButtonWrapper>
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 85vh;
  justify-content: space-between;
`;

const PaddingWrapper = styled.div``;

const TimeInfoWrapper = styled.div`
  margin-top: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 19px;
`;

const MypageItem = styled.a`
  cursor: pointer;
  padding: 0 24px;
  list-style: none;
  &:first-of-type > div {
    border-top: 1px solid ${theme.greyScale3};
  }
  > div {
    border-bottom: 1px solid ${theme.greyScale3};
  }
`;

export default customServicePage;
