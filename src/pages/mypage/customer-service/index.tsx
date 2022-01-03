import { homePadding } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { MypageMenu } from '../index';
import Button from '@components/Shared/Button';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { FlexCol, theme, fixedBottom } from '@styles/theme';

const customServicePage = () => {
  return (
    <Container>
      <PaddingWrapper>
        <MypageMenu title="공지사항" link="/mypage" />
        <MypageMenu title="FAQ" link="/mypage" />
      </PaddingWrapper>
      <FlexCol margin="0">
        <TextH5B>고객센터</TextH5B>
        <TimeInfoWrapper>
          <TextB2R color={theme.greyScale65}>
            평일 9:00 - 18:00 (점심시간 13:00 - 14:00)
          </TextB2R>
          <TextB2R color={theme.greyScale65}>
            토요일 9:00 - 13:00 (홈페이지 채팅문의만 운영)
          </TextB2R>
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
  ${homePadding}
  display: flex;
  flex-direction: column;
  height: 85vh;
  justify-content: space-between;
`;

const PaddingWrapper = styled.div`
  padding-top: 24px;
`;

const TimeInfoWrapper = styled.div`
  margin-top: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 19px;
`;

export default customServicePage;
