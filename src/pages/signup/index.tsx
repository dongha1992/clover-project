import React, { useState } from 'react';
import styled from 'styled-components';
import Checkbox from '@components/Checkbox';
import { TextB2R, TextB3R, TextH5B, TextH6B, TextH2B } from '@components/Text';
import BorderLine from '@components/BorderLine';
import {
  FlexRow,
  FlexCol,
  theme,
  homePadding,
  fixedBottom,
} from '@styles/theme';
import Button from '@components/Button';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_USER } from '@store/user';
import { Obj } from '@model/index';

const textPaddingStyle = {
  padding: '0 0 0 8px',
};

const moreTextStyle = {
  textDecoration: 'underline',
  padding: '0 0 0 4px',
  color: theme.greyScale65,
};

const termIdList = [2, 3, 4, 5, 6];

function signup() {
  const [checkTermList, setCheckTermList] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

  const dispatch = useDispatch();

  const allCheckTermHandler = () => {
    if (!isAllChecked) {
      setCheckTermList(termIdList);
    } else {
      setCheckTermList([]);
    }

    setIsAllChecked(!isAllChecked);
  };

  const checkTermHandler = (id: number) => {
    const findItem = checkTermList.find((_id) => _id === id);
    let copied = checkTermList.slice();

    if (findItem) {
      copied = copied.filter((_id) => _id !== id);
    } else {
      copied.push(id);
    }

    if (id === 4) {
      const marketingTerm = [4, 5, 6];
      copied = marketingTerm;
    }

    setCheckTermList(copied);
  };

  const goToAuthTel = () => {
    /*TODO: 필수항목 */
    const userAgreeMarketingTerm = checkTermList.filter((id) => id >= 5);

    dispatch(
      SET_USER({
        emailReceived: userAgreeMarketingTerm.includes(5),
        smsReceived: userAgreeMarketingTerm.includes(6),
      })
    );
    router.push('/signup/auth');
  };
  return (
    <Container>
      <TextWrap>
        <TextH2B>프레시코드에 오신 것을 </TextH2B>
        <TextH2B>환영합니다!</TextH2B>
      </TextWrap>
      <Wrapper>
        <TextH5B>서비스 이용약관</TextH5B>
        <FlexRow padding="16px 0 17px 0">
          <Checkbox onChange={allCheckTermHandler} isSelected={isAllChecked} />
          <TextB2R {...textPaddingStyle}>모두 동의합니다.</TextB2R>
        </FlexRow>
        <BorderLine height={1} />
        <FlexRow padding="16px 0 0 0">
          <Checkbox
            onChange={() => checkTermHandler(2)}
            isSelected={checkTermList.includes(2)}
          />
          <TextB2R {...textPaddingStyle}>[필수] 이용약관에 동의합니다.</TextB2R>
          <TextH6B {...moreTextStyle}>자세히</TextH6B>
        </FlexRow>
        <FlexRow padding="16px 0">
          <Checkbox
            onChange={() => checkTermHandler(3)}
            isSelected={checkTermList.includes(3)}
          />
          <TextB2R {...textPaddingStyle}>
            [필수] 개인정보처리방침에 동의합니다.
          </TextB2R>
          <TextH6B {...moreTextStyle}>자세히</TextH6B>
        </FlexRow>
        <FlexCol>
          <FlexRow>
            <Checkbox
              onChange={() => checkTermHandler(4)}
              isSelected={checkTermList.includes(4)}
            />
            <TextB2R {...textPaddingStyle}>
              [선택] 마케팅 알림 수신에 동의합니다.
            </TextB2R>
          </FlexRow>
          <PaddingWrapper>
            <TextB3R color={theme.brandColor} padding="8px 0 16px 0">
              푸시 알림, 이메일, SMS 수신 등 모두 동의시 2,000원 할인 쿠폰 지급!
              (1인 최대 1회 지급)
            </TextB3R>
            <FlexRow>
              <FlexRow>
                <Checkbox
                  onChange={() => checkTermHandler(5)}
                  isSelected={checkTermList.includes(5)}
                />
                <TextB2R {...textPaddingStyle}>이메일</TextB2R>
              </FlexRow>
              <FlexRow padding="0 0 0 16px">
                <Checkbox
                  onChange={() => checkTermHandler(6)}
                  isSelected={checkTermList.includes(6)}
                />
                <TextB2R {...textPaddingStyle}>SNS</TextB2R>
              </FlexRow>
            </FlexRow>
          </PaddingWrapper>
        </FlexCol>
      </Wrapper>
      <BtnWrapper onClick={goToAuthTel}>
        <Button>동의하고 가입하기</Button>
      </BtnWrapper>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;
const TextWrap = styled.div`
  padding: 32px 0 56px 0;
`;
const Wrapper = styled.div``;
const PaddingWrapper = styled.div`
  padding-left: 26px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;
export default signup;
