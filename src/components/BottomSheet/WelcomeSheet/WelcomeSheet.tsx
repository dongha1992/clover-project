import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexEnd, FlexCol, FlexRow } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
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
import { SET_ALERT } from '@store/alert';

const WelcomeSheet = () => {
  const dispatch = useDispatch();
  const codeRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: mutatePostPromotionCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const reqBody = {
          code: codeRef?.current?.value,
          reward: 'POINT',
        };

        const { data } = await postPromotionCodeApi(reqBody);

        let alertMessage = '';
        if (data.code === 2002) {
          alertMessage = '이미 등록한 프로모션 코드입니다.';
        } else if (data.code === 1105) {
          alertMessage = '존재하지 않는 프로모션 코드입니다.';
        } else {
          alertMessage = '프로모션 코드가 등록되었습니다.';
        }

        return dispatch(
          SET_ALERT({
            alertMessage,
            submitBtnText: '확인',
          })
        );
      }
    },
    {
      onSuccess: async (data) => {},
      onError: async (data) => {},
    }
  );

  return (
    <Container>
      <Header>
        <FlexEnd
          margin="40px 0 0 0"
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
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
          <TextH5B padding="0 0 8px 0">프로모션 코드 등록하기</TextH5B>
          <TextB2R>추천인 코드, 이벤트 할인 프로모션 코드 입력</TextB2R>
          <TextB2R>(가입 이후에도 마이페이지{'>'}쿠폰조회 에서 등록 가능)</TextB2R>
          <FlexCol padding="24px 0 0 0">
            <FlexRow>
              <TextInput margin="0 8px 0 0" ref={codeRef} />
              <Button width="30%" height="48px" onClick={() => mutatePostPromotionCode()}>
                등록하기
              </Button>
            </FlexRow>
            <TextB3R color={theme.brandColor} padding="2px 0 0 16px">
              사용할 수 있는 프로모션 코드입니다.
            </TextB3R>
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
