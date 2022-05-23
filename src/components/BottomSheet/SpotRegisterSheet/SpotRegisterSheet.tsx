import React from 'react';
import styled from 'styled-components';
import { theme, homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { SET_SPOT_PICKUP_ID } from '@store/spot';
import Checkbox from '@components/Shared/Checkbox';
import { ISpotPickupInfo } from '@model/index';
import { ButtonGroup } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { postSpotRegistrationsRecruiting } from '@api/spot';

type TPrams = {
  items: any;
  type: string;
};

const SpotRegisterSheet = ({ items, type }: TPrams): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();  

  const handlerPublicSpotRecruiting= async(id: number) => {
    try{
      const {data} = await postSpotRegistrationsRecruiting(id);
      if(data.code === 200){
        router.push(`mypage/spot-status/detail/${id}`);
      }
    } catch(e){
      console.error(e);
    }
  }
  const submitHandler = (): void => {
    if (type === 'PRIVATE') {
      router.push({
        pathname: '/spot/location/address',
        query: { type },
      });
  } else if(type === 'PUBLIC') {
    handlerPublicSpotRecruiting(items?.id);
    }
  };

  const closeBottomSheet = ():void => {
    dispatch(
      INIT_BOTTOM_SHEET()
    )
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          프코스팟 신청
        </TextH5B>
        {
          type === 'private' && (
            <>
              <TextB2R>
                {'해당 주소에 이미 신청 중인 프라이빗 프코스팟이 있어요!'}
              </TextB2R>
              <Row /> 
              <FlexWrapper>
                <Dot>•</Dot>
                <TextH5B margin="0 0 4px 0">
                {items.placeName}
                </TextH5B>  
              </FlexWrapper>
              
            </>

          )
        }
        {
          type === 'public' && (
            <>
              <TextB2R margin='0 0 16px 0'>
                {'해당 주소에 이미 신청 중인 프코스팟이 있어요!\n함께 오픈 참여하시겠어요?'}
              </TextB2R> 
              <Row /> 
              <PickWrapper>
                <RadioButton
                  onChange={() => {}}
                  isSelected={true}
                />
                <TextH5B padding="2px 0 0 8px">{items.placeName}</TextH5B>
              </PickWrapper>
            </>
          )
        }
      </Wrapper>
      <ButtonContainer onClick={submitHandler}>
        {
          type === 'private' && (
            <ButtonGroup
              rightButtonHandler={submitHandler}
              leftButtonHandler={closeBottomSheet}
              leftText="닫기"
              rightText="신규 신청하기"
            />  
          )
        }
        {
          type === 'public' && (
            <ButtonGroup
              rightButtonHandler={submitHandler}
              leftButtonHandler={closeBottomSheet}
              leftText="닫기"
              rightText="참여하기"
            />
          )
        }
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const Row = styled.div`
  width: 100%;
  border-top: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

const FlexWrapper = styled.div`
  display: flex;
  margin: 0 0 24px 0;
`;

const Dot = styled.span`
  padding-top: 1px;
`;


const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(SpotRegisterSheet);
