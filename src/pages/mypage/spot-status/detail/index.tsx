import React from 'react';
import styled from 'styled-components';
import { theme, FlexBetween } from '@styles/theme';
import { TextH2B, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import SVGIcon from '@utils/SVGIcon';

const SpotStatusDetailPage = () => {
    const PLAN_GUIDE = [
        '프코매니저 검토중 아래 사항에 해당하는 경우 오픈이 미진행될 수 있습니다.',
        '•해당 장소에 동일 회사의 스팟이 있는 경우',
        '•회사를 장소명으로 썼지만 그 회사가 코워킹 스페이스 입주사인 경우',
        '•회사, 학교가 아닌 가정집인 경우',
        '•프라이빗 스팟의 경우 트라이얼 기간동안 5명 이상의 주문이 발생하지 않은 경우',
        '•프코스팟 단골가게의 경우 참여인원 100명을 모집하지 못한 경우',
    ];

    return (
        <Container>
          <TopStatusWrapper>
            <Flex>
            <Tag color={theme.brandColor} backgroundColor={theme.brandColor5} margin='0 4px 0 0'>프라이빗</Tag>
            <Tag>트라이얼 진행중</Tag>
            </Flex>
            <TextH2B margin='0 0 4px 0'>노스테라스 카페</TextH2B>
            <TextB3R>서울 성동구 왕십리로 115 10층</TextB3R>
          </TopStatusWrapper>
          <StatusBoradWrapper>
            <TextH4B  margin='0 0 16px 0'>{`STEP3.\n신청한 스팟으로 5명 모집해주세요!`}</TextH4B>
            <TextB3R>{`5명 이상 주문하면 프코스팟 정식 오픈돼요\n주변 프코회원들에게 스팟을 공유해보세요!`}</TextB3R>
            <ProgressContent>
            </ProgressContent>
          </StatusBoradWrapper>
          <ToggleWrapper>
            <FlexBetween padding='24px'>
              <TextH4B>장소 정보</TextH4B>
              <SVGIcon name='triangleDown' />
            </FlexBetween>
          </ToggleWrapper>
          <Row />
          <ToggleWrapper>
            <FlexBetween padding='24px'>
              <TextH4B>신청자 정보</TextH4B>
              <SVGIcon name='triangleDown' />
            </FlexBetween>
          </ToggleWrapper>
          <Row />
          <ToggleWrapper>
            <FlexBetween padding='24px'>
              <TextH4B>프라이빗 프코스팟 오픈방법 알아보기</TextH4B>
              <SVGIcon name='triangleDown' />
            </FlexBetween>
          </ToggleWrapper>

          <FooterWrapper>
            <TextH5B color={theme.greyScale65} margin='0 0 33px 0'>프코스팟 오픈 관련 유의사항</TextH5B>
            {
                PLAN_GUIDE.map((item, index)=>{
                   return <TextB3R key={index} color={theme.greyScale65} margin='0 0 4px 0'>{item}</TextB3R>
                })
            }
            <Button margin='24px 0 20px 0' border color={theme.black} backgroundColor={theme.white}>채팅 문의</Button>
          </FooterWrapper>
        </Container>
    )
};

const Container = styled.div``;

const TopStatusWrapper = styled.section`
  padding: 24px; 
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px; 
`;

const StatusBoradWrapper = styled.section`
  width: 100%;
  background: ${theme.brandColor};
  color: ${theme.white};
  padding: 24px;
`;

const ProgressContent = styled.div`
  height: 130px;
  background: ${theme.white};
`;

const ToggleWrapper = styled.section`
 cursor: pointer;
`;

const Row = styled.div`
  border-bottom: 10px solid ${theme.greyScale6};
`;

const FooterWrapper= styled.section`
  background: ${theme.greyScale3};
  padding: 24px;
`;
export default SpotStatusDetailPage;
