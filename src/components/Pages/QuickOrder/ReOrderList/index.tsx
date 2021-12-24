import styled from 'styled-components';
import Slider from 'react-slick';
import { TextB3R, TextH4B, TextH6B, TextH7B } from '@components/Shared/Text';
import { useState } from 'react';
import { theme } from '@styles/theme';

const ReOrderList: React.FC = () => {
  const [active, setActive] = useState(1);
  const [moreBtn, setMoreBtn] = useState(false);
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

  return (
    <Container>
      <Pagination>
        <TextH6B color="#fff">
          {active} / {3}
        </TextH6B>
      </Pagination>
      <ReOrderSlider {...setting}>
        {[1, 2, 3].map((_, index) => {
          return (
            <Slide key={index} data-id={index + 1}>
              <article className="row1">
                <TextH6B color="#fff">스팟배송 - 점심</TextH6B>
                <span></span>
                <TextH6B color="#fff">픽업 12:00-12:30</TextH6B>
              </article>
              <article className="row2">
                <div className="address">
                  <TextH4B color="#fff">맵 헤이그라운드 서울숲점</TextH4B>
                  <TextB3R color={theme.greyScale25}>
                    서울시 성동구 왕십리로 115, 708호
                  </TextB3R>
                </div>
                <OrderButton type="button">주문하기</OrderButton>
              </article>
              <article className="row3">
                <TextB3R color="#fff" margin="0 0 4px 0">
                  터키 브레스트 쳐트니 바게트샌드 외 3개
                </TextB3R>
                {moreBtn ? (
                  <TextB3R color={theme.greyScale25} margin="0 0 4px 0">
                    터키 브레스트 쳐트니 바게트샌드 / 크랜베리 오렌지 치킨
                    바게트샌드 / 크랜베리 오렌지 치킨 바게트샌드 / 크랜베리
                    오렌지 치킨 바게트샌드 / 크랜베리 오렌지 치킨 바게트샌드
                  </TextB3R>
                ) : null}
                <TextB3R
                  className="moreBtn"
                  color={theme.greyScale25}
                  onClick={() => {
                    setMoreBtn((prev) => !prev);
                  }}
                >
                  {!moreBtn ? '더보기' : '접기'}
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
`;

const Pagination = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`;

export default ReOrderList;
