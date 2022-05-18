import SubsCalendar from '@components/Calendar/SubsCalendar';
import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { SET_ALERT } from '@store/alert';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { subscriptionForm } from '@store/subscription';
import { fixedBottom, FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const SubsDeliveryChangeSheet = () => {
  // TODO(young) : 임시로 subscription/set-info에서 캘린더 선택에서 등록한 데이터 사용 추후 교체 해야됨

  const dispatch = useDispatch();
  const { subsDeliveryExpectedDate } = useSelector(subscriptionForm);
  const [sumDelivery, setSumDelivery] = useState(['2022-04-08']);
  const [changeDate, setChangeDate] = useState('날짜 선택');
  const [selectDate, setSelectDate] = useState<Date | undefined>();

  useEffect(() => {
    // console.log(selectDate);
    // console.log(dayjs(selectDate).format('M'));

    if (selectDate) {
      setChangeDate(dateFormat(selectDate));
    }
  }, [selectDate]);

  const dateFormat = (date: Date | string) => {
    return `${dayjs(date).format('M')}월 ${dayjs(date).format('D')}일 (${dayjs(date).format('dd')})`;
  };

  const deliveryChangeHandler = () => {
    if (subsDeliveryExpectedDate[0].deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) {
      dispatch(
        SET_ALERT({
          alertMessage: `변경 전 날짜로\n배송일을 변경할 수 없어요.`,
          submitBtnText: '확인',
        })
      );
    } else {
      dispatch(INIT_BOTTOM_SHEET());
    }
  };

  return (
    <Container>
      <Header>
        <CloseBtn
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
          }}
        >
          <SVGIcon name="defaultCancel24" />
        </CloseBtn>
      </Header>
      <RemainCountBox>
        <TextB2R>
          배송일 변경 잔여 횟수 : <b>5회</b>
        </TextB2R>
      </RemainCountBox>
      <DateChangeDayBox>
        <li>
          <TextB3R padding="0 0 4px">배송 1회차 - 변경 전</TextB3R>
          <TextH4B>{dateFormat(subsDeliveryExpectedDate[0].deliveryDate)}</TextH4B>
        </li>
        <li>
          <TextB3R padding="0 0 4px">배송 1회차 - 변경 후</TextB3R>
          <TextH4B>{changeDate}</TextH4B>
        </li>
      </DateChangeDayBox>
      <SubsCalendar
        subsActiveDates={subsDeliveryExpectedDate}
        deliveryExpectedDate={subsDeliveryExpectedDate}
        sumDelivery={sumDelivery}
        setSelectDate={setSelectDate}
        calendarType="deliveryChange"
      />
      <FlexRow className="sumEx" padding="8px 24px 0">
        <SVGIcon name="brandColorDot" />
        <TextB3R color="#717171" margin="0 0 0 6px">
          함께배송이 있는 배송예정일
        </TextB3R>
      </FlexRow>
      <DateChangeExBox>
        <TextH5B padding="0 0 16px">배송일 변경 안내</TextH5B>
        <TextB3R className="ex">품절이나 시즌오프 등의 상품은 기간 제한이 있을 수 있습니다.</TextB3R>
        <TextB3R className="ex">합배송 상품의 경우 함께 이동됩니다.</TextB3R>
      </DateChangeExBox>
      <BottomButton disabled={selectDate ? false : true} onClick={deliveryChangeHandler}>
        <TextH5B>배송일 변경하기</TextH5B>
      </BottomButton>
    </Container>
  );
};
export const Container = styled.div`
  height: calc(100vh - 56px);
  overflow-y: scroll;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 56px;
`;
export const CloseBtn = styled.button`
  padding: 0;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const RemainCountBox = styled.div`
  padding: 16px 0;
  b {
    font-weight: bold;
  }
`;

const DateChangeDayBox = styled.ul`
  display: flex;
  li {
    width: 50%;
    background-color: #35ad73;
    color: #fff;
    padding: 16px 0 16px 24px;
    &:first-of-type {
      border-right: 0.5px solid #fff;
    }
    &:last-of-type {
      border-left: 0.5px solid #fff;
    }
  }
`;

const DateChangeExBox = styled.div`
  padding: 24px 24px 35px;
  .ex {
    padding-left: 18px;
    position: relative;
    &::before {
      content: '';
      width: 3px;
      height: 3px;
      background-color: #242424;
      position: absolute;
      border-radius: 3px;
      top: 50%;
      transform: translateY(-50%);
      left: 8px;
    }
  }
`;
const BottomButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;
export default SubsDeliveryChangeSheet;
