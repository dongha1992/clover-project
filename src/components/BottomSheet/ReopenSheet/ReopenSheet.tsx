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
import { userAuthTel, userConfirmTel, userChangeInfo, userProfile } from '@api/user';
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
}

const ReopenSheet = ({ menuId, isDetailBottom }: IProps) => {
  const dispatch = useDispatch();

  let authTimerRef = useRef(300);
  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const { me } = useSelector(userForm);
  const { isMobile } = useSelector(commonSelector);

  const { showToast } = useToast();

  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [userTel, setUserTel] = useState<string>('');
  const [isAuthTel, setIsAuthTel] = useState(false);
  const [delay, setDelay] = useState<number | null>(null);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [authCodeConfirm, setAuthCodeConfirm] = useState<boolean>(false);
  const [isMarketinngChecked, setIsMarketinngChecked] = useState<boolean>(false);
  const [isChangedTel, setIsChangedTel] = useState<boolean>(true);

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
        showToast({ message: '알림 신청을 완료했어요!' });
        dispatch(INIT_BOTTOM_SHEET());
        if (isDetailBottom) {
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
        }
      },
      onError: async (error: any) => {
        if (error.code === 1000) {
          return dispatch(
            SET_ALERT({
              alertMessage: '알 수 없는 에러가 발생했습니다.',
              submitBtnText: '확인',
            })
          );
        } else {
          return dispatch(
            SET_ALERT({
              alertMessage: error.message,
              submitBtnText: '확인',
            })
          );
        }
      },
    }
  );

  const { mutateAsync: mutationEditProfile } = useMutation(
    async (reqBody: IChangeMe) => {
      const { data } = await userChangeInfo(reqBody);
      return data;
    },
    {
      onSuccess: async () => {
        setIsChangedTel(true);
        await queryClient.refetchQueries('getUserProfile');
      },
      onError: async (error: any) => {
        console.error(error);
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

  const timerHandler = useCallback((): void => {
    const _minute = Math.floor(authTimerRef.current / 60);
    const _second = Math.floor(authTimerRef.current % 60);

    authTimerRef.current -= 1;

    setMinute(_minute);
    setSecond(_second);
  }, [second, minute]);

  useInterval(timerHandler, delay);

  const phoneNumberInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (PHONE_REGX.test(value)) {
      setPhoneValidation(true);
    } else {
      setPhoneValidation(false);
    }
    setUserTel(value);
  };

  const getAuthTel = async () => {
    if (userTel.length > 0 && !phoneValidation) {
      dispatch(
        SET_ALERT({
          alertMessage: `잘못된 휴대폰 번호 입니다.\n\확인 후 다시 시도 해 주세요.`,
          submitBtnText: '확인',
        })
      );
      return;
    }

    if (oneMinuteDisabled) {
      dispatch(SET_ALERT({ alertMessage: '잠시 후 재요청해 주세요.' }));
      return;
    }

    try {
      const { data } = await userAuthTel({ tel: userTel });

      if (data.code === 200) {
        dispatch(
          SET_ALERT({
            alertMessage: `인증번호 전송했습니다.`,
            submitBtnText: '확인',
          })
        );
        resetTimer();
        setOneMinuteDisabled(true);
        setDelay(1000);
        if (isOverTime) {
          setIsOverTime(false);
          resetTimer();
        }
      }
    } catch (error: any) {
      if (error.code === 2000) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 사용 중인 휴대폰 번호예요. 입력한 번호를 확인해 주세요.',
          })
        );
      } else if (error.code === 2001) {
        dispatch(
          SET_ALERT({
            alertMessage: '하루 인증 요청 제한 횟수 10회를 초과했습니다.',
          })
        );
      } else {
        dispatch(
          SET_ALERT({
            alertMessage: '알 수 없는 에러 발생',
          })
        );
      }
      console.error(error);
    }
  };

  const otherAuthTelHandler = () => {
    setIsAuthTel(true);
    setUserTel('');
    setPhoneValidation(false);
    setIsChangedTel(false);
  };

  const getAuthCodeConfirm = async () => {
    if (!authCodeValidation || authCodeConfirm || isOverTime) return;
    if (authCodeNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;

        try {
          const { data } = await userConfirmTel({ tel: userTel, authCode });
          if (data.code === 200) {
            dispatch(SET_ALERT({ alertMessage: '인증이 완료되었습니다.' }));
            setAuthCodeConfirm(true);
            setDelay(null);

            const reqBody = {
              authCode: authCodeNumberRef?.current?.value!,
              birthDate: me?.birthDate || '',
              gender: me?.gender || 'NONE',
              email: me?.email!,
              marketingEmailReceived: me?.marketingEmailReceived!,
              marketingPushReceived: me?.marketingPushReceived!,
              marketingSmsReceived: me?.marketingSmsReceived!,
              name: me?.name!,
              nickName: me?.nickName!,
              notiPushReceived: me?.notiPushReceived!,
              primePushReceived: me?.primePushReceived!,
              tel: userTel,
            };
            mutationEditProfile(reqBody);
          }
        } catch (error: any) {
          if (error.code === 2002) {
            dispatch(SET_ALERT({ alertMessage: '인증번호가 올바르지 않습니다.', submitBtnText: '확인' }));
          } else {
            dispatch(SET_ALERT({ alertMessage: error.message, submitBtnText: '확인' }));
          }
          console.error(error);
        }
      }
    }
  };

  const resetTimer = () => {
    authTimerRef.current = FIVE_MINUTE;
    // authTimerRef.current = 5;
  };

  const telKeyPressHandler = (e: any) => {
    if (e.key === 'Enter') {
      getAuthTel();
    }
  };

  const authCodeInputHandler = () => {
    if (authCodeNumberRef.current) {
      const authCode = authCodeNumberRef.current?.value;
      if (authCode.length > 5) {
        setAuthCodeValidation(true);
      } else {
        setAuthCodeValidation(false);
      }
    }
  };

  const checkMarketingTermHandler = () => {
    setIsMarketinngChecked(!isMarketinngChecked);
  };

  const goToNoti = () => {
    if (!isMarketinngChecked) return;
    if (!isChangedTel) {
      return dispatch(SET_ALERT({ alertMessage: '휴대폰 인증을 다시 해주세요.' }));
    }
    mutatePostNoti();
  };

  useEffect(() => {
    setUserTel(user?.tel!);
    setIsMarketinngChecked(me?.marketingSmsReceived!);
  }, [me, user]);

  useEffect(() => {
    if (authTimerRef.current < 0) {
      setDelay(null);
      setIsOverTime(true);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < LIMIT) {
      setOneMinuteDisabled(false);
    }
  }, [second]);

  return (
    <Container isMobile={isMobile}>
      <Header>
        <div />
        <TextH4B>알림신청</TextH4B>
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
          <TextH2B>오픈 알림을</TextH2B>
          <TextH2B>신청하시겠어요?</TextH2B>
        </FlexCol>
        <FlexCol padding="0 0 32px 0">
          <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
          <FlexRow>
            <TextInput
              placeholder="휴대폰 번호 (-제외)"
              inputType="number"
              eventHandler={phoneNumberInputHandler}
              value={userTel || ''}
              disabled={!isAuthTel}
              keyPressHandler={telKeyPressHandler}
            />
            {isAuthTel ? (
              <Button width="40%" margin="0 0 0 8px" onClick={getAuthTel}>
                {delay ? '재요청' : '인증요청'}
              </Button>
            ) : (
              <Button width="40%" margin="0 0 0 8px" onClick={otherAuthTelHandler}>
                다른번호 인증
              </Button>
            )}
          </FlexRow>
          <PhoneValidCheck>
            {isAuthTel && !phoneValidation && userTel.length > 0 && (
              <Validation>휴대폰 번호를 정확히 입력해주세요.</Validation>
            )}
            {isAuthTel && phoneValidation && <SVGIcon name="confirmCheck" />}
            {isAuthTel && (
              <ConfirmWrapper>
                <TextInput
                  placeholder="인증 번호 입력"
                  eventHandler={authCodeInputHandler}
                  ref={authCodeNumberRef}
                  inputType="number"
                />
                <Button
                  width="40%"
                  margin="0 0 0 8px"
                  disabled={!authCodeValidation || authCodeConfirm || isOverTime}
                  onClick={getAuthCodeConfirm}
                >
                  확인
                </Button>
                {authCodeConfirm && <SVGIcon name="confirmCheck" />}
                {delay && (
                  <TimerWrapper>
                    <TextB3R color={theme.brandColor}>
                      {minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
                    </TextB3R>
                  </TimerWrapper>
                )}
              </ConfirmWrapper>
            )}
          </PhoneValidCheck>
          {isOverTime && <Validation>인증 유효시간이 지났습니다.</Validation>}
        </FlexCol>
        <TextB3R color={theme.greyScale65}>
          {
            " 알림 신청 시 인증된 번호는 회원정보에도 업데이트 됩니다. '확인'을 누르시면 마케팅 및 광고 문자, 알림톡 수신을 위한 개인정보 제공에 동의하신 것으로 간주되니 참고해주세요."
          }
        </TextB3R>
        <FlexRow margin="17px 0 0 0">
          <Checkbox onChange={checkMarketingTermHandler} isSelected={isMarketinngChecked} />
          <TextB2R padding="2px 0 0 8px">{'[필수] 마케팅 정보 수신에 동의합니다.'}</TextB2R>
        </FlexRow>
      </Body>
      <BtnWrapper onClick={goToNoti}>
        <Button height="100%" borderRadius="0" disabled={!isMarketinngChecked}>
          확인
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
