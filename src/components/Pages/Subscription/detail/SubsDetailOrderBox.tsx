import { SubsDeliveryDateChangeSheet } from '@components/BottomSheet/SubsSheet';
import { Button } from '@components/Shared/Button';
import SlideToggle from '@components/Shared/SlideToggle';
import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import useOrderPrice from '@hooks/subscription/useOrderPrice';
import useSubsPaymentFail from '@hooks/subscription/useSubsPaymentFail';
import { MenuImgBox, MenuLi, MenuTextBox, MenuUl } from '@pages/subscription/register';
import { useGetOrderDetail } from '@queries/order';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { FlexBetween, FlexBetweenStart, FlexCol, FlexColEnd, FlexRow, theme } from '@styles/theme';
import { getFormatDate, getFormatPrice, SVGIcon } from '@utils/common';
import Image from 'next/image';
import router from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import MenuPriceBox from '../payment/MenuPriceBox';
import DeliveryInfoGuidBox from './GuideBox/DeliveryInfoGuidBox';
import DietGuideBox from './GuideBox/DietGuideBox';

interface IProps {
  item: any;
  orderId: number;
}

const SubsDetailOrderBox = ({ item, orderId }: IProps) => {
  const [toggleState, setToggleState] = useState(true);
  const dispatch = useDispatch();
  const { data: orderDetail, isLoading } = useGetOrderDetail(['getOrderDetail', 'subscription', orderId], orderId!, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!orderId,
  });

  const priceInfo = useOrderPrice(item.orderMenus, item.orderOptions);
  const { subsFailType } = useSubsPaymentFail(
    orderDetail?.unsubscriptionType,
    orderDetail?.isSubscribing,
    orderDetail?.lastDeliveryDateOrigin,
    orderDetail?.subscriptionPeriod,
    orderDetail?.status
  );

  // TODO : 구독상품 타입에 따라서 주문완료,주문취소,배송완료 변경
  const toggleClickHandler = () => {
    setToggleState((prev) => !prev);
  };

  const deliveryDateChangeHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SubsDeliveryDateChangeSheet item={item} setToggleState={setToggleState} />,
      })
    );
  };

  const goToReview = () => {};

  const deliveryInfoChangeHandler = () => {
    router.push({
      pathname: `/mypage/order-detail/edit/${orderId}`,
      query: { destinationId: item.id, isSubscription: true },
    });
  };
  if (isLoading) return <div>...로딩중</div>;
  return (
    <Container>
      <FlexCol padding="24px 24px">
        <FlexBetween className="box" onClick={toggleClickHandler}>
          <TextH4B color={`${item?.status === 'CANCELED' && '#C8C8C8'}`}>
            배송 {item?.deliveryRound ?? 1}회차 - {getFormatDate(item.deliveryDate)}{' '}
            {item?.status === 'COMPLETED' ? '도착' : '도착예정'}{' '}
            {item?.deliveryDateChangeCount > 0 && <span className="deliveryChange">(배송일변경)</span>}
          </TextH4B>
          <div className={`toggleIcon ${toggleState ? 'down' : ''}`}>
            <SVGIcon name="triangleDown" />
          </div>
        </FlexBetween>
        {item.delivery === 'PARCEL' && (
          <FlexRow padding="8px 0 0 0">
            <SVGIcon name="deliveryTruckIcon" />
            {item.invoiced ? (
              <>
                <TextB2R margin="0 0 0 4px" padding="3px 0 0 0">
                  운송장번호
                </TextB2R>
                <TextH5B margin="0 0 0 4px" padding="3px 0 0 0" color={theme.brandColor} textDecoration="underline">
                  {123123213}
                </TextH5B>
              </>
            ) : (
              <TextB3R margin="0 0 0 4px" padding="3px 0 0 0" color={theme.greyScale65}>
                배송중 단계부터 배송상태 조회가 가능합니다.
              </TextB3R>
            )}
          </FlexRow>
        )}
      </FlexCol>
      <SlideToggle state={toggleState} duration={0.5} change={item}>
        <MenuUl className="menuWrpper">
          {item.orderMenus.map((menu: any, index: number) => (
            <MenuLi key={index} className="menuLi">
              <MenuImgBox>
                <Image
                  src={IMAGE_S3_URL + menu.image.url}
                  alt="상품이미지"
                  width={'100%'}
                  height={'100%'}
                  layout="responsive"
                />
              </MenuImgBox>
              <MenuTextBox>
                <TextB3R textHideMultiline color={`${item?.status === 'CANCELED' && '#C8C8C8'}`}>
                  {menu.menuName} / {menu.menuDetailName}
                </TextB3R>
                <div className="wrap">
                  <TextH5B color={`${item?.status === 'CANCELED' && '#C8C8C8'}`}>
                    {getFormatPrice(String(menu.menuPrice - menu.menuDiscount))}원
                  </TextH5B>
                  <div className="line"></div>
                  <TextB2R color={`${item?.status === 'CANCELED' && '#C8C8C8'}`}>1개</TextB2R>
                </div>
              </MenuTextBox>
            </MenuLi>
          ))}
          {item?.status === 'COMPLETED' && (
            <MenuLi className="menuLi">
              <Button backgroundColor="#fff" color="#242424" border onClick={goToReview}>
                후기 작성하기
              </Button>
            </MenuLi>
          )}
          {orderDetail?.status === 'UNPAID' && (
            <MenuLi className="menuLi">
              <DietGuideBox />
            </MenuLi>
          )}
        </MenuUl>
        <MenuPriceBox
          menuPrice={priceInfo.menuPrice}
          menuDiscount={priceInfo.menuDiscount}
          eventDiscount={0}
          menuOption1={priceInfo.option1}
          menuOption2={priceInfo.option2}
          deliveryPrice={priceInfo.deliveryPrice}
          deliveryType={item.delivery}
          disposable={true}
        />
        <DeliveryInfoBox>
          <TextH4B padding="0 0 24px 0">배송정보</TextH4B>
          <FlexBetween padding="0 0 16px">
            <TextH5B>받는 사람</TextH5B>
            <TextB2R>{item.receiverName}</TextB2R>
          </FlexBetween>
          <FlexBetween padding="0 0 16px">
            <TextH5B>휴대폰 번호</TextH5B>
            <TextB2R>{item.receiverTel.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}</TextB2R>
          </FlexBetween>
          {item.delivery === 'SPOT' ? (
            <>
              <FlexBetween padding="0 0 16px">
                <TextH5B>배송방법</TextH5B>
                <TextB2R>
                  {DELIVERY_TYPE_MAP[item.delivery]} - {DELIVERY_TIME_MAP[item.deliveryDetail]}
                </TextB2R>
              </FlexBetween>
              <FlexBetweenStart padding="0 0 24px">
                <TextH5B>픽업장소</TextH5B>
                <FlexColEnd>
                  <TextB2R>{item.spotName}</TextB2R>
                  <TextB3R color="#717171">
                    {item.location.address}
                    {item.location.addressDetail}
                  </TextB3R>
                </FlexColEnd>
              </FlexBetweenStart>
            </>
          ) : (
            <>
              <FlexBetween padding="0 0 16px">
                <TextH5B>배송방법</TextH5B>
                <TextB2R>{DELIVERY_TYPE_MAP[item.delivery]}</TextB2R>
              </FlexBetween>
              {subsFailType === 'destination' ? (
                <FlexBetweenStart padding="0 0 16px">
                  <TextH5B>픽업장소</TextH5B>
                  <FlexColEnd>
                    <FlexRow>
                      <SVGIcon name="exclamationMark" />
                      <TextB2R padding="2.5px 0 0 4px" className="textRight">
                        {item.location.address}
                      </TextB2R>
                    </FlexRow>
                    <TextB2R className="textRight">{item.location.addressDetail}</TextB2R>
                  </FlexColEnd>
                </FlexBetweenStart>
              ) : (
                <FlexBetweenStart padding="0 0 24px">
                  <TextH5B>픽업장소</TextH5B>
                  <FlexColEnd>
                    <TextB2R className="textRight">{item.location.address}</TextB2R>
                    <TextB2R className="textRight">{item.location.addressDetail}</TextB2R>
                  </FlexColEnd>
                </FlexBetweenStart>
              )}
            </>
          )}
          {subsFailType === 'destination' && <DeliveryInfoGuidBox />}

          <FlexBetween>
            <Button
              onClick={() => {
                item?.status !== 'COMPLETED' &&
                  item?.status !== 'CANCELED' &&
                  item?.status !== 'DELIVERING' &&
                  deliveryInfoChangeHandler();
              }}
              width="48%"
              backgroundColor="#fff"
              color="#242424"
              border
              disabled={
                item?.status === 'COMPLETED' || item?.status === 'CANCELED' || item?.status === 'DELIVERING'
                  ? true
                  : false
              }
            >
              배송정보 변경하기
            </Button>
            <Button
              onClick={() => {
                item?.status !== 'COMPLETED' &&
                  item?.status !== 'CANCELED' &&
                  item?.status !== 'DELIVERING' &&
                  deliveryDateChangeHandler();
              }}
              width="48%"
              backgroundColor="#fff"
              color="#242424"
              border
              disabled={
                item?.status === 'COMPLETED' || item?.status === 'CANCELED' || item?.status === 'DELIVERING'
                  ? true
                  : false
              }
            >
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
  .textRight {
    text-align: right;
  }
  .deliveryChange {
    font-size: 12px;
    color: ${theme.brandColor};
  }
`;
const DeliveryInfoBox = styled.div`
  padding: 24px;
`;

export default SubsDetailOrderBox;
