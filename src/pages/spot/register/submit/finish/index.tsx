import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';

function FinishPage() {
  const router = useRouter();
  const { type } = router.query;

  const text = {
    privateTitle: '프코스팟 신청이\n완료되었어요!',
    privateDesc: '프코스팟이 오픈되면, 배송비 무료로 2주 동안\n같이 이용할 5명과 마음껏 이용해 보세요!',
    publicTitle: '단골가게 프코스팟\n신청을 완료했어요',
    publickDesc: '가안가안가안\n가안가안',
    normalTitle: '내 가게 프코스팟 신청이 완료되었어요.',
    normalDesc: '신청 내용 환인 후 프코매니터가\n전화 및 방문해주실거예요. 조금만 기다려주세요!'
  };

  const mainText = () => {
    switch(type){
      case 'private': {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc};
      }
      case 'public': {
        return { textTitle: text.publicTitle, textDesc: text.publickDesc};
      }
      case 'normal': {
        return { textTitle: text.normalTitle, textDesc: text.normalDesc};
      }
      default: {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc};
      }
    }
  };

  return (
    <Container>
      <TextH2B margin="0 0 20px 0">{mainText().textTitle}</TextH2B>
      <TextB2R color={theme.greyScale65}>{mainText().textDesc}</TextB2R>
      <ConTent />
      {type !== 'normal' && (
        <OpenTipWrapper>
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
        </OpenTipWrapper>
      )}
      <BottomLink></BottomLink>
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

const OpenTipWrapper = styled.section`
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

const BottomLink = styled.section`
  width: 100%; 
  height: 120px;
  background: ${theme.greyScale65};
`
export default FinishPage;
