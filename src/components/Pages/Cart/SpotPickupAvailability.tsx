import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB3R } from '@components/Shared/Text';
import { FlexCol, theme, FlexRow , homePadding} from '@styles/theme';
import { getPickupAvailabilityApi } from '@api/spot';
import  SVGIcon  from '@utils/common/SVGIcon';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {Spinner} from '@utils/common';

interface IProps {
  userDeliveryType: string;
  setIsCheckedPickupAvailability: any;
  pickupId: any
}
const SpotPickupAvailability = ({
  userDeliveryType, 
  setIsCheckedPickupAvailability, 
  pickupId,
}: IProps) => {
  const [isAvailability, setIsAvailability] = useState<boolean>(false);

  const {
    data: pickUpAvailability,
    error,
    isLoading,
  } = useQuery(
    'getPickupAvailability',
    async () => {
      const { data } = await getPickupAvailabilityApi(pickupId);
      return data.data.isAvailability;
    },
    {
      onSuccess: (data) => {
        console.log('data', data);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!pickupId,
    }
  );

  console.log('isLoading', isLoading, 'pickUpAvailability', pickUpAvailability);


  const renderSpotPickupAvailability = () => {
    
  };

  return (
    <Container>
      {
        isLoading && (
          <PickupWrapper>
            <Spinner />
            <TextB3R padding='8px 0 0 0' color={theme.greyScale65}>사용 가능한 보관함을 확인 중이에요.</TextB3R>
          </PickupWrapper>
        )
      }
      {
        pickUpAvailability ? (
          <PickupWrapper>
            <TextB3R padding='8px 0 0 0' color={theme.greyScale65}>사용 가능한 보관함을 확인했어요. 빠르게 주문해보세요!</TextB3R>
          </PickupWrapper>
        ) : (
          <PickupWrapper>
            <SVGIcon name='exclamationMark' />
            <TextB3R padding='1px 0 0 4px'  color={theme.brandColor}>현재 사용 가능한 보관함이 없어요.</TextB3R>
          </PickupWrapper>
        )
      }
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  ${homePadding};
`;

const PickupWrapper = styled.div`
  display: flex;
  padding: 8px 0 0 0;
`;

export default React.memo(SpotPickupAvailability);