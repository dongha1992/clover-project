import React, { useRef } from 'react';
import styled from 'styled-components';
import { TextH1B, TextH2B, TextH6B, TextH4B, TextH5B, TextB3R } from '@components/Shared/Text';
import { FlexCol, homePadding, theme, FlexRow, FlexBetween } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import BorderLine from '@components/Shared/BorderLine';
import TextInput from '@components/Shared/TextInput';
import { Obj } from '@model/index';
import { useToast } from '@hooks/useToast';
import { userInvitationApi, userRecommendationApi } from '@api/user';
import { useQuery, useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';
import { useRouter } from 'next/router';

const textStyle = {
  color: theme.greyScale65,
};

const InviteFriendPaage = () => {
  const { showToast } = useToast();
  const codeRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { me } = useSelector(userForm);
  const router = useRouter();
  const { recommendCode } = router.query;

  const {
    data,
    error: menuError,
    isLoading,
  } = useQuery(
    'getInvitationInfo',
    async () => {
      const { data } = await userInvitationApi();
      return data.data;
    },

    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { mutateAsync: mutatePostRecommendationCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const params = {
          recommendCode: codeRef?.current.value,
        };

        const { data } = await userRecommendationApi(params);
        return data;
      }
    },
    {
      onSuccess: async (data) => {
        return dispatch(
          SET_ALERT({
            alertMessage: '등록을 완료했어요!',
            submitBtnText: '확인',
          })
        );
      },
      onError: async (error: any) => {
        let alertMessage = '';
        if (error.code === 2201) {
          alertMessage = '이미 등록된 초대코드예요.';
        } else if (error.code === 1105) {
          alertMessage = '유효하지 않은 코드예요. 다시 한번 확인해 주세요.';
        } else if (1101) {
          alertMessage = '유저를 찾을 수 없습니다.';
        } else {
          alertMessage = error.message;
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

  const getCodeCopy = (e: any) => {
    e.preventDefault();
    const { clipboard } = window.navigator;
    clipboard.writeText(me?.recommendCode!).then(() => {
      showToast({ message: '초대코드를 복사했어요.' });
    });
  };

  const goToShare = () => {
    // const recommendCodeUrl = `${process.env.SERVICE_URL}/onboarding?recommendCode=${me?.recommendCode}`;
    const recommendCodeUrl = `http://localhost:9009/onboarding?recommendCode=${me?.recommendCode}`;
    dispatch(SET_BOTTOM_SHEET({ content: <ShareSheet customUrl={recommendCodeUrl} /> }));
  };

  if (isLoading) {
    <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <FlexCol padding="24px 0 32px 0">
          <TextH2B>친구 초대하고 </TextH2B>
          <TextH2B>함께 3,000P씩 받아요</TextH2B>
        </FlexCol>
        <FlexCol>
          <TextH6B>내 초대코드</TextH6B>
          <TextH1B color={theme.brandColor} padding="4px 0 0 0">
            {me?.recommendCode}
          </TextH1B>
        </FlexCol>
        <FlexRow width="70%" padding="24px 0 0 0">
          <Button backgroundColor={theme.black} onClick={() => goToShare()}>
            공유하기
          </Button>
          <Button backgroundColor={theme.white} color={theme.black} margin="0 0 0 8px" border onClick={getCodeCopy}>
            초대코드 복사하기
          </Button>
        </FlexRow>
        <BorderLine height={1} margin="32px 0" />
        <InvitedFriendWrapper>
          <TextH4B padding="0 0 24px 0">내가 초대한 친구</TextH4B>
          <FlexCol>
            <InvitedFriend id={1} title="가입한 친구" count={data?.joinCount} />
            <InvitedFriend id={2} title="구매한 친구" count={data?.orderCount} />
            <InvitedFriend id={3} title="총 적립 포인트" count={data?.totalPoint} />
          </FlexCol>
        </InvitedFriendWrapper>
      </Wrapper>
      <BorderLine height={8} margin="32px 0" />
      <Wrapper>
        <FlexCol>
          <TextH4B padding="0 0 24px 0">친구의 초대코드 등록</TextH4B>
          <FlexRow margin="0 0 48px 0">
            <TextInput
              placeholder="초대코드 등록하고 3,000p 받기"
              ref={codeRef}
              value={recommendCode ? recommendCode : ''}
            />
            <Button width="30%" margin="0 0 0 8px" onClick={() => mutatePostRecommendationCode()}>
              등록하기
            </Button>
          </FlexRow>
        </FlexCol>
      </Wrapper>
      <Info>
        <TextH5B color={theme.greyScale65}>확인해주세요!</TextH5B>
        <BorderLine height={1} />
        <TextB3R {...textStyle}>지급된 포인트의 유효기간은 지급일로부터 14일입니다.</TextB3R>
        <TextB3R {...textStyle}>친구가 내 초대코드를 통해 가입하면 3,000P를 친구와 나에게 3,000P가 지급됩니다.</TextB3R>
        <TextB3R {...textStyle}>
          내 초대코드를 통해 가입한 친구가 첫 주문완료 시 영업일 기준 2일 이내 3,000P가 나에게 자동 지급됩니다.
        </TextB3R>
        <TextB3R {...textStyle}>이미 혜택을 받은 친구는 초대코드를 등록해도 포인트 혜택을 받을 수 없습니다.</TextB3R>
        <TextB3R {...textStyle}>
          친구 초대 프로모션은 당사 사정에 의해 사전 공지 없이 내용이 변경되거나 기간이 조정될 수 있음을 안내드립니다.
        </TextB3R>
      </Info>
    </Container>
  );
};

export const InvitedFriend = ({ id, title, count }: any) => {
  const mapper: Obj = {
    1: '명',
    2: '명',
    3: 'P',
  };
  return (
    <GreyBackground>
      <FlexBetween padding="16px">
        <TextH5B>{title}</TextH5B>
        <TextH5B color={theme.brandColor}>
          {count}
          {mapper[id]}
        </TextH5B>
      </FlexBetween>
    </GreyBackground>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  ${homePadding}
`;

const InvitedFriendWrapper = styled.div``;

const Info = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
`;

const GreyBackground = styled.div`
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  margin-bottom: 8px;
`;

export default InviteFriendPaage;
