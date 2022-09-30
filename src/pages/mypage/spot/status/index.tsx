import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SpotStatusList } from '@components/Pages/Mypage/Spot';
import { homePadding, theme } from '@styles/theme';
import { IGetDestinationsRequest, IGetRegistrationStatus } from '@model/index';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector } from '@store/spot';
import { getSpotsRegistrationStatus, getSpotInfo } from '@api/spot';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { show, hide } from '@store/loading';

const SpotStatusListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { spotsPosition } = useSelector(spotSelector);

  // 스팟 신청 목록 조회 api
  const { data: statusList } = useQuery(
    ['spotStatusList'],
    async () => {
      dispatch(show());
      const params: IGetDestinationsRequest = {
        page: 1,
        size: 100,
      };
      const response = await getSpotsRegistrationStatus(params);
      return response.data.data.spotRegistrations;
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  // 스팟 정보 조회 api
  const { data: getInfo } = useQuery(
    ['spotList'],
    async () => {
      const response = await getSpotInfo();
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const goToSpotRegister = () => {
    router.push('/spot/join');
  };

  return (
    <Container>
      {statusList?.length! > 0 ? (
        <SpotStatusListWrapper>
          {statusList?.map((item, idx) => {
            return <SpotStatusList item={item} key={idx} getInfo={getInfo} />;
          })}
        </SpotStatusListWrapper>
      ) : (
        <SpotListEmptyScreen>
          <EmptyWrapper>
            <TextB2R margin="0 0 24px 0" color={theme.greyScale65}>
              신청 중인 프코스팟이 없어요 😭{' '}
            </TextB2R>
            <Button
              margin="0 0 16px 0"
              backgroundColor={theme.white}
              color={theme.black}
              border
              onClick={goToSpotRegister}
            >
              프코스팟 신청하기
            </Button>
          </EmptyWrapper>
        </SpotListEmptyScreen>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${homePadding};
`;

const SpotStatusListWrapper = styled.section`
  width: 100%;
  padding-top: 50px;
`;

const SpotListEmptyScreen = styled.section`
  width: 100%;
  height: 50vh;
  padding-top: 56px;
  position: relative;
`;

const EmptyWrapper = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
`;

export default SpotStatusListPage;
