import styled from 'styled-components';
import Slider from 'react-slick';
import { TextB3R, TextH4B, TextH6B, TextH7B } from '@components/Shared/Text';
import { useEffect, useState } from 'react';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET, setBottomSheet } from '@store/bottomSheet';
import { OrderDetailSheet } from '@components/BottomSheet/OrderSheet';

interface IProps {
  pushStatus: string;
  children: any;
  weeks: number;
  time: number;
  arrivalDate: any;
}

const ReOrderList = ({
  children,
  pushStatus,
  weeks,
  time,
  arrivalDate,
}: IProps) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);

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
    dispatch(INIT_BOTTOM_SHEET());
  }, []);

  useEffect(() => {
    // if (pushStatus === cartList[0].orderType) {
    // }

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
              {index === 0 ? children : null}
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
                  <TextB3R color={theme.greyScale25}>
                    서울시 성동구 왕십리로 115, 708호
                  </TextB3R>
                </div>
                <OrderButton type="button" onClick={goToPayment}>
                  주문하기
                </OrderButton>
              </article>
              <article className="row3">
                <TextB3R color="#fff" margin="0 0 4px 0">
                  터키 브레스트 쳐트니 바게트샌드 외 3개
                </TextB3R>
                {/* {moreBtn ? (
                  <TextB3R color={theme.greyScale25} margin="0 0 4px 0">
                    터키 브레스트 쳐트니 바게트샌드 / 크랜베리 오렌지 치킨
                    바게트샌드 / 크랜베리 오렌지 치킨 바게트샌드 / 크랜베리
                    오렌지 치킨 바게트샌드 / 크랜베리 오렌지 치킨 바게트샌드
                  </TextB3R>
                ) : null} */}
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
