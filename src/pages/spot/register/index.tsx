import React, { useCallback } from 'react';
import styled from 'styled-components';
import { theme, FlexRow, fixedBottom } from '@styles/theme';
import {
  TextH1B,
  TextH3B,
  TextH4B,
  TextB3R,
  TextH5B,
} from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { useRouter } from 'next/router';
import Checkbox from '@components/Shared/Checkbox';
import Button from '@components/Shared/Button';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import OptionsSheet from '@components/Pages/Spot/OptionsSheet';
import SVGIcon from '@utils/SVGIcon';

function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;

  const goToSubmit = (): void => {
    if(type === 'normal'){
      router.push({
        pathname: '/spot/register/spot-onboarding',
        query: { type },
      });
    } else {
      router.push({
        pathname: '/spot/register/submit',
        query: { type },
      });  
    }
  };

  const checkBox = () => {};

  const selectOptions = useCallback((type) => {
    dispatch(
      setBottomSheet({
        content: <OptionsSheet type={type} />,
        buttonTitle: '선택하기',
      })
    );
  }, []);

  return (
    <Container>
      <TextH1B margin="24px 24px 56px 24px">
        신청하실 장소가
        <br />
        어디신가요?
      </TextH1B>
      <FormWrapper>
        <Wrapper>
          <TextH4B margin="0 0 16px 0">주소</TextH4B>
          <Button backgroundColor={theme.white} color={theme.black} border>
            장소 찾기
          </Button>
          {/* <Address>
                <TextH3B>서울 동작구 동작대로 18길 11</TextH3B>
                <TextB3R>8층 809호</TextB3R>
            </Address> */}
        </Wrapper>
        <Wrapper>
          <TextH4B margin="0 0 16px 0">장소명</TextH4B>
          <TextInput
            placeholder={
              type === 'private' ? '회사 및 학교 상호입력' : '상호명'
            }
          />
        </Wrapper>
        <Wrapper>
          <TextH4B margin="0 0 16px 0">장소 종류</TextH4B>
          <Button
             justifyContent='space-between'
             padding='12px 16px'
             backgroundColor={theme.white}
             color = {theme.greyScale45}
             fontWeight={400}
             borderGrey15
             pointer
             onClick={() => selectOptions('place')}>
            공간 형태 선택
            <SVGIcon name='triangleDown' />
          </Button>
        </Wrapper>
        {type === 'private' && (
          <>
            <Wrapper>
              <TextH4B margin="0 0 16px 0">점심시간</TextH4B>
              <Button
                justifyContent='space-between'
                backgroundColor={theme.white}
                padding='12px 16px'
                color = {theme.greyScale45}
                fontWeight={400}
                borderGrey15
                pointer
                onClick={() => selectOptions('time')}
              >
              시간대 선택
              <SVGIcon name='triangleDown' />
              </Button>
            </Wrapper>
            <Wrapper>
              <TextH4B margin="0 0 16px 0">픽업장소</TextH4B>
              <Button
                justifyContent='space-between'
                backgroundColor={theme.white}
                padding='12px 16px'
                color = {theme.greyScale45}
                fontWeight={400}
                borderGrey15
                pointer
                onClick={() => selectOptions('pickUp')}
              >
              픽업 장소 선택
              <SVGIcon name='triangleDown' />
              </Button>
            </Wrapper>
          </>
        )}
      </FormWrapper>
      {type === 'private' &&
        <BottomWrapper>
          <FlexRow>
            <Checkbox onChange={checkBox} isSelected />
            <TextH5B margin="0 0 0 8px">
              픽업 장소 선정 유의사항을 확인했습니다.
            </TextH5B>
          </FlexRow>
          <Row />
          <TextB3R color={theme.greyScale65}>
            픽업장소 배송 시에 외부인 출입 제한 및 복잡한 출입 절차가 있을
            경우에 픽업장소가 변경 될 수 있습니다. (예시 : 직원 전용 엘레베이터,
            출입 제한 건물)
          </TextB3R>
        </BottomWrapper>
        }
      <FixedButton onClick={goToSubmit}>
        <Button borderRadius="0">다음</Button>
      </FixedButton>
    </Container>
  );
}

const Container = styled.main``;

const FormWrapper = styled.section`
  margin-bottom: 32px;
  padding: 0 24px;
`;
const Wrapper = styled.div`
  margin-bottom: 32px;
`;

const Address = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${theme.black};
`;
const BottomWrapper = styled.section`
  padding: 32px 0 0 0;
  padding: 24px;
  border-top: 10px solid ${theme.greyScale6};
`;

const BottomSheetBtn = styled.button`
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid ${theme.greyScale15};
  color: ${theme.greyScale45};
  border-radius: 8px;
  background: ${theme.white};
  text-align: left;
  cursor: pointer;
`;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

export default RegisterPage;
