import React from 'react';
import styled from 'styled-components';
import { TextB3R } from '@components/Shared/Text';
import { theme, homePadding} from '@styles/theme';
import  SVGIcon  from '@utils/common/SVGIcon';
import Spinner from '@components/Shared/Spinner';

interface IProps {
  isLoadingPickup: boolean;
  pickUpAvailability: boolean | undefined;
}
const SpotPickupAvailability = ({
  isLoadingPickup,
  pickUpAvailability,
}: IProps) => {

  const renderSpotPickupAvailability = () => {
    switch(true){
      case isLoadingPickup: 
        return (
          <>
            <Spinner width={18} height={18} />
            <TextB3R padding='1px 0 0 4px' color={theme.greyScale65}>사용 가능한 보관함을 확인 중이에요.</TextB3R>
          </>
        )
      case pickUpAvailability:
        return <TextB3R color={theme.greyScale65}>사용 가능한 보관함을 확인했어요. 빠르게 주문해보세요!</TextB3R>
      case !pickUpAvailability:
        return (
          <>
            <SVGIcon name='exclamationMark' />
            <TextB3R padding='1px 0 0 4px'  color={theme.brandColor}>현재 사용 가능한 보관함이 없어요.</TextB3R>  
          </>
        )
      default:
        return <TextB3R color={theme.greyScale65}>사용 가능한 보관함을 확인했어요. 빠르게 주문해보세요!</TextB3R>
    };
  };

  return (
    <Container>
      <PickupWrapper>
        {renderSpotPickupAvailability()}
      </PickupWrapper>
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