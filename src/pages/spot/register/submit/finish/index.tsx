import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB3R, TextH5B } from '@components/Shared/Text';
import { theme, fixedBottom } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import { spotSelector } from '@store/spot';
import { useSelector } from 'react-redux';

const FinishPage = () => {
  const router = useRouter();
  const { type } = router.query;
  const { spotRegistrationsPostResult } = useSelector(spotSelector);

  const goToSpotNotice = ():void => {
    router.push('/spot/notice');
  };

  const goToSpotStatusDetail = () => {
    router.push(`/mypage/spot-status/detail/${spotRegistrationsPostResult?.id}`);
  };

  const msgMapper = () => {
    switch(type){
      case 'PRIVATE': 
        return {
          title: '프코스팟 신청이\n완료되었어요!',
          subTitle: '프코스팟이 오픈되면, 배송비 무료로 2주 동안\n같이 이용할  5명과 마음껏 이용해보세요!',    
        }
      case 'PUBLIC':
        return {
          title: '내가 자주 가는 장소로\n프코스팟 신청이 완료되었어요',
          subTitle: '내가 자주 가는 장소로 참여하기가 100회가 되면\n오픈될 확률이 높아져요.',    
        }
      case 'OWNER':
        return {
          title: '내 가게 프코스팟\n신청이 완료되었어요.',
          subTitle: '신청 내용 확인 후 프코매니저가 2~3일 이내 연락드릴거에요!\n조금만 기다려주세요!',    
        }
    }
  };

  return (
    <Container>
      <TopWrapper>
        <TextH2B margin="0 0 20px 0">{msgMapper()?.title}</TextH2B>
        <TextB3R color={theme.greyScale65}>{msgMapper()?.subTitle}</TextB3R>
      </TopWrapper>
      <ImgContent />
      {
        type !== 'PUBLIC' && (
          <OpenTipWrapper>
            <TextH5B padding="48px 24px 16px 24px">프코스팟 오픈 TIP!</TextH5B>
            <BannerWrapper onClick={goToSpotNotice}>
                <TextH5B>프코스팟 이용방법 및 혜택 알아보기</TextH5B>
            </BannerWrapper>
          </OpenTipWrapper>
        )
      }
      {
        type === 'OWNER' && (
          <ChannelIokWrapper>
            <TextH5B padding="0 0 16px 0">프코스팟 운영 관련 문의해요</TextH5B>
            <Button pointer backgroundColor={theme.white} color={theme.black} border borderRadius="8">
              채팅 문의
            </Button>
          </ChannelIokWrapper>
        )
      }
      <FixedButton onClick={goToSpotStatusDetail}>
        <Button borderRadius="0" padding="10px 0 0 0">
          신청 현황 확인하기
        </Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.main``;

const FixedButton = styled.section`
  ${fixedBottom}
`;

const TopWrapper = styled.div`
  padding: 24px 24px 0 24px;
`;
const ImgContent = styled.div`
  width: 100%;
  height: 130px;
  background: ${theme.greyScale25};
  margin-top: 48px;
`;

const OpenTipWrapper = styled.div`
`;

const BannerWrapper = styled.div`
  height: 96px;
  padding: 16px 24px;
  margin-bottom: 8px;
  background: ${theme.greyScale25};
  cursor: pointer;
`;

const ChannelIokWrapper = styled.div`
  padding: 0 24px;
  margin-top: 48px;
`;

export default FinishPage;
