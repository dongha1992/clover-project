import React, { useState } from 'react';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextB1R, TextB2R, TextB3R } from '@components/Shared/Text';
import { ToggleButton } from '@components/Shared/Button';
import { useFatchUserProfile, useGetUserProfile } from '@queries/user';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

const SettingPage = () => {
  const queryClient = useQueryClient();
  const [isNotiOn, setIsNotiOn] = useState(false);
  const [isImportNotiOn, setIsImportNotiOn] = useState(false);
  const [isActivityOn, setIsActivityOn] = useState(false);
  const [fetchReqBody, setFetchReqBody] = useState<any>();

  const { data: me, isLoading } = useGetUserProfile('userProfile', {
    onSuccess: (data) => {
      setFetchReqBody({
        authCode: data.authCode,
        birthDate: data.birthDate,
        gender: data.gender,
        email: data.email!,
        marketingEmailReceived: data.marketingEmailReceived!,
        marketingPushReceived: data.marketingPushReceived!,
        marketingSmsReceived: data.marketingSmsReceived!,
        name: data.name,
        nickname: data.nickname,
        notiPushReceived: data.notiPushReceived!,
        primePushReceived: data.primePushReceived!,
        tel: data.tel!,
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const { mutate: fatchUserProfile } = useFatchUserProfile('userProfile');
  const checkHandler = (value: any, value2?: any) => {
    fatchUserProfile(
      { ...fetchReqBody, [value]: !me[value], [value2]: !me[value2] },
      {
        onSettled: (data) => {
          queryClient.refetchQueries('userProfile');
        },
      }
    );
  };
  if (isLoading) return <div>...로딩중</div>;
  return (
    <Container>
      <Wrapper>
        <ListBox>
          <ListItem>
            <FlexBetween>
              <TextH4B>중요 푸시 알림</TextH4B>
              <ToggleButton onChange={() => checkHandler('primePushReceived')} status={me?.primePushReceived} />
            </FlexBetween>
            <TextB2R color={theme.greyScale65} padding="2px 0 0 0">
              주문/배송/픽업/구독 알림
            </TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>활동 푸시 알림</TextH4B>
              <ToggleButton onChange={() => checkHandler('notiPushReceived')} status={me?.notiPushReceived} />
            </FlexBetween>
            <TextB2R color={theme.greyScale65} padding="2px 0 0 0">
              후기/프코스팟/쿠폰/포인트 알림
            </TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>광고성 푸시 알림</TextH4B>
              <ToggleButton onChange={() => checkHandler('marketingPushReceived')} status={me?.marketingPushReceived} />
            </FlexBetween>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>마케팅/이벤트 알림</TextH4B>
              <ToggleButton
                onChange={() => checkHandler('marketingEmailReceived', 'marketingSmsReceived')}
                status={me?.marketingEmailReceived}
              />
            </FlexBetween>
            <TextB2R color={theme.greyScale65} padding="2px 0 0 0">
              마케팅 정보 수신 {me?.marketingEmailReceived ? '동의' : '해제'}{' '}
              {dayjs(me?.metaData?.responsedAt).format('YYYY-MM-DD')}
            </TextB2R>
            <TextB3R color={theme.brandColor} padding="8px 0 0 0">
              마케팅 정보 수신 동의 시 2,000원 할인 쿠폰 지급! <br />
              (1인 최대 1회 지급)
            </TextB3R>
          </ListItem>
        </ListBox>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  ${homePadding}
`;

const ListBox = styled.ul``;
const ListItem = styled.li`
  padding: 24px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
`;
export default SettingPage;
