import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH2B, TextH3B } from '@components/Shared/Text';
import { theme, fixedBottom, homePadding } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  INIT_SPOT_LOCATION, 
  INIT_SPOT_REGISTRATIONS_OPTIONS, 
  SET_SPOT_REGISTRATIONS_INFO, 
  ISpotsRegistrationInfo,
  INIT_SPOT_JOIN_FORM_CHECKED,
} from '@store/spot';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';
import { ISpotsInfo } from '@model/index';
import { getSpotInfo } from '@api/spot';

const SpotReqPage = () => {
  const router = useRouter();
  const { join } = router.query;
  const { me, isLoginSuccess } = useSelector(userForm);
  const dispatch = useDispatch();
  const [info, setInfo] = useState<ISpotsInfo>();
  const [spotCount, setSpotCount] = useState<number>(0);
  const text = {
    privateText: '나의 회사•학교를\n프코스팟으로 만들어 보세요!',
    privateDesc: '나의 간편건강식을 점심,저녁에\n배송비 무료로 픽업해요!',
    publicText: '내가 자주 가는 장소를\n프코스팟으로 만들어보세요!',
    publicDesc: '매일 가는 카페, 피트니스, 서점 등\n그 어떤 곳이든 프코스팟이 될 수 있어요!',
    ownerText: `${spotCount! + 1}번째 프코스팟의\n파트너가 되어보세요.`,
    ownerDesc: '프레시코드와 함께\n내 단골 고객을 늘려보세요!',
    askText: '프코스팟 신청이 어려우신가요?',
    askBtnText: '채팅 문의',
    registerBtn: '프코스팟 신청하기',
  };
  const { type } = router.query;
  const mainText = () => {
    switch (type) {
      case 'PRIVATE': {
        return { textTitle: text.privateText, textDesc: text.privateDesc };
      }
      case 'PUBLIC': {
        return { textTitle: text.publicText, textDesc: text.publicDesc };
      }
      case 'OWNER': {
        return { textTitle: text.ownerText, textDesc: text.ownerDesc };
      }
    }
  };
  const goToRegister = () => {
    if (isLoginSuccess) {
      // join 링크등 다른 경로로 들어온 경우 ture
      if(join &&((type === 'PRIVATE' && !info?.canPrivateSpotRegistration) || (type === 'PUBLIC' && !info?.canPublicSpotRegistraion) || (type === 'OWNER' && !info?.canOwnerSpotRegistraion))){
       return (
        dispatch(
          SET_ALERT({
            alertMessage: '이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.',
            submitBtnText: '확인',
          })
        )
       )  
      };
      const spotsRegistrationInfoState: ISpotsRegistrationInfo = {
        userName: me?.name!,
        userEmail: me?.email!,
        userTel: me?.tel!,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(spotsRegistrationInfoState));
      dispatch(INIT_SPOT_LOCATION());
      dispatch(INIT_SPOT_REGISTRATIONS_OPTIONS());
      dispatch(INIT_SPOT_JOIN_FORM_CHECKED());
      router.push({
        pathname: '/spot/join/main/form',
        query: { type },
      });  
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  useEffect(() => {
     // 스팟 정보 조회
    const getFetch = async() => {
      try {
        const { data } = await getSpotInfo();
        setSpotCount(data.data.spotCount);
        setInfo(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getFetch();
  }, [])

  return (
    <Container>
      <TopWrapper>
        <TextH2B padding='24px 0 24px 0'>{mainText()?.textTitle}</TextH2B>
        <TextB3R padding="0 0 48px 0" color={theme.greyScale65}>
          {mainText()?.textDesc}
        </TextB3R>
      </TopWrapper>
      <GuideWrapper>
        <Guide></Guide>
      </GuideWrapper>
      <BottomWrapper>
        <BtnWrapper>
          {/* TODO 채널톡 작업 */}
          <TextH3B padding="48px 0 24px 0">{text.askText}</TextH3B>
          <Button pointer backgroundColor={theme.white} color={theme.black} border borderRadius="8">
            {text.askBtnText}
          </Button>
        </BtnWrapper>
      </BottomWrapper>
      <FixedButton onClick={goToRegister}>
        <Button borderRadius="0" padding="10px 0 0 0">
          {text.registerBtn}
        </Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.div``;
const TopWrapper = styled.section`
  ${homePadding};
`;

const GuideWrapper = styled.section`
  width: 100%;
  height: 412px;
  background: ${theme.greyScale25};
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
