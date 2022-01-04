import React, { useState } from 'react';
import { FlexBetween, FlexCol, homePadding } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextB1R } from '@components/Shared/Text';
import { ToggleButton } from '@components/Shared/Button';

const SettingPage = () => {
  const [isNotiOn, setIsNotiOn] = useState(false);
  const [isEmailNotiOn, setIsEmailNotiOn] = useState(false);
  const [isSMSNotiOn, setIsSMSNotiOn] = useState(false);

  return (
    <Container>
      <Wrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>마케팅/이벤트 알림</TextH4B>
          <ToggleButton
            onChange={() => setIsNotiOn(!isNotiOn)}
            status={isNotiOn}
          />
        </FlexBetween>
        {!isNotiOn && (
          <FlexCol margin="26px 0 0 0">
            <FlexBetween padding="0 0 18px 0">
              <TextB1R>이메일</TextB1R>
              <ToggleButton
                onChange={() => setIsEmailNotiOn(!isEmailNotiOn)}
                status={isEmailNotiOn}
              />
            </FlexBetween>
            <FlexBetween>
              <TextB1R>SMS</TextB1R>
              <ToggleButton
                onChange={() => setIsSMSNotiOn(!isSMSNotiOn)}
                status={isSMSNotiOn}
              />
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
export default SettingPage;
