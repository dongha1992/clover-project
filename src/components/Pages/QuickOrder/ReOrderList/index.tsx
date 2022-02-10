import styled from 'styled-components';
import Slider from 'react-slick';
import { TextB3R, TextH4B, TextH6B } from '@components/Shared/Text';
import { useEffect, useState } from 'react';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { OrderDetailSheet } from '@components/BottomSheet/OrderSheet';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { orderForm } from '@store/order';
import getCustomDate from '@utils/getCustomDate';
import dayjs from 'dayjs';
import calculateArrival from '@utils/calculateArrival';

interface IProps {
  tooltipTime: any;
  timer: any;
}

interface IArrivalDate {
  lunch: {
    type: string;
    msg: string;
  };
  dinner: {
    type: string;
    msg: string;
  };
  morning: {
    type: string;
    msg: string;
  };
  parcel: {
    type: string;
    msg: string;
  };
  [prop: string]: any;
}

const ReOrderList = ({ tooltipTime, timer }: IProps) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const { isTimerTooltip } = useSelector(orderForm);
  const { days } = getCustomDate(new Date());

  const [arrivalDate, setArrivalDate] = useState<IArrivalDate>({
    lunch: { type: 'lunch', msg: '' },
    dinner: { type: 'dinner', msg: '' },
    morning: { type: 'morning', msg: '' },
    parcel: { type: 'parcel', msg: '' },
  });

  // TODO : 주문이력 받는 api response어떻게 날라오는지 따라 cartList 수정
  // 임시
  const [cartList, setCartList] = useState([
    { orderType: 'lunch', orderTime: '스팟배송 - 점심', msg: '' },
    { orderType: 'dinner', orderTime: '스팟배송 - 저녁', msg: '' },
    { orderType: 'parcel', orderTime: '택배배송', msg: '' },
  ]);

  const setting = {
    arrows: false,
    dots: false,
    sliderToShow: 1,
    slidersToScroll: 1,
    infinite: false,
    beforeChange: (current: any, next: number) => {
      setActive(next + 1);
    },
  };

  useEffect(() => {
    switch (true) {
      case ['월', '화', '수', '목'].includes(days):
        setArrivalDate({
          lunch: { ...arrivalDate['lunch'], msg: '픽업 12:00-12:30' },
          dinner: { ...arrivalDate['dinner'], msg: '픽업 17:00-17:30' },
          morning: { ...arrivalDate['morning'], msg: '다음날 배송' },
          parcel: { ...arrivalDate['parcel'], msg: '다음날 배송' },
        });
        break;

      case ['금'].includes(days):
        setArrivalDate({
          lunch: { ...arrivalDate['lunch'], msg: '픽업 12:00-12:30' },
          dinner: { ...arrivalDate['dinner'], msg: '픽업 17:00-17:30' },
          morning: { ...arrivalDate['morning'], msg: '다음날 배송' },
          parcel: { ...arrivalDate['parcel'], msg: '다음날 배송' },
        });
        break;
      case ['토'].includes(days):
        setArrivalDate({
          lunch: {
            ...arrivalDate['lunch'],
            msg: `다음주 (${
              dayjs(calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 픽업 12:00-12:30`,
          },
          dinner: {
            ...arrivalDate['dinner'],
            msg: `다음주 (${
              dayjs(calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          morning: {
            ...arrivalDate['morning'],
            msg: `다음주 (${
              dayjs(calculateArrival(dayjs().add(3, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 배송`,
          },
          parcel: {
            ...arrivalDate['parcel'],
            msg: `다음주 (${
              dayjs(calculateArrival(dayjs().add(3, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 배송`,
          },
        });
        break;

      case ['일'].includes(days):
        setArrivalDate({
          lunch: {
            ...arrivalDate['lunch'],
            msg: `이번주 (${
              dayjs(calculateArrival(dayjs().add(1, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 픽업 12:00-17:30`,
          },
          dinner: {
            ...arrivalDate['dinner'],
            msg: `이번주 (${
              dayjs(calculateArrival(dayjs().add(1, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          morning: {
            ...arrivalDate['morning'],
            msg: `이번주 (${
              dayjs(calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 픽업 17:00-17:30`,
          },
          parcel: {
            ...arrivalDate['parcel'],
            msg: `이번주 (${
              dayjs(calculateArrival(dayjs().add(2, 'day').format('YYYY-MM-DD'))).format('dddd')[0]
            }) 배송`,
          },
        });

        break;
    }
  }, []);

  useEffect(() => {
    setCartList((prev) =>
      prev.map((item, index) => {
        item.msg = arrivalDate[item.orderType].msg;
        return item;
      })
    );
  }, [arrivalDate]);

  // TODO : 주문시 배송방법,배송방법 상세,스팟명,픽업정보,주문상품 리스트 넘기기
  const goToPayment = () => {
    router.push('/payment');
  };

  return (
    <Container>
      <Pagination>
        <TextH6B color="#fff">
          {active} / {cartList.length}
        </TextH6B>
      </Pagination>
      <ReOrderSlider {...setting}>
        {cartList.map((item, index) => {
          return (
            <Slide key={index} data-id={index + 1}>
              {index === 0
                ? // TODO : 현재는 isTimerToolip으로 타이머 시간대가되면 툴팁컴포넌트를 보여주는데
                  // 정확한 cartList가 나오면 슬라이드 첫번째 배송상태에따라 표시될지 결정하는 로직이 추가되어야함
                  isTimerTooltip && (
                    <TimerTooltip
                      bgColor={theme.brandColor}
                      color={'#fff'}
                      message={`${tooltipTime} 마감 ${timer} 전`}
                    />
                  )
                : null}
              <article className="row1">
                <TextH6B color="#fff">{item.orderTime}</TextH6B>
                <span></span>
                <TextH6B color="#fff">{item.msg}</TextH6B>
              </article>
              <article className="row2">
                <div className="address">
                  <TextH4B color="#fff">
                    <SVGIcon name={'whiteMapIcon'} /> 헤이그라운드 서울숲점
                  </TextH4B>
                  <TextB3R color={theme.greyScale25}>서울시 성동구 왕십리로 115, 708호</TextB3R>
                </div>
                <OrderButton type="button" onClick={goToPayment}>
                  주문하기
                </OrderButton>
              </article>
              <article className="row3">
                <TextB3R color="#fff" margin="0 0 4px 0">
                  터키 브레스트 쳐트니 바게트샌드 외 3개
                </TextB3R>
                <TextB3R
                  className="moreBtn"
                  color={theme.greyScale25}
                  onClick={() => {
                    dispatch(
                      setBottomSheet({
                        content: <OrderDetailSheet item={item} />,
                      })
                    );
                  }}
                >
                  더보기
                </TextB3R>
              </article>
            </Slide>
          );
        })}
      </ReOrderSlider>
    </Container>
  );
};

const Container = styled.article`
  display: flex;
  position: relative;

  background-color: ${theme.black};
`;

const ReOrderSlider = styled(Slider)`
  width: 100%;
  .slick-list {
    overflow: visible;
  }
`;

const Slide = styled.div`
  padding: 24px;
  .row1 {
    display: flex;
    width: 100%;
    height: 18px;
    align-items: center;
    margin-bottom: 16px;
    span {
      display: inline-block;
      width: 1px;
      height: 12px;
      margin: 0 8px;
      background-color: #fff;
    }
  }
  .row2 {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-bottom: 16px;
    .address {
      svg {
        margin-right: 4px;
      }
    }
  }
  .row3 {
    .moreBtn {
      display: inline-block;
      position: relative;
      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: ${theme.greyScale25};
        position: absolute;
        bottom: 2px;
        left: 0;
      }
    }
  }
`;
const OrderButton = styled.button`
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.4px;
  display: block;
  height: auto;
  width: 75px;
  height: 38px;
  cursor: pointer;
`;

const Pagination = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`;

export default ReOrderList;
