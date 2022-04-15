import SbsCalendar from '@components/Calendar/SbsCalendar';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB1R, TextB2R, TextB3R, TextH4B, TextH5B, TextH6B, TextH7B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { fixedBottom, FlexBetween, FlexCol, FlexEnd, FlexRow, theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Checkbox from '@components/Shared/Checkbox';
import SlideToggle from '@components/Shared/SlideToggle';
import router from 'next/router';
import { SET_ORDER } from '@store/order';

const SbsRegisterPage = () => {
  const dispatch = useDispatch();
  const { sbsOrderMenus, sbsDeliveryExpectedDate } = useSelector(subscriptionForm);
  const [toggleState, setToggleState] = useState(false);
  const [disposable, setDisposable] = useState(false);
  const clickEvent = () => {
    setToggleState((prev) => !prev);
  };

  const onSubscribe = () => {
    // TODO(young) : 임시
    const reqBody = {
      destinationId: 244,
      delivery: 'PARCEL',
      deliveryDetail: '',
      isSubOrderDelivery: false,
      orderDeliveries: [
        {
          deliveryDate: '2022-04-16',
          orderMenus: [
            {
              menuDetailId: 72,
              menuQuantity: 1,
            },
            {
              menuDetailId: 511,
              menuQuantity: 1,
            },
          ],
          orderOptions: [
            {
              optionId: 1,
              optionQuantity: 1,
            },
          ],
        },
      ],
      type: 'GENERAL',
    };

    dispatch(SET_ORDER(reqBody));
    router.push('/order');
  };

  return (
    <Container>
      <InfoBox onClick={clickEvent}>
        <FlexBetween className="box">
          <TextH4B>구독정보</TextH4B>
          <div className="wrap">
            <TextB2R className="infoText">
              스팟배송 - 점심 / 헤이그라운드
              서sasdasdasdasdsadasdsadasdasdasdasdasdasdasdsadfsdfdsfsdfsdfsasdasdasdasdsadasdsadasdasdasdasdasdasdasdsadfsdfdsfsdfsdf서sasdasdasdasdsadasdsadasdasdasdasdasdasdasdsadfsdfdsfsdfsdf
            </TextB2R>
            <div className={`svgBox ${toggleState ? 'down' : ''}`}>
              <SVGIcon name="triangleDown" />
            </div>
          </div>
        </FlexBetween>
        <SlideInfoBox>
          <SlideToggle state={toggleState} duration={0.5}>
            <ul>
              <li>
                <TextH5B>배송방법</TextH5B>
                <TextB2R>스팟배송 - 점심</TextB2R>
              </li>
              <li>
                <TextH5B>픽업장소</TextH5B>
                <TextB2R>헤이그라운드 서울숲점 10층</TextB2R>
              </li>
              <li>
                <TextH5B>구독기간</TextH5B>
                <TextB2R>정기구독</TextB2R>
              </li>
              <li>
                <TextH5B>구독 시작일</TextH5B>
                <TextB2R>1월 20일 (목)</TextB2R>
              </li>
              <li>
                <TextH5B>배송주기</TextH5B>
                <TextB2R>주 2회 / 화·목</TextB2R>
              </li>
            </ul>
          </SlideToggle>
        </SlideInfoBox>
      </InfoBox>
      <BorderLine height={8} />

      <DietConfirmBox>
        <div className="wrap">
          <TextH4B>식단 확인</TextH4B>
          <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
            전체 식단 보기
          </TextH6B>
        </div>
        <TextB2R color={theme.brandColor}>5주간, 주 2회씩 (화·목) 총 9회 배송되는 식단입니다.</TextB2R>
      </DietConfirmBox>
      <CalendarBox>
        <TextH5B padding="10px 0" color="#fff" backgroundColor={theme.brandColor} center>
          1월, 2월 식단을 모두 확인해 주세요!
        </TextH5B>
        <SbsCalendar sbsDates={sbsDeliveryExpectedDate} deliveryExpectedDate={sbsDeliveryExpectedDate} />
      </CalendarBox>

      <SelectDateInfoBox>
        <DeliveryInfoBox>
          <TextB1R padding="0 0 8px">
            <b>배송 1회차</b> - 1월 20일 (목)
          </TextB1R>
          <TextB2R color={theme.greyScale65}>상품이 품절되면 대체상품이 발송됩니다.</TextB2R>
        </DeliveryInfoBox>
        <TextH5B>필수옵션</TextH5B>
        <MenuUl>
          <MenuLi>
            <MenuImgBox></MenuImgBox>
            <MenuTextBox>
              <TextB3R textHideMultiline>훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드</TextB3R>
              <div className="wrap">
                <TextH5B>2,610원</TextH5B>
                <div className="line"></div>
                <TextB2R>1개</TextB2R>
                <button className="changeBtn">변경</button>
              </div>
            </MenuTextBox>
          </MenuLi>
          <MenuLi>
            <MenuImgBox></MenuImgBox>
            <MenuTextBox>
              <TextB3R textHideMultiline>
                훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드
                / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)
              </TextB3R>
              <div className="wrap">
                <TextH5B>2,610원</TextH5B>
                <div className="line"></div>
                <TextB2R>1개</TextB2R>
                <button className="changeBtn">변경</button>
              </div>
            </MenuTextBox>
          </MenuLi>
        </MenuUl>
        <TextH5B>선택옵션</TextH5B>
        <MenuUl>
          <MenuLi>
            <MenuImgBox></MenuImgBox>
            <MenuTextBox>
              <TextB3R textHideMultiline>
                훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드
                / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)훈제오리 애플시나몬 샐러드 / 미디움 (M)
              </TextB3R>
              <div className="wrap">
                <TextH5B>2,610원</TextH5B>
                <div className="line"></div>
                <TextB2R>1개</TextB2R>
                <button className="changeBtn">변경</button>
              </div>
            </MenuTextBox>
          </MenuLi>
        </MenuUl>
        <Button margin="16px 0 0 0" backgroundColor="transparent" color={theme.black} border>
          + 선택옵션 추가하기
        </Button>
      </SelectDateInfoBox>

      <ReceiptBox>
        <ReceiptUl>
          <ReceiptLi>
            <TextB2R>상품금액</TextB2R>
            <TextB2R>9,700원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>배송비</TextB2R>
            <TextB2R>0원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>포크+물티슈</TextB2R>
            <TextB2R>1개 / 100원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>젓가락+물티슈</TextB2R>
            <TextB2R>1개 / 100원</TextB2R>
          </ReceiptLi>
        </ReceiptUl>
        <FlexBetween padding="16px 0 0" className="btB">
          <TextH4B>배송상품금액</TextH4B>
          <TextH4B>13,200원</TextH4B>
        </FlexBetween>
      </ReceiptBox>

      <DisposableAddBox>
        <TextH4B className="title">일회용품 추가</TextH4B>
        <TextB2R className="content">샐러드·도시락 상품의 수량만큼 일회용품을 추가합니다.</TextB2R>
        <FlexRow>
          <Checkbox
            onChange={() => {
              setDisposable((prev) => !prev);
            }}
            isSelected={disposable}
          />
          <TextB2R padding="0 0 0 8px" className="des">
            일회용품(100원) 총 18개 - 환경부담금 <b>1,800원</b>
          </TextB2R>
        </FlexRow>
      </DisposableAddBox>

      <ReceiptBox>
        <FlexBetween padding="0 0 16px" margin="0 0 16px" className="bbN">
          <TextH5B>총 상품금액</TextH5B>
          <TextB2R>13,200원</TextB2R>
        </FlexBetween>
        <ReceiptUl>
          <ReceiptLi>
            <TextB2R>총 할인금액</TextB2R>
            <TextB2R>13,200원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <FlexRow>
              <TextB2R>구독 할인</TextB2R>
              <SVGIcon name="questionMark" />
            </FlexRow>
            <TextB2R>13,200원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>스팟 이벤트 할인</TextB2R>
            <TextB2R>13,200원</TextB2R>
          </ReceiptLi>
        </ReceiptUl>
        <ReceiptUl>
          <ReceiptLi className="btB" padding="16px 0 0">
            <TextH5B>환경부담금 (일회용품)</TextH5B>
            <TextB2R>5개 / 500원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>포크+물티슈</TextB2R>
            <TextB2R>5개 / 500원</TextB2R>
          </ReceiptLi>
          <ReceiptLi>
            <TextB2R>젓가락+물티슈</TextB2R>
            <TextB2R>4개 / 400원</TextB2R>
          </ReceiptLi>
        </ReceiptUl>
        <FlexBetween padding="16px 0 0" margin="0 0 16px" className="btN">
          <TextH5B>배송비</TextH5B>
          <TextB2R>9회 / 0원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 0" margin="0 0 8px" className="btB">
          <TextH4B>결제예정금액</TextH4B>
          <TextH4B>327,200원</TextH4B>
        </FlexBetween>
        <FlexEnd>
          <Badge>
            <TextH7B>프코회원</TextH7B>
          </Badge>
          <TextB3R>
            구매 시 <b>nP (n%) 적립 예정</b>
          </TextB3R>
        </FlexEnd>
      </ReceiptBox>
      <BottomButton onClick={onSubscribe}>
        <TextH5B>구독하기</TextH5B>
      </BottomButton>
    </Container>
  );
};
const Container = styled.div``;
const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  position: relative;
  .box {
    cursor: pointer;
  }
  .wrap {
    display: flex;
    align-items: center;
    .infoText {
      width: 200px;
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .svgBox {
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
  }
`;
const SlideInfoBox = styled.div`
  ul {
    padding-top: 24px;
    li {
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
`;
const DietConfirmBox = styled.div`
  padding: 24px 24px 16px;
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }
`;
const CalendarBox = styled.div``;
const SelectDateInfoBox = styled.div`
  padding: 24px;
`;
const DeliveryInfoBox = styled.div`
  padding-bottom: 24px;
  > div {
    b {
      font-weight: bold;
    }
  }
`;
const MenuUl = styled.ul``;
const MenuLi = styled.li`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
  button.changeBtn {
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: -19px;
    padding: 10px 16px;
    border: 1px solid #242424;
    border-radius: 8px;
  }
`;
const MenuImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #dedede;
`;
const MenuTextBox = styled.div`
  padding-left: 8px;
  flex: 1;
  .wrap {
    display: flex;
    align-items: center;
    position: relative;
    .line {
      margin: 0 8px;
      width: 1px;
      height: 16px;
      background-color: ${theme.greyScale6};
    }
  }
`;

const ReceiptBox = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  .btB {
    border-top: 1px solid #242424;
  }
  .btN {
    border-top: 1px solid #ececec;
  }
  .bbN {
    border-bottom: 1px solid #ececec;
  }
`;
const ReceiptUl = styled.ul`
  padding-bottom: 16px;
`;
const ReceiptLi = styled.li<{ padding?: string }>`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.padding && props.padding};
  padding-bottom: 8px;
  &:last-of-type {
    padding-bottom: 0;
  }
  svg {
    margin-bottom: 3px;
  }
`;
const DisposableAddBox = styled.div`
  padding: 28px 24px;
  .title {
    padding-bottom: 8px;
  }
  .content {
    color: ${theme.greyScale65};
    padding-bottom: 16px;
  }
  .des {
    b {
      font-weight: bold;
    }
  }
`;
const Badge = styled.div`
  padding: 4px 8px;
  margin-right: 4px;
  background-color: ${theme.brandColor5P};
  color: ${theme.brandColor};
`;

const BottomButton = styled.button`
  ${fixedBottom}
  cursor: pointer;
  background-color: ${theme.black};
  color: #fff;
`;

export default SbsRegisterPage;
