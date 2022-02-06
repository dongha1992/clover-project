import React from 'react';
import styled from 'styled-components';
import {
  TextH2B,
  TextB1B,
  TextH5B,
  TextH6B,
  TextB2R,
} from '@components/Shared/Text';
import { theme, homePadding, fixedBottom, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';

const SubmitPage = () => {
  const router = useRouter();
  const {
    spotLocation, 
    spotsRegistrationOptions, 
    spotsRegistrationInfo
  } = useSelector(spotSelector);
  const { type } = router.query;

  const goToFinish = (): void => {
    router.push({
      pathname: '/spot/register/submit/finish',
      query: { type },
    });
  };

  const goToChangeInfo = (): void => {
    router.replace({
      pathname: '/spot/register',
      query: { type },
    });
  };

  const goToChangeUserInfo = (): void => {
    router.replace({
      pathname: '/spot/register/spot-onboarding',
      query: { type },
    });
  };

  return (
    <Container>
      <Wrapper>
        <TextH2B margin="0 0 45px 0">{'신청 완료 전\n내용을 확인해요'}</TextH2B>
        <ContentWrapper>
          <FlexBetween margin="0 0 24px 0">
            <TextB1B>장소 정보</TextB1B>
            <TextH6B
              color={theme.greyScale65}
              textDecoration="underline"
              onClick={goToChangeInfo}
              padding='0 0 3px 0'
              pointer
            >
              변경하기
            </TextH6B>
          </FlexBetween>
          <Content>
            <TextH5B margin="0 0 8px 0">주소</TextH5B>
            <TextB2R>{`${spotLocation.address} ${spotLocation.bdNm} ${spotLocation.addressDetail}`}</TextB2R>
          </Content>
          <Content>
            <TextH5B margin="0 0 8px 0">장소명</TextH5B>
            <TextB2R>{spotsRegistrationInfo.placeName}</TextB2R>
          </Content>
          {type === 'private' && (
            <Content>
              <TextH5B margin="0 0 8px 0">픽업 장소</TextH5B>
              <TextB2R>{spotsRegistrationOptions.pickupLocationTypeOptions.name?.length && 
                spotsRegistrationOptions.pickupLocationTypeOptions.value !== 'ETC' ?
                  spotsRegistrationOptions.pickupLocationTypeOptions.name
                :
                  `기타 / ${spotsRegistrationInfo.pickupLocationEtc}`
              }</TextB2R>
            </Content>
          )}
          <Content>
            <TextH5B margin="0 0 8px 0">장소 종류</TextH5B>
            <TextB2R>{spotsRegistrationOptions.placeTypeOptions.name?.length &&
              spotsRegistrationOptions.placeTypeOptions.value !== 'ETC' ?
                spotsRegistrationOptions.placeTypeOptions.name
              :
                `기타 / ${spotsRegistrationInfo.placeTypeEtc}`
              }</TextB2R>
          </Content>
          {type === 'private' && (
            <Content>
              <TextH5B margin="0 0 8px 0">점심 시간</TextH5B>
              <TextB2R>{spotsRegistrationOptions.lunchTimeOptions.name?.length && 
                spotsRegistrationOptions.lunchTimeOptions.name}</TextB2R>
            </Content>
          )}
        </ContentWrapper>
        {type !== 'public' && (
          <>
            <Row />
            <ContentWrapper>
              <FlexBetween margin="0 0 24px 0">
                <TextB1B>
                  {type === 'private' ? '신청자 정보' : '장소 관리자 정보'}
                </TextB1B>
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={goToChangeUserInfo}
                  padding='0 0 3px 0'
                  pointer
                >
                  변경하기
                </TextH6B>
              </FlexBetween>
              <Content>
                <TextH5B margin="0 0 8px 0">이름</TextH5B>
                <TextB2R>프플린</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">이메일</TextH5B>
                <TextB2R>flynn@freshcode.me</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">휴대폰 번호</TextH5B>
                <TextB2R>01012341234</TextB2R>
              </Content>
              {type === 'owner' && (
                <Content>
                  <TextH5B margin="0 0 8px 0">직급/호칭</TextH5B>
                  <TextB2R>사장님</TextB2R>
                </Content>
              )}
            </ContentWrapper>
          </>
        )}
        <FixedButton onClick={goToFinish}>
          <Button borderRadius="0" padding='10px 0 0 0'>신청서 제출하기</Button>
        </FixedButton>
      </Wrapper>
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding}
  padding-bottom: 24px;
`;

const ContentWrapper = styled.section``;

const Content = styled.div`
  margin-bottom: 24px;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

export default SubmitPage;
