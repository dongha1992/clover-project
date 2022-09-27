import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SpotStatusList } from '@components/Pages/Mypage/Spot';
import { homePadding, theme } from '@styles/theme';
import { IGetDestinationsRequest, IGetRegistrationStatus } from '@model/index';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { getSpotsRegistrationStatus, getSpotInfo } from '@api/spot';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';

const SpotStatusListPage = () => {
  const router = useRouter();
  const { spotsPosition } = useSelector(spotSelector);
  const [statusList, setStatusList] = useState<IGetRegistrationStatus[]>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage(page + 1);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusList.length > 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getSpotRegistrationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 스팟 신청 목록 조회 api
  const getSpotRegistrationList = async () => {
    const params: IGetDestinationsRequest = {
      page: page,
      size: 10,
    };
    try {
      const { data } = await getSpotsRegistrationStatus(params);
      const list = data.data.spotRegistrations;
      const lastPage = data.data.pagination.totalPage;
      setStatusList(prevList => [...prevList, ...list]);
      setIsLastPage(page === lastPage);
    } catch (e) {
      console.error(e);
    }
  };

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
      {statusList.length! > 0 ? (
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
