import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexEnd, FlexCol, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { TextB2R, TextH2B, TextH5B, TextH4B, TextB3R } from '@components/Shared/Text';
import router, { useRouter } from 'next/router';
import { theme } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userProfile } from '@api/user';
import { postNotificationApi } from '@api/menu';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';
import { commonSelector } from '@store/common';
import { PHONE_REGX } from '@pages/signup/auth';
import Validation from '@components/Pages/User/Validation';
import Checkbox from '@components/Shared/Checkbox';
import { useToast } from '@hooks/useToast';
import { IChangeMe } from '@model/index';
import { useInterval } from '@hooks/useInterval';
import { INIT_CATEGORY_FILTER, filterSelector } from '@store/filter';
import { Obj, IMenus } from '@model/index';

const LIMIT = 240;
const FIVE_MINUTE = 300;

interface IProps {
  menuId: number;
  isDetailBottom?: boolean;
  returnPath?: string;
}

const ReopenSheet = ({ menuId, isDetailBottom, returnPath }: IProps) => {
  const dispatch = useDispatch();

  const { me } = useSelector(userForm);
  const { isMobile } = useSelector(commonSelector);

  const { showToast, hideToast } = useToast();

  const [userTel, setUserTel] = useState<string>('');
  const [isMarketinngChecked, setIsMarketinngChecked] = useState<boolean>(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { type } = useSelector(filterSelector);

  const { data: user, isLoading: infoLoading } = useQuery(
    'getUserProfile',
    async () => {
      const { data } = await userProfile();

      if (data.code === 200) {
        return data.data;
      }
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {},
      onError: () => {},
    }
  );

  const { mutateAsync: mutatePostNoti } = useMutation(
    async () => {
      const reqBody = {
        menuId,
        tel: userTel,
        type: 'REOPEN',
      };

      const { data } = await postNotificationApi({ ...reqBody });
    },
    {
      onSuccess: async (data) => {
        hideToast();
        showToast({ message: '?????? ????????? ???????????????!' });
        dispatch(INIT_BOTTOM_SHEET());
        if (isDetailBottom || router.pathname === '/menu/[menuId]') {
          await queryClient.refetchQueries('getMenuDetail');
        } else {
          queryClient.setQueryData(['getMenus', type], (previous: any) => {
            return previous.map((_item: IMenus) => {
              if (_item.id === menuId) {
                return { ..._item, reopenNotificationRequested: true };
              }
              return _item;
            });
          });
          // router.push(returnPath ?? router.pathname);
        }
      },
      onError: async (error: any) => {
        if (error.code === 1000) {
          return dispatch(
            SET_ALERT({
              alertMessage: '??? ??? ?????? ????????? ??????????????????.',
              submitBtnText: '??????',
            })
          );
        } else {
          return dispatch(
            SET_ALERT({
              alertMessage: error.message,
              submitBtnText: '??????',
            })
          );
        }
      },
    }
  );

  const checkMarketingTermHandler = () => {
    setIsMarketinngChecked(!isMarketinngChecked);
  };

  const goToNoti = () => {
    if (!isMarketinngChecked) return;
    mutatePostNoti();
  };

  const getQuery = (path: string) => {
    return path.split('?')[0];
  };

  const goToMypage = () => {
    const path = getQuery(router.asPath);
    if (me?.joinType! !== 'EMAIL') {
      router.push(`/mypage/profile?returnPath=${encodeURIComponent(String(path))}`);
    } else {
      router.push(`/mypage/profile/confirm?returnPath=${encodeURIComponent(String(path))}`);
    }

    dispatch(INIT_BOTTOM_SHEET());
  };

  useEffect(() => {
    setUserTel(user?.tel!);
    setIsMarketinngChecked(me?.marketingSmsReceived!);
  }, [me, user]);

  return (
    <Container isMobile={isMobile}>
      <Header>
        <div />
        <TextH4B>????????????</TextH4B>
        <div
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
          }}
        >
          <SVGIcon name="defaultCancel24" />
        </div>
      </Header>
      <Body>
        <FlexCol margin="24px 0 56px 0">
          <TextH2B>?????? ?????????</TextH2B>
          <TextH2B>??????????????????????</TextH2B>
        </FlexCol>
        <FlexCol padding="0 0 32px 0">
          <TextH5B padding="0 0 9px 0">????????? ??????</TextH5B>
          <FlexRow>
            <TextInput placeholder="????????? ?????? (-??????)" inputType="number" disabled={true} value={me?.tel} />
            <Button width="40%" margin="0 0 0 8px" onClick={goToMypage}>
              ???????????? ??????
            </Button>
          </FlexRow>
        </FlexCol>
        <TextB2R color={theme.greyScale65}>
          {
            "?????? ?????? ????????? ????????? ????????? ??????????????? ????????? ?????????. '????????????'??? ???????????? ????????? ??? ?????? ??????, ????????? ????????? ?????? ???????????? ????????? ???????????? ????????? ???????????? ????????? ?????????."
          }
        </TextB2R>
        <FlexRow margin="17px 0 0 0" onClick={checkMarketingTermHandler}>
          <Checkbox onChange={checkMarketingTermHandler} isSelected={isMarketinngChecked} />
          <TextB2R padding="2px 0 0 8px">{'[??????] ????????? ?????? ????????? ???????????????.'}</TextB2R>
        </FlexRow>
      </Body>
      <BtnWrapper onClick={goToNoti}>
        <Button height="100%" borderRadius="0" disabled={!isMarketinngChecked}>
          ????????????
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div<{ isMobile: boolean }>`
  ${homePadding};
  padding-top: 24px;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        height: 85vh;
      `;
    } else {
      return css`
        height: 96vh;
      `;
    }
  }}
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimerWrapper = styled.div`
  position: absolute;
  left: 55%;
`;

const PhoneValidCheck = styled.div`
  position: relative;
  margin: 4px 0;
  > svg {
    position: absolute;
    right: 35%;
    top: -60%;
    z-index: 10;
  }
`;

const BtnWrapper = styled.div`
  ${fixedBottom};
  left: 0%;
`;

const ConfirmWrapper = styled.div`
  margin-top: 8px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  > svg {
    position: absolute;
    right: 35%;
    top: 35%;
  }
`;

export default ReopenSheet;
