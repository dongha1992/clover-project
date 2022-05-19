import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexEnd, FlexCol, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { TextB2R, TextH2B, TextH5B, TextB3R } from '@components/Shared/Text';
import Image from 'next/image';
import router from 'next/router';
import welcomeImg from '@public/images/welcome.png';
import { theme } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postPromotionCodeApi } from '@api/promotion';
import { userRecommendationApi } from '@api/user';
import { SET_ALERT } from '@store/alert';

const WelcomeSheet = () => {
  const dispatch = useDispatch();
  const codeRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: mutatePostPromotionCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const reqBody = {
          code: codeRef?.current?.value,
          reward: null,
        };

        const { data } = await postPromotionCodeApi(reqBody);

        if (data.code === 200) {
          return dispatch(
            SET_ALERT({
              alertMessage: '등록을 완료했어요!',
              submitBtnText: '확인',
            })
          );
        }
      }
    },
    {
      onSuccess: async (data) => {},
      onError: async (error: any) => {
        if (error.code === 2202) {
          return dispatch(
            SET_ALERT({
              alertMessage: '이미 등록된 프로모션 코드예요.',
              submitBtnText: '확인',
            })
          );
        } else {
          return await mutatePostRecommendationCode();
        }
      },
    }
  );

  const { mutateAsync: mutatePostRecommendationCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const params = {
          recommendCode: codeRef?.current.value,
        };

        const { data } = await userRecommendationApi(params);
        if (data.code === 200) {
          return dispatch(
            SET_ALERT({
              alertMessage: '등록을 완료했어요!',
              submitBtnText: '확인',
            })
          );
        }
      }
    },
    {
      onSuccess: async (data) => {
        console.log(data, 'ON SUCCESS');
      },
      onError: async (error: any) => {
        let alertMessage = '';
        if (error.code === 2201) {
          alertMessage = '이미 등록된 초대코드예요.';
        } else if (error.code === 1105) {
          alertMessage = '유효하지 않은 코드예요. 다시 한번 확인해 주세요.';
        }

        return dispatch(
          SET_ALERT({
            alertMessage,
            submitBtnText: '확인',
          })
        );
      },
    }
  );

  return (
    <Container>
      <Header>
        <FlexEnd
          margin="40px 0 0 0"
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
            /* TODO: 카카오 회원가입 등 리턴 url 해줘야함 */
            router.push('/');
          }}
        >
          <SVGIcon name="defaultCancel24" />
        </FlexEnd>
      </Header>
      <Body>
        <FlexCol>
          <TextH2B>
            <span className="brandColor">닉네임</span>님,
          </TextH2B>
          <TextH2B>프레시코드 회원이 되신걸</TextH2B>
          <TextH2B>진심으로 축하드려요!</TextH2B>
          <TextB2R padding="17px 0 0 0">신규회원 특별 혜택으로가볍게 시작해보세요.</TextB2R>
          <ImageWrapper>
            <Image
              src={welcomeImg}
              alt="웰컴이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              objectFit="cover"
            />
          </ImageWrapper>
        </FlexCol>
        <PromotionWrapper>
          <TextH5B padding="0 0 8px 0">친구 초대 및 쿠폰/프로모션 코드 등록하기</TextH5B>
          <TextB2R>가입 이후 마이페이지 {'>'} 친구 초대, 쿠폰, 포인트에서 등록할 수 있어요!</TextB2R>
          <FlexCol padding="24px 0 0 0">
            <FlexRow>
              <TextInput margin="0 8px 0 0" ref={codeRef} />
              <Button width="30%" height="48px" onClick={() => mutatePostPromotionCode()}>
                등록하기
              </Button>
            </FlexRow>
          </FlexCol>
        </PromotionWrapper>
      </Body>
      <BtnWrapper onClick={() => router.push('/event')}>
        <Button height="100%">신규회원 혜택받기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding};
  height: 90vh;
`;
const Header = styled.div`
  height: 80px;
`;
const Body = styled.div`
  > div {
    > div {
      > span {
        color: ${theme.brandColor};
      }
    }
  }
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

const ImageWrapper = styled.div`
  width: 153px;
  height: 175px;
  align-self: center;
  margin-top: 31px;
`;

const PromotionWrapper = styled.div`
  background-color: ${theme.greyScale3};
  padding: 24px;
`;

export default WelcomeSheet;
