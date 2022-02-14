import React from 'react';
import styled from 'styled-components';
import { TextH1B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';

const FinishPage = () => {
  const router = useRouter();
  const { type } = router.query;

  const text = {
    privateTitle: '프코스팟 신청이\n완료되었어요!',
    privateDesc:
      '프코스팟이 오픈되면, 배송비 무료로 2주 동안\n같이 이용할 5명과 마음껏 이용해 보세요!',
    publicTitle: '내가 자주 가는 장소로\n프코스팟 신청이 완료되었어요',
    publickDesc:
      '내가 자주 가는 장소로 참여하기가 100회가 되면\n오픈될 확률이 높아져요.',
    ownerTitle: '내 가게 프코스팟\n신청이 완료되었어요.',
    ownerDesc:
      '신청 내용 환인 후 프코매니터가 2~3일 이내 연락드릴거에요!\n조금만 기다려주세요!',
  };

  const mainText = () => {
    switch (type) {
      case 'private': {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc };
      }
      case 'public': {
        return { textTitle: text.publicTitle, textDesc: text.publickDesc };
      }
      case 'owner': {
        return { textTitle: text.ownerTitle, textDesc: text.ownerDesc };
      }
      default: {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc };
      }
    }
  };

  return (
    <Container>
      <TopWrapper>
        <TextH1B margin="0 0 20px 0">{mainText().textTitle}</TextH1B>
        <TextB2R color={theme.greyScale65}>{mainText().textDesc}</TextB2R>
      </TopWrapper>
      <ImgContent />
      {type !== 'public' && (
        <OpenTipWrapper>
          <TextH5B padding="48px 24px 16px 24px">프코스팟 오픈 TIP!</TextH5B>
          <BannerWrapper>
              <TextH5B>프코스팟 이용방법 및 혜택 알아보기</TextH5B>
          </BannerWrapper>
        </OpenTipWrapper>
      )}
      {type === 'owner' && (
        <ChannelIokWrapper>
          <TextH5B margin="0 0 24px 0">프코스팟 운영 관련 문의해요</TextH5B>
          <Button backgroundColor={theme.white} color={theme.black} border>
            채팅 문의
          </Button>
        </ChannelIokWrapper>
      )}
    </Container>
  );
};

const Container = styled.main``;

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
`;

const ChannelIokWrapper = styled.div`
  padding: 0 24px;
  margin-top: 48px;
`;

export default FinishPage;
