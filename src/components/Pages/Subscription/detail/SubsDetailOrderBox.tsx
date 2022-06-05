import { SubsDeliveryChangeSheet } from '@components/BottomSheet/SubsSheet';
import { Button } from '@components/Shared/Button';
import SlideToggle from '@components/Shared/SlideToggle';
import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { MenuImgBox, MenuLi, MenuTextBox, MenuUl } from '@pages/subscription/register';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { FlexBetween, FlexBetweenStart, FlexColEnd } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { MenuPriceContainer, MenuPriceLi, MenuPriceUl } from '../payment/MenusPriceBox';

const SubsDetailOrderBox = () => {
  const [toggleState, setToggleState] = useState(false);

  const dispatch = useDispatch();

  // TODO : 구독상품 타입에 따라서 주문완료,주문취소,배송완료 변경
  const toggleClickHandler = () => {
    setToggleState((prev) => !prev);
  };

  const deliveryDateChangeHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsDeliveryChangeSheet />,
      })
    );
  };
  return (
    <Container className="test">
      <FlexBetween padding="24px 0" className="box" onClick={toggleClickHandler}>
        <TextH4B>배송 1회차 - 1월 20일 (목) 도착예정</TextH4B>
        <div className={`toggleIcon ${toggleState ? 'down' : ''}`}>
          <SVGIcon name="triangleDown" />
        </div>
      </FlexBetween>
      <SlideToggle state={toggleState} duration={0.5}>
        <MenuUl className="menuWrpper">
          {[1, 2, 3].map((item, index) => (
            <MenuLi key={index} className="menuLi">
              <MenuImgBox></MenuImgBox>
              <MenuTextBox>
                <TextB3R textHideMultiline>
                  훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬
                  샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)
                </TextB3R>
                <div className="wrap">
                  <TextH5B>2,610원</TextH5B>
                  <div className="line"></div>
                  <TextB2R>1개</TextB2R>
                </div>
              </MenuTextBox>
            </MenuLi>
          ))}
        </MenuUl>
        <MenuPriceContainer>
          <MenuPriceUl>
            <MenuPriceLi>
              <TextB2R>상품금액</TextB2R>
              <TextB2R>9,700원</TextB2R>
            </MenuPriceLi>
            <MenuPriceLi>
              <TextB2R>배송비</TextB2R>
              <TextB2R>0원</TextB2R>
            </MenuPriceLi>
            <MenuPriceLi>
              <TextB2R>포크+물티슈</TextB2R>
              <TextB2R>1개 / 100원</TextB2R>
            </MenuPriceLi>
            <MenuPriceLi>
              <TextB2R>젓가락+물티슈</TextB2R>
              <TextB2R>1개 / 100원</TextB2R>
            </MenuPriceLi>
          </MenuPriceUl>
          <FlexBetween padding="16px 0 0" className="btB">
            <TextH4B>배송상품금액</TextH4B>
            <TextH4B>13,200원</TextH4B>
          </FlexBetween>
        </MenuPriceContainer>
        <DeliveryInfoBox>
          <TextH4B padding="0 0 24px 0">배송정보</TextH4B>
          <FlexBetween padding="0 0 16px">
            <TextH5B>받는 사람</TextH5B>
            <TextB2R>김프코</TextB2R>
          </FlexBetween>
          <FlexBetween padding="0 0 16px">
            <TextH5B>휴대폰 번호</TextH5B>
            <TextB2R>010-2222-2222</TextB2R>
          </FlexBetween>
          <FlexBetween padding="0 0 16px">
            <TextH5B>배송방법</TextH5B>
            <TextB2R>스팟배송 - 점심</TextB2R>
          </FlexBetween>
          <FlexBetweenStart padding="0 0 24px">
            <TextH5B>픽업장소</TextH5B>
            <FlexColEnd>
              <TextB2R>헤이그라운드 서웊숲점</TextB2R>
              <TextB3R color="#717171">서울 성동구 왕십리로 115 10층</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetween>
            <Button width="48%" backgroundColor="#fff" color="#242424" border>
              배송정보 변경하기
            </Button>
            <Button onClick={deliveryDateChangeHandler} width="48%" backgroundColor="#fff" color="#242424" border>
              배송일 변경하기
            </Button>
          </FlexBetween>
        </DeliveryInfoBox>
      </SlideToggle>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  .toggleIcon {
    svg {
      transition: all 0.5s;
      margin-bottom: 3px;
    }
    &.down {
      svg {
        transform: rotate(-180deg);
      }
    }
  }
  ul.menuWrpper {
    padding: 0 24px 24px;
    li.menuLi {
      padding-top: 0;
      &:last-of-type {
        padding-bottom: 0;
      }
      border: none;
    }
  }
`;
const DeliveryInfoBox = styled.div`
  padding: 24px;
`;

export default SubsDetailOrderBox;
