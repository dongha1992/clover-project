import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { theme, FlexBetween } from '@styles/theme';
import { TextH2B, TextB3R, TextH4B, TextH5B, TextB2R, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { LocationInfo, OpenInfo, UserInfo, SpotStatusDetailProgressBar } from '@components/Pages/Mypage/Spot';
import { useQuery } from 'react-query';
import { getSpotsRegistrationStatusDetail } from '@api/spot';
import SlideToggle from '@components/Shared/SlideToggle';

interface IParams {
  id: number;
};

const PLAN_GUIDE = [
  {
    title: '프라이빗 프코스팟 오픈 기준에 미달인 경우',
    desc: [
      '•건물 내, 배송 출입 제한이 있을때',
      '•프코스팟 오픈 불가 지역',
      '•코워킹스페이스 입주사 오픈 신청',
      '•회사, 학교가 아닌 가정집(개인사유지)인 경우',
      '•이미 오픈완료된 회사 및 학교로 스팟 신청을 진행한 경우',
      '•트라이얼 진행 중 모집인원에 미충족한 경우',
    ],
  },
  {
    title: '단골가게 프코스팟 오픈 기준에 미달인 경우',
    desc: [
      '•단골가게 참여자 모집 중 참여인원 미충족한 경우',
      '•요청 스팟의 점주가 스팟 오픈을 희망하지 않고 대체할 수 있는 스팟이 주변에 없을 경우',
    ],
  },
  {
    title: '우리가게 프코스팟 오픈 기준에 미달인 경우',
    desc: [
      '•점주 인터뷰 진행 후, 스팟 오픈 요건에 부합하지 않는 경우',
    ],
  },
];

const SpotStatusDetailPage = ({ id }: IParams): ReactElement => {
  const [locationInfo, setLocationInfo] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);

  const { data: statusDetail } = useQuery(
    ['statusDetail'],
    async () => {
      const response = await getSpotsRegistrationStatusDetail(id);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const tagType = () => {
    switch(statusDetail?.type){
      case 'PRIVATE':
        return '프라이빗'
      case 'PUBLIC':
        return '단골가게'
      case 'OWNER':
        return '우리가게'
    };
  };

  const stepType = () => {
    switch(statusDetail?.step){
      case 'CONFIRM':
        return '검토 중'
      case 'RECRUITING':
        return '모집 중'
      case 'TRIAL':
        return '트라이얼 진행 중'
      case 'OPEN':
        return '오픈완료'
      case 'OPEN_CONFIRM': 
        return '오픈 검토 중'
      case 'REJECTED':
        return '오픈 미진행'
    }
  }

  const toggleLocationInfo = (): void => {
    setLocationInfo(!locationInfo);
  };

  const toggleUserInfo = (): void => {
    setUserInfo(!userInfo);
  };

  const toggleOpenInfo = (): void => {
    setOpenInfo(!openInfo);
  };

  const privateRegistrationBenefit = (): void => {
    setOpenInfo(true);
  }

  return (
    <Container>
      <TopStatusWrapper>
        <Flex>
          <Tag color={theme.brandColor} backgroundColor={theme.brandColor5P} margin="0 4px 0 0">
            {tagType()}
          </Tag>
          <Tag>{stepType()}</Tag>
        </Flex>
        <TextH2B margin="0 0 4px 0">{statusDetail?.placeName}</TextH2B>
        <TextB3R>{`${statusDetail?.location.address} ${statusDetail?.location.addressDetail}`}</TextB3R>
      </TopStatusWrapper>
      <SpotStatusDetailProgressBar item={statusDetail} />
      {
        statusDetail?.type !== 'PUBLIC' &&
        <BtnWrapper>
          <Button color={theme.black} backgroundColor={theme.white} border onClick={privateRegistrationBenefit}>모집 혜택 확인하기</Button>
        </BtnWrapper>
      }
      <ToggleWrapper  onClick={toggleLocationInfo}>
        <FlexBetween padding="24px">
          <TextH4B>장소 정보</TextH4B>
          <SVGIcon name={locationInfo ? 'triangleUp' : 'triangleDown'} />
        </FlexBetween>
        <SlideToggle state={locationInfo} duration={0.5}>
          <LocationInfo item={statusDetail!} />
        </SlideToggle>
      </ToggleWrapper>
      <Row10 />
      {
        statusDetail?.type !== 'PUBLIC' &&
        <>
          <ToggleWrapper  onClick={toggleUserInfo}>
            <FlexBetween padding="24px">
              <TextH4B>{statusDetail?.type === 'PRIVATE' ? '신청자 정보' : '장소관리자 정보'}</TextH4B>
              <SVGIcon name={userInfo ? 'triangleUp' : 'triangleDown'} />
            </FlexBetween>
            <SlideToggle state={userInfo} duration={0.5}>
              <UserInfo item={statusDetail!} />
            </SlideToggle>
          </ToggleWrapper>
          <Row10 />
        </>
      }
      <ToggleWrapper  onClick={toggleOpenInfo}>
        <FlexBetween padding="24px">
          <TextH4B>{`${tagType()} 프코스팟 오픈방법 알아보기`}</TextH4B>
          <SVGIcon name={openInfo ? 'triangleUp' : 'triangleDown'} />
        </FlexBetween>
        <SlideToggle state={openInfo} duration={0.5}>
          <OpenInfo />
        </SlideToggle>
      </ToggleWrapper>
      <PlanGuideWrapper>
        <TextH5B color={theme.greyScale65} margin="0 0 16px 0">
          프코스팟 오픈 관련 유의사항
        </TextH5B>
        <Row />
        <TextB3R color={theme.greyScale65} margin='0 0 16px 0'>프코스팟 오픈 진행 중 아래 사항에 해당하는 경우 오픈이 미진행될 수 있습니다. (이외 자세한 내용은 오픈 미진행 시, 신청자에게 안내 예정)</TextB3R>
        {PLAN_GUIDE.map((item, index) => {
          return (
            <PlanGuidContent key={index}>
              <TextH6B color={theme.greyScale65} margin='0 0 4px 0'>{item.title}</TextH6B>
            {
              item.desc.map((i, idx)=> {
                return (
                  <TextB3R key={idx}  color={theme.greyScale65} margin="0 0 4px 0">
                  {i}
                  </TextB3R>  
                )
              })
            }
            </PlanGuidContent>
          );
        })}
        <Button margin="24px 0 20px 0" border color={theme.black} backgroundColor={theme.white}>
          채팅 문의
        </Button>
      </PlanGuideWrapper>
    </Container>
  );
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

const BtnWrapper =styled.div`
  padding: 24px;
`;

const ToggleWrapper = styled.section`
  cursor: pointer;
`;

const Row10 = styled.div`
  border-bottom: 10px solid ${theme.greyScale6};
`;

const Row = styled.div`
  border-bottom: 1px solid ${theme.greyScale6};
  margin-bottom: 16px;
`;
const PlanGuidContent = styled.div`
  margin-bottom: 16px;
`;

const PlanGuideWrapper = styled.section`
  background: ${theme.greyScale3};
  padding: 24px;
  margin-top: 48px;
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  }
}

export default SpotStatusDetailPage;
