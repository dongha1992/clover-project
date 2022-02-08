import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Shared/Text';
import { Select, MenuOption } from '@components/Shared/Dropdown';
import { theme, bottomSheetButton } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { useSelector, useDispatch } from 'react-redux';
import { cartForm, SET_CART_LISTS } from '@store/cart';
import { orderForm, SET_TIMER_STATUS } from '@store/order';
import CartSheetItem from './CartSheetItem';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useToast } from '@hooks/useToast';
import { Rolling } from '@components/Rolling';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import calculateArrival from '@utils/calculateArrival';
import getCustomDate from '@utils/getCustomDate';
import { filter, map, flow } from 'lodash/fp';
import dayjs from 'dayjs';

import 'dayjs/locale/ko';

dayjs.locale('ko');
/* TODO: 필수옵션, 선택옵션 api 형에 따라 구조 바꿔야 함. 현재는 목데이터 기준으로 설계함 
        https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=6128%3A177385
*/

interface IRolling {
  id: number;
  type: string;
  description: string;
}

// temp
let disabledDates = ['2022-02-12'];

const CartSheet = () => {
  const [rollingData, setRollingData] = useState([
    {
      id: 1,
      type: '스팟점심',
      description: '9시30분까지 주문 시 12시 전 도착',
    },
    { id: 2, type: '스팟저녁', description: '11시까지 주문 시 17시 전 도착' },
    {
      id: 3,
      type: '새벽배송',
      description: '17시까지 주문 시 다음날 새벽 7시 전 도착',
    },
    {
      id: 4,
      type: '택배배송',
      description: '17시까지 주문 시 당일 발송',
    },
  ]);
  const [selectedMenus, setSelectedMenus] = useState<any>([]);

  const { showToast } = useToast();

  const dispatch = useDispatch();
  const { cartSheetObj } = useSelector(cartForm);
  const { isTimerTooltip } = useSelector(orderForm);

  const deliveryType = checkTimerLimitHelper();

  const canSpotLunchAndDinnerToday = deliveryType === '스팟당일롤링';
  const canSpotLunchAndDinnerTomorrow = deliveryType === '스팟N일롤링';
  const canMorningAndParcelTomorrow = deliveryType === '새벽택배롤링';
  const canMorningAndParcelNday = deliveryType === '새벽택배N일롤링';
  const canSpotDinnerToday = deliveryType === '스팟저녁롤링';

  const checkArrivaldate = (): string => {
    const { days } = getCustomDate(new Date());
    let isFriday = days === '금';
    let isSaturday = days === '토';
    let isSunday = days === '일';
    let isWeekdays = !['금', '토', '일'].includes(days);

    isFriday = true;

    switch (true) {
      case isFriday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(4, 'day').format('YYYY-MM-DD');
        }
      }

      case isSaturday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(3, 'day').format('YYYY-MM-DD');
        }
      }

      case isSunday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(2, 'day').format('YYYY-MM-DD');
        } else if (canSpotLunchAndDinnerTomorrow) {
          return dayjs().add(1, 'day').format('YYYY-MM-DD');
        }
      }
      case isWeekdays: {
        if (canSpotLunchAndDinnerTomorrow) {
          return dayjs().add(1, 'day').format('YYYY-MM-DD');
        }
      }

      default: {
        return dayjs().add(1, 'day').format('YYYY-MM-DD');
      }
    }
  };

  const checkIsValidRollingMsg = () => {
    let arrivalDate = '';

    // N일에 걸리는 경우, N일을 따로 구해줘야 함
    // 관련 피그마 : https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=7214%3A111244

    if (canMorningAndParcelNday || canSpotLunchAndDinnerTomorrow) {
      arrivalDate = calculateArrival(checkArrivaldate(), disabledDates).split(
        '-'
      )[2];
    }

    let newRollingData: IRolling[] = [];

    switch (true) {
      case canSpotLunchAndDinnerTomorrow:
        {
          newRollingData = flow(
            filter((item: IRolling) => item.id < 3),
            map((data: IRolling) => {
              const isSpotLunch = data.type === '스팟점심';
              return {
                ...data,
                description: isSpotLunch
                  ? `9시30분까지 주문 시 ${arrivalDate}일 12시 전 도착`
                  : `11시까지 주문 시 ${arrivalDate}일 17시 전 도착`,
              };
            })
          )(rollingData);
        }
        break;

      case canSpotLunchAndDinnerToday:
        {
          newRollingData = rollingData.filter((item) => item.id < 3);
        }
        break;

      case canMorningAndParcelNday:
        {
          newRollingData = flow(
            filter((item: IRolling) => item.id > 2),
            map((data: IRolling) => {
              const isParcel = data.type === '택배배송';
              return {
                ...data,
                description: `17시까지 주문 시 ${
                  isParcel
                    ? `${arrivalDate}일 당일 발송`
                    : `${arrivalDate}일 새벽 7시 전 도착`
                }`,
              };
            })
          )(rollingData);
        }
        break;
      case canMorningAndParcelTomorrow:
        {
          newRollingData = rollingData.filter((item) => item.id > 2);
        }
        break;
      case canSpotDinnerToday:
        {
          newRollingData = rollingData.filter((item) => item.id === 2);
        }
        break;
    }

    setRollingData(newRollingData);
  };

  const selectMenuHandler = (menu: any) => {
    setSelectedMenus([...selectedMenus, menu]);
  };

  const getCalculateTotalPrice = () => {
    return selectedMenus.reduce((acc: number, cur: any) => {
      return acc + cur.price;
    }, 0);
  };

  const removeCartItemHandler = (id: number): void => {
    const newSelectedMenus = selectedMenus.filter(
      (item: any) => item.id !== id
    );
    setSelectedMenus(newSelectedMenus);
  };

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
    dispatch(SET_CART_LISTS(selectedMenus));
    setTimeout(() => {
      showToast({ message: '장바구니에 담겼습니다.' });
    }, 500);
  };

  useEffect(() => {
    const isRolling = [
      '스팟저녁롤링',
      '새벽택배롤링',
      '새벽택배N일롤링',
      '스팟당일롤링',
      '스팟N일롤링',
    ].includes(deliveryType);

    if (isRolling) {
      checkIsValidRollingMsg();
    }

    if (!isRolling && deliveryType) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  }, []);

  if (!Object.keys(cartSheetObj).length) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        옵션 선택
      </TextH5B>
      <Wrapper>
        <MainOption>
          <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
            필수옵션
          </TextH5B>
          <Select placeholder="필수옵션" type={'main'}>
            {cartSheetObj?.main.map((option: any, index: number) => (
              <MenuOption
                key={index}
                option={option}
                selectMenuHandler={selectMenuHandler}
              />
            ))}
          </Select>
        </MainOption>
        <OptionalOption>
          {cartSheetObj?.secondary.length > 0 ? (
            <>
              <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
                선택옵션
              </TextH5B>
              <Select placeholder="선택옵션" type={'optional'}>
                {cartSheetObj?.secondary.map((option: any, index: number) => (
                  <MenuOption
                    key={index}
                    option={option}
                    selectMenuHandler={selectMenuHandler}
                  />
                ))}
              </Select>
            </>
          ) : null}
        </OptionalOption>
        {selectedMenus.length > 0 ? (
          <SelectedCartItemContainer>
            {selectedMenus.map((menu: any, index: number) => (
              <CartSheetItem
                menu={menu}
                key={index}
                padding="16px"
                removeCartItemHandler={removeCartItemHandler}
              />
            ))}
          </SelectedCartItemContainer>
        ) : null}
      </Wrapper>
      <OrderInfoContainer>
        <TotalSumContainer>
          <TextH5B>총 {selectedMenus.length}개</TextH5B>
          <TextH5B>{getCalculateTotalPrice()}원</TextH5B>
        </TotalSumContainer>
        <BorderLine height={1} margin="13px 0 10px 0" />
        <DeliveryInforContainer>
          {isTimerTooltip ? (
            <CheckTimerByDelivery isCartSheet />
          ) : (
            <Rolling list={rollingData} />
          )}
        </DeliveryInforContainer>
      </OrderInfoContainer>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          장바구니에 담기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 0 24px;
  width: 100%;
`;

const MainOption = styled.div`
  width: 100%;
`;
const OptionalOption = styled.div`
  width: 100%;
`;

const OrderInfoContainer = styled.div`
  padding: 0 24px;
  margin-bottom: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const SelectedCartItemContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  overflow-y: scroll;
  max-height: 220px;
`;

const TotalSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeliveryInforContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CartSheet);
