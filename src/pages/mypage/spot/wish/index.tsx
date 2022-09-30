import React, { useState } from 'react';
import styled from 'styled-components';
import { SpotWishList } from '@components/Pages/Mypage/Spot';
import { homePadding, theme } from '@styles/theme';
import router from 'next/router';
import { IParamsSpots } from '@model/index';
import { useQuery } from 'react-query';
import { getSpotsWishList } from '@api/spot';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector } from '@store/spot';
import { deleteSpotLike } from '@api/spot';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { show, hide } from '@store/loading';

const SpotWishListPage = () => {
  const dispatch = useDispatch();
  const { spotsPosition } = useSelector(spotSelector);
  const [items, setItems] = useState<boolean>(false);

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  // 찜한 스팟 api
  const { data: wishList } = useQuery(
    ['spotList', spotsPosition],
    async () => {
      dispatch(show());
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 10,
        page: 1,
      };
      const response = await getSpotsWishList(params);
      return response.data.data;
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const handlerDislike = async (e: any, id: number) => {
    e.stopPropagation();
    try {
      const { data } = await deleteSpotLike(id);
      if (data.code === 200) {
        setItems(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goToSpotMain = () => {
    router.push('/spot');
  };

  return (
    <Container>
      {wishList?.spots.length! > 0 ? (
        <SpotWishListWrapper>
          {wishList?.spots.map((item, idx) => {
            return <SpotWishList key={idx} items={item} onClick={handlerDislike} />;
          })}
        </SpotWishListWrapper>
      ) : (
        <SpotListEmptyScreen>
          <EmptyWrapper>
            <TextB2R margin="0 0 24px 0" color={theme.greyScale65}>
              찜한 프코스팟이 없어요 😭{' '}
            </TextB2R>
            <Button margin="0 0 16px 0" backgroundColor={theme.white} color={theme.black} border onClick={goToSpotMain}>
              내 주변 프코스팟 보러가기
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

const SpotWishListWrapper = styled.section`
  width: 100%;
  padding-top: 72px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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

export default SpotWishListPage;
