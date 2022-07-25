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
import { ButtonGroup, Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { postSpotRegistrationsRecruiting } from '@api/spot';
import { ISpotsDetail } from '@model/index';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';

type TPrams = {
  items: ISpotsDetail | undefined;
  type: string;
  recruited?: boolean;
};

const SpotRegisterSheet = ({ items, type, recruited }: TPrams): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();  
  const { keyword }: any = router.query;

  const joinPublicSpotRecruiting = async(id: number) => {
    try{
      const {data} = await postSpotRegistrationsRecruiting(id);
      if(data.code === 200){
        router.push({
          pathname: `/mypage/spot-status/detail/${id}`,
          query: { recruited: true }
        });
      }
    } catch(e){
      console.error(e);
    };
  };

  const submitHandler = (): void => {
    if (type === 'PRIVATE') {
      dispatch(INIT_BOTTOM_SHEET());
      router.push({
        pathname: '/spot/location/address',
        query: {
          type: type,
          keyword: keyword,
        }
      });
  } else if(type === 'PUBLIC') {
      dispatch(INIT_BOTTOM_SHEET());  
      joinPublicSpotRecruiting(items?.id!);
    }
  };

  const closeBottomSheet = ():void => {
    dispatch(
      INIT_BOTTOM_SHEET()
    );
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          프코스팟 신청
        </TextH5B>
        {
          type === 'PRIVATE' && (
            <>
              <TextB2R>
                {'해당 주소에 이미 신청 중인 프라이빗 프코스팟이 있어요!'}
              </TextB2R>
              <Row /> 
              <FlexWrapper>
                <Dot>•</Dot>
                <TextH5B margin="0 0 4px 0">
                {items?.placeName}
                </TextH5B>  
              </FlexWrapper>
              
            </>

          )
        }
        {
          type === 'PUBLIC' && (
            recruited ? (
              <>
                <TextB2R margin='0 0 16px 0'>
                  {'이미 참여한 프코스팟 이에요.'}
                </TextB2R> 
                <Row /> 
                <PickWrapper>
                  <RadioButton
                    onChange={() => {}}
                    isSelected={true}
                  />
                  <TextH5B padding="2px 0 0 8px">{items?.placeName}</TextH5B>
                </PickWrapper>
              </>
            ) : (
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
                  <TextH5B padding="2px 0 0 8px">{items?.placeName}</TextH5B>
                </PickWrapper>
              </>
            )
          )
        }
      </Wrapper>
      <ButtonContainer>
        {
          type === 'PRIVATE' && (
            <ButtonGroup
              rightButtonHandler={submitHandler}
              leftButtonHandler={closeBottomSheet}
              leftText="닫기"
              rightText="신규 신청하기"
            />  
          )
        }
        {
          type === 'PUBLIC' &&  (
            recruited ? (
              <Button
                height="100%"
                borderRadius="0"
                onClick={closeBottomSheet}
                backgroundColor={theme.balck}
              >
                닫기
              </Button>
            ): (
              <ButtonGroup
                rightButtonHandler={submitHandler}
                leftButtonHandler={closeBottomSheet}
                leftText="닫기"
                rightText="참여하기"
              />
            )
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
