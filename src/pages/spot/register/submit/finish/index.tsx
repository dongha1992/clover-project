import React from 'react';
import styled from 'styled-components';
import { TextH1B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, fixedBottom } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import { spotSelector } from '@store/spot';
import { useSelector } from 'react-redux';

const FinishPage = () => {
  const router = useRouter();
  const { spotRegistrationsPostResult } = useSelector(spotSelector);

  const title = `프코스팟 신청이\n완료되었어요!`;
  const desc = `프코스팟이 오픈되면, 배송비 무료로 2주 동안\n같이 이용할  5명과 마음껏 이용해보세요!`;

  const goToSpotNotice = ():void => {
    router.push('/spot/notice');
  };

  const goToSpotStatusDetail = () => {
    router.push(`/mypage/spot-status/detail/${spotRegistrationsPostResult?.id}`);
  };

  return (
    <Container>
      <TopWrapper>
        <TextH1B margin="0 0 20px 0">{title}</TextH1B>
        <TextB2R color={theme.greyScale65}>{desc}</TextB2R>
      </TopWrapper>
      <ImgContent />
      <OpenTipWrapper>
        <TextH5B padding="48px 24px 16px 24px">프코스팟 오픈 TIP!</TextH5B>
        <BannerWrapper onClick={goToSpotNotice}>
            <TextH5B>프코스팟 이용방법 및 혜택 알아보기</TextH5B>
        </BannerWrapper>
      </OpenTipWrapper>
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
