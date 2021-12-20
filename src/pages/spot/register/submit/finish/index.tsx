import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';

function finish() {
  const router = useRouter();
  const { type } = router.query;

  return (
    <Container>
      <TextH2B margin="0 0 20px 0">
        {'프라이빗 스팟 신청을\n완료했어요'}
      </TextH2B>
      <TextB2R color={theme.greyScale65}>
        {'신청을 완료 했습니다.\n트라이얼 스팟 진행 후 정식 오픈하세요!'}
      </TextB2R>
      <ConTent />
      {type !== 'normal' && (
        <BottomWrapper>
          <TextH5B margin="0 0 16px 0">프코스팟 오픈 TIP!</TextH5B>
          <BtnWrapper>
            <FlexBetween>
              <TextB2R>{'프코스팟 오픈 진행사항을\n알림 받아보세요!'}</TextB2R>
              <Circle />
            </FlexBetween>
          </BtnWrapper>
          {type === 'private' && (
            <BtnWrapper>
              <FlexBetween>
                <TextB2R>
                  {'프코스팟 오픈 진행사항을\n알림 받아보세요!'}
                </TextB2R>
                <Circle />
              </FlexBetween>
            </BtnWrapper>
          )}
        </BottomWrapper>
      )}
    </Container>
  );
}

const Container = styled.main`
  padding: 24px;
`;
const ConTent = styled.section`
  width: 100%;
  height: 130px;
  background: ${theme.greyScale25};
  margin-top: 60px;
`;

const BottomWrapper = styled.section`
  margin: 59px 0 48px 0;
`;

const BtnWrapper = styled.div`
  padding: 16px 24px;
  margin-bottom: 8px;
  background: ${theme.greyScale3};
  border-radius: 8px;
`;

const Circle = styled.div`
  width: 44px;
  height: 44px;
  background: ${theme.black};
  border-radius: 50%;
`;

export default finish;
