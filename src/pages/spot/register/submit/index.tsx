import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextB1B, TextH5B, TextB2R } from '@components/Shared/Text';
import { theme, homePadding, fixedBottom, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';
import { Button } from '@components/Shared/Button';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { postSpotsRegistrationsInfoSubmit } from '@api/spot';
import { IGetRegistrationStatus } from '@model/index';
import { useDispatch } from 'react-redux';
import { SET_SPOT_REGISTRATIONS_POST_RESULT } from '@store/spot';

const SubmitPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { spotLocation, spotsRegistrationOptions, spotsRegistrationInfo } = useSelector(spotSelector);
  const { type } = router.query;

  const registrationsSubmitHandeler = async () => {
    const params: IGetRegistrationStatus = {
      coordinate: {
        lat: Number(spotLocation.lat),
        lon: Number(spotLocation.lon),
      },
      location: {
        address: spotLocation.address,
        addressDetail: spotLocation.addressDetail,
        dong: spotLocation.dong,
        zipCode: spotLocation.zipCode,
      },
      type: type?.toString().toUpperCase(),
      userName: spotsRegistrationInfo.userName,
      userEmail: spotsRegistrationInfo.userEmail,
      userTel: spotsRegistrationInfo.userTel,
      placeName: spotsRegistrationInfo.placeName,
      pickupType: spotsRegistrationInfo.pickupLocation,
      lunchTime: spotsRegistrationOptions.lunchTimeOptions.value,
      placeType: spotsRegistrationOptions.placeTypeOptions.value,
      placeTypeDetail:
        spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' ? spotsRegistrationInfo.placeTypeEtc : null,
      userPosition: type === 'OWNER' ? spotsRegistrationInfo.managerInfo : null,
    };
    try {
      const { data } = await postSpotsRegistrationsInfoSubmit(params);
      if (data.code === 200) {
        dispatch(SET_SPOT_REGISTRATIONS_POST_RESULT(data?.data));
        router.push({
          pathname: '/spot/register/submit/finish',
          query: { type },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <TextH2B margin="0 0 45px 0">{'신청 완료 전\n내용을 확인해요'}</TextH2B>
        <ContentWrapper>
          <FlexBetween margin="0 0 24px 0">
            <TextB1B>장소 정보</TextB1B>
          </FlexBetween>
          <Content>
            <TextH5B margin="0 0 8px 0">주소</TextH5B>
            <TextB2R>{`${spotLocation.address} ${spotLocation.bdNm} ${spotLocation.addressDetail}`}</TextB2R>
          </Content>
          <Content>
            <TextH5B margin="0 0 8px 0">장소명</TextH5B>
            <TextB2R>{spotsRegistrationInfo.placeName}</TextB2R>
          </Content>
          {type === 'PRIVATE' && (
            <Content>
              <TextH5B margin="0 0 8px 0">픽업 장소</TextH5B>
              <TextB2R>
                {spotsRegistrationInfo.pickupLocation}
              </TextB2R>
            </Content>
          )}
          <Content>
            <TextH5B margin="0 0 8px 0">장소 종류</TextH5B>
            <TextB2R>
              {spotsRegistrationOptions.placeTypeOptions.name?.length &&
              spotsRegistrationOptions.placeTypeOptions.value !== 'ETC'
                ? spotsRegistrationOptions.placeTypeOptions.name
                : `기타 / ${spotsRegistrationInfo.placeTypeEtc}`}
            </TextB2R>
          </Content>
          {type === 'PRIVATE' && (
            <Content>
              <TextH5B margin="0 0 8px 0">점심시간</TextH5B>
              <TextB2R>
                {spotsRegistrationOptions.lunchTimeOptions.name?.length &&
                  spotsRegistrationOptions.lunchTimeOptions.name}
              </TextB2R>
            </Content>
          )}
        </ContentWrapper>
      </Wrapper>
      <Row />
      <Wrapper>
        {type !== 'PUBLIC' && (
          <>
            <ContentWrapper>
              <FlexBetween margin="0 0 24px 0">
                <TextB1B>{type === 'PRIVATE' ? '신청자 정보' : '장소 관리자 정보'}</TextB1B>
              </FlexBetween>
              <Content>
                <TextH5B margin="0 0 8px 0">이름</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userName}</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">이메일</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userEmail}</TextB2R>
              </Content>
              <Content>
                <TextH5B margin="0 0 8px 0">휴대폰 번호</TextH5B>
                <TextB2R>{spotsRegistrationInfo.userTel}</TextB2R>
              </Content>
              {type === 'OWNER' && (
                <Content>
                  <TextH5B margin="0 0 8px 0">직급/호칭</TextH5B>
                  <TextB2R>{spotsRegistrationInfo.managerInfo}</TextB2R>
                </Content>
              )}
            </ContentWrapper>
          </>
        )}
        <FixedButton onClick={registrationsSubmitHandeler}>
          <Button borderRadius="0" padding="10px 0 0 0">
            신청서 제출하기
          </Button>
        </FixedButton>
      </Wrapper>
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding}
  padding-bottom: 10px;
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
  height: 8px;
  background: ${theme.greyScale6};
  margin-bottom: 32px;
`;

export default SubmitPage;
