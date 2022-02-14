import React from 'react';
import styled from 'styled-components';
import { TextH1B, TextB2R, TextH2B } from '@components/Shared/Text';
import { theme, fixedBottom, homePadding } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { 
  INIT_SPOT_LOCATION, 
  INIT_SPOT_REGISTRATIONS_OPTIONS, 
  INIT_SPOT_REGISTRATIONS_INFO,
} from '@store/spot';

const SpotReqPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const text = {
    publicText: '내가 자주 가는 장소를\n프코스팟으로 만들어보세요!',
    publicDesc: '매일 가는 카페, 피트니스, 서점 등\n그 어떤 곳이든 프코스팟이 될 수 있어요!',
    ownerText: '0000번째 프코스팟의\n파트너가 되어보세요.',
    ownerDesc: '프레시코드와 함께\n내 단골 고객을 늘려보세요!',
    fcospotText: '단골카페를 프코스팟으로',
    privateText: '나의 회사•학교를\n프코스팟으로 만들어 보세요!',
    privateDesc: '나의 간편건강식을 점심,저녁에\n배송비 무료로 픽업해요!',
    privateBtnText: '프라이빗 스팟 신청하기',
    askText: '프코스팟 신청이 어려우신가요?',
    askBtnText: '문의하기',
    registerBtn: '프코스팟 신청하기',
  };
  const { type } = router.query;
  const mainText = () => {
    switch (type) {
      case 'private': {
        return { textTitle: text.privateText, textDesc: text.privateDesc };
      }
      case 'public': {
        return { textTitle: text.publicText, textDesc: text.publicDesc };
      }
      case 'owner': {
        return { textTitle: text.ownerText, textDesc: text.ownerDesc };
      }
      default: {
        return { textTitle: text.publicText, textDesc: text.publicDesc };
      }
    }
  };

  const goToRegister = () => {
    dispatch(INIT_SPOT_LOCATION());
    dispatch(INIT_SPOT_REGISTRATIONS_OPTIONS());
    dispatch(INIT_SPOT_REGISTRATIONS_INFO());
    router.push({
      pathname: '/spot/register',
      query: { type },
    });
  };

  return (
    <Container>
      <TopWrapper>
        <TextH1B>{mainText()?.textTitle}</TextH1B>
        <TextB2R margin="33px 0 48px 0" color={theme.greyScale65}>
          {mainText()?.textDesc}
        </TextB2R>
      </TopWrapper>
      <GuideWrapper>
        <Guide></Guide>
      </GuideWrapper>
      <BottomWrapper>
        <BtnWrapper>
          {/* TODO 채널톡 작업 */}
          <TextH2B margin="0 0 24px 0">{text.askText}</TextH2B>
          <Button
            pointer
            backgroundColor={theme.white}
            color={theme.black}
            border
            borderRadius="8"
          >
            {text.askBtnText}
          </Button>
        </BtnWrapper>
      </BottomWrapper>
      <FixedButton onClick={goToRegister}>
        <Button borderRadius="0" padding='10px 0 0 0'>{text.registerBtn}</Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.main`
  padding: 24px 0;
`;
const TopWrapper = styled.section`
  ${homePadding};
`;

const GuideWrapper = styled.section`
  width: 100%;
  height: 412px;
  background: ${theme.greyScale25};
  margin-bottom: 48px;
`;

const Guide = styled.div``;

const BottomWrapper = styled.section`
  margin: 0 auto;
  ${homePadding};
`;

const BtnWrapper = styled.div``;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 32px 0;
`;
const FixedButton = styled.section`
  ${fixedBottom}
`;

export default SpotReqPage;
