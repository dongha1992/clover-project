import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import SVGIcon from '@utils/SVGIcon';

const FinishPage = () => {
  const router = useRouter();
  const { type } = router.query;

  const text = {
    privateTitle: '프코스팟 신청이\n완료되었어요!',
    privateDesc:
      '프코스팟이 오픈되면, 배송비 무료로 2주 동안\n같이 이용할 5명과 마음껏 이용해 보세요!',
    publicTitle: '내가 자주가는 장소로\n프코스팟 신청이 완료되었어요',
    publickDesc:
      '내가 자주 가는 장소로 참여하기가 100회가 되면\n오픈될 확률이 높아져요.',
    normalTitle: '내 가게 프코스팟 신청이 완료되었어요.',
    normalDesc:
      '신청 내용 환인 후 프코매니터가\n전화 및 방문해주실거예요. 조금만 기다려주세요!',
  };

  const mainText = () => {
    switch (type) {
      case 'private': {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc };
      }
      case 'public': {
        return { textTitle: text.publicTitle, textDesc: text.publickDesc };
      }
      case 'normal': {
        return { textTitle: text.normalTitle, textDesc: text.normalDesc };
      }
      default: {
        return { textTitle: text.privateTitle, textDesc: text.privateDesc };
      }
    }
  };

  return (
    <Container>
      <TextH2B margin="0 0 20px 0">{mainText().textTitle}</TextH2B>
      <TextB2R color={theme.greyScale65}>{mainText().textDesc}</TextB2R>
      <ConTent />
      {type !== 'public' && (
        <OpenTipWrapper>
          <TextH5B margin="0 0 16px 0">프코스팟 오픈 TIP!</TextH5B>
          <BtnWrapper>
            <FlexBetween>
              <TextH5B>프코스팟 이용방법 및 혜택 알아보기</TextH5B>
              <IconWrapper>
                <SVGIcon name="blackCircleShare" />
              </IconWrapper>
            </FlexBetween>
          </BtnWrapper>
        </OpenTipWrapper>
      )}
      {type === 'normal' && (
        <>
          <Row />
          <ChannelIokWrapper>
            <TextH5B margin="0 0 24px 0">프코스팟 운영 관련 문의해요</TextH5B>
            <Button backgroundColor={theme.white} color={theme.black} border>
              채팅 문의
            </Button>
          </ChannelIokWrapper>
        </>
      )}
    </Container>
  );
};

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
  margin: 48px 0 0 0;
`;

const BtnWrapper = styled.div`
  padding: 16px 24px;
  margin-bottom: 8px;
  background: ${theme.greyScale3};
  border-radius: 8px;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: ${theme.black};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px 0px #00000033;
`;

const Row = styled.div`
  width: 100%;
  border-top: 1px solid ${theme.greyScale6};
  margin: 32px 0 24px 0;
`;

const ChannelIokWrapper = styled.section``;

export default FinishPage;
