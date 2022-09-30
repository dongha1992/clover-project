import React from 'react';
import styled from 'styled-components';
import { PickupItem } from '@components/Pages/Mypage/Address';
import router from 'next/router';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { flexCenter } from '@styles/theme';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { SET_DESTINATION, SET_USER_DELIVERY_TYPE } from '@store/destination';
import { userForm } from '@store/user';
import { show, hide } from '@store/loading';

const AddressPickupPage = () => {
  const { isSpot } = router.query;

  const dispatch = useDispatch();
  const { me } = useSelector(userForm);

  const { data: filteredList, isLoading } = useQuery<IDestinationsResponse[]>(
    ['getDestinationList'],
    async () => {
      dispatch(show());

      const params = {
        page: 1,
        size: 100,
        delivery: isSpot ? 'SPOT' : null,
        deliveries: !isSpot ? ['MORNING', 'QUICK', 'PARCEL'].join(',') : null,
      };
      const { data } = await getDestinationsApi(params);
      return data.data.destinations;
    },
    {
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  // 스팟 주문하기 - 주문관리 스팟 픽업 주문하기
  const goToCart = (item: IDestinationsResponse) => {
    dispatch(SET_DESTINATION({ ...item, closedDate: item.spotPickup?.spot.closedDate }));
    dispatch(SET_USER_DELIVERY_TYPE(item?.delivery?.toLowerCase()!));
    router.push('/cart');
  };

  const goToSpotEdit = ({ id, spotPickupId }: { id: number; spotPickupId: number }) => {
    router.push({ pathname: `/mypage/address/edit/${id}`, query: { spotPickupId } });
  };

  return (
    <Container>
      {filteredList?.length! > 0 ? (
        <Wrapper>
          {filteredList?.map((item: any, index: number) => (
            <PickupItem
              key={index}
              item={item}
              goToCart={goToCart}
              goToEdit={goToSpotEdit}
              name={me?.name!}
              tel={me?.tel!}
            />
          ))}
        </Wrapper>
      ) : (
        <EmptyContainer>등록된 주소가 없어요</EmptyContainer>
      )}
    </Container>
  );
};
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 74px 0 24px 0px;
`;

const EmptyContainer = styled.div`
  height: 80vh;
  width: 100%;
  ${flexCenter}
  display: flex;
  flex-direction: column;
`;

export default AddressPickupPage;
