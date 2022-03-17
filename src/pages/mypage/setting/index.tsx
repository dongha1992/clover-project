import React, { useState } from 'react';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextB1R, TextB2R } from '@components/Shared/Text';
import { ToggleButton } from '@components/Shared/Button';

const SettingPage = () => {
  const [isNotiOn, setIsNotiOn] = useState(false);
  const [isImportNotiOn, setIsImportNotiOn] = useState(false);
  const [isActivityOn, setIsActivityOn] = useState(false);
  const [isEmailNotiOn, setIsEmailNotiOn] = useState(false);
  const [isSMSNotiOn, setIsSMSNotiOn] = useState(false);

  return (
    <Container>
      <Wrapper>
        <ListBox>
          <ListItem>
            <FlexBetween>
              <TextH4B>중요 알림</TextH4B>
              <ToggleButton onChange={() => setIsImportNotiOn(!isImportNotiOn)} status={isImportNotiOn} />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>상품 주문/배송/픽업/재입고/구독 알림</TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>활동 알림</TextH4B>
              <ToggleButton onChange={() => setIsActivityOn(!isActivityOn)} status={isActivityOn} />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>후기/스팟/친구초대 활동 알림</TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>마케팅/이벤트 알림</TextH4B>
              <ToggleButton onChange={() => setIsNotiOn(!isNotiOn)} status={isNotiOn} />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>마케팅 정보 수신 해제 YYYY-MM-DD</TextB2R>
          </ListItem>
        </ListBox>

        {!isNotiOn && (
          <FlexCol>
            <FlexBetween padding="0 0 18px 0">
              <TextB1R>이메일</TextB1R>
              <ToggleButton onChange={() => setIsEmailNotiOn(!isEmailNotiOn)} status={isEmailNotiOn} />
            </FlexBetween>
            <FlexBetween>
              <TextB1R>SMS</TextB1R>
              <ToggleButton onChange={() => setIsSMSNotiOn(!isSMSNotiOn)} status={isSMSNotiOn} />
            </FlexBetween>
          </FlexCol>
        )}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  ${homePadding}
`;

const ListBox = styled.ul``;
const ListItem = styled.li`
  padding: 24px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
`;
export default SettingPage;
