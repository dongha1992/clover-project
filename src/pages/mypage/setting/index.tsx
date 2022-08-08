import React, { useEffect, useState } from 'react';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextB1R, TextB2R } from '@components/Shared/Text';
import { ToggleButton } from '@components/Shared/Button';
import { userChangeInfo } from '@api/user';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { Obj } from '@model/index';
import { userForm } from '@store/user';

const SettingPage = () => {
  const [notiSet, setNotiSet] = useState<Obj>({
    primePushReceived: false,
    marketingPushReceived: false,
    notiPushReceived: false,
    marketingEmailReceived: false,
    marketingSmsReceived: false,
  });

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { me } = useSelector(userForm);

  const { mutateAsync: mutationEditProfile } = useMutation(
    async () => {
      const reqBody = {
        ...notiSet,
      };
      const { data } = await userChangeInfo(reqBody);
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getUserProfile');
      },
      onError: async (error: any) => {
        console.error(error);
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

  const changeNotificationHandler = (name: string) => {
    setNotiSet({ ...notiSet, [name]: !notiSet[name] });
  };

  useEffect(() => {
    return () => {
      mutationEditProfile();
    };
  }, []);

  useEffect(() => {
    setNotiSet({
      marketingEmailReceived: me?.marketingEmailReceived,
      marketingPushReceived: me?.marketingPushReceived,
      marketingSmsReceived: me?.marketingSmsReceived,
      notiPushReceived: me?.notiPushReceived,
      primePushReceived: me?.primePushReceived,
    });
  }, [me]);

  return (
    <Container>
      <Wrapper>
        <ListBox>
          <ListItem>
            <FlexBetween>
              <TextH4B>중요 알림</TextH4B>
              <ToggleButton
                onChange={() => changeNotificationHandler('primePushReceived')}
                status={notiSet.primePushReceived}
              />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>상품 주문/배송/픽업/재입고/구독 알림</TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>활동 알림</TextH4B>
              <ToggleButton
                onChange={() => changeNotificationHandler('notiPushReceived')}
                status={notiSet.notiPushReceived}
              />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>후기/스팟/친구초대 활동 알림</TextB2R>
          </ListItem>
          <ListItem>
            <FlexBetween>
              <TextH4B>마케팅/이벤트 알림</TextH4B>
              <ToggleButton
                onChange={() => changeNotificationHandler('marketingPushReceived')}
                status={notiSet.marketingPushReceived}
              />
            </FlexBetween>
            <TextB2R color={theme.greyScale65}>마케팅 정보 수신 해제 YYYY-MM-DD</TextB2R>
          </ListItem>
        </ListBox>

        {notiSet.marketingPushReceived && (
          <FlexCol>
            <FlexBetween padding="0 0 18px 0">
              <TextB1R>이메일</TextB1R>
              <ToggleButton
                onChange={() => changeNotificationHandler('marketingEmailReceived')}
                status={notiSet.marketingEmailReceived}
              />
            </FlexBetween>
            <FlexBetween>
              <TextB1R>SMS</TextB1R>
              <ToggleButton
                onChange={() => changeNotificationHandler('marketingSmsReceived')}
                status={notiSet.marketingSmsReceived}
              />
            </FlexBetween>
          </FlexCol>
        )}
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
