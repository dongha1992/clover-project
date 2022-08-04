import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Checkbox from '@components/Shared/Checkbox';
import { TextB2R, TextB3R, TextH5B, TextH6B, TextH2B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { FlexRow, FlexCol, theme, homePadding, fixedBottom } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import router, { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_SIGNUP_USER } from '@store/user';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';

const textPaddingStyle = {
  padding: '0 0 0 8px',
};

const moreTextStyle = {
  textDecoration: 'underline',
  padding: '0 0 0 4px',
  color: theme.greyScale65,
};

const termIdList = [1, 2, 3, 4];

const SignupPage = () => {
  const [checkTermList, setCheckTermList] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [isAllMarketinngChecked, setIsAllMarketinngChecked] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const isAllAgreed = checkTermList.indexOf(1) !== -1 && checkTermList.indexOf(2) !== -1;

  const allCheckTermHandler = () => {
    if (!isAllChecked) {
      setCheckTermList(termIdList);
      setIsAllMarketinngChecked(true);
    } else {
      setCheckTermList([]);
      setIsAllMarketinngChecked(false);
    }

    setIsAllChecked(!isAllChecked);
  };

  const allCheckMarketingTermHandler = () => {
    const filtered = checkTermList.filter((_id) => _id !== 3 && _id !== 4);
    if (!isAllMarketinngChecked) {
      setCheckTermList([...checkTermList, 3, 4]);
    } else {
      setCheckTermList(filtered);
    }

    setIsAllMarketinngChecked(!isAllMarketinngChecked);
  };

  const checkTermHandler = (id: number) => {
    const findItem = checkTermList.find((_id) => _id === id);
    let copied = checkTermList.slice();

    if (findItem) {
      copied = copied.filter((_id) => _id !== id);
    } else {
      copied.push(id);
    }

    setCheckTermList(copied);
  };

  const goToAuthTel = () => {
    if (!isAllAgreed) {
      return;
    }
    const userAgreeMarketingTerm = checkTermList.filter((id) => id >= 3);
    const loginType = router.query.isApple ? 'APPLE' : 'EMAIL';
    const { recommendCode } = router.query;

    dispatch(
      SET_SIGNUP_USER({
        loginType,
        marketingEmailReceived: userAgreeMarketingTerm.includes(3),
        marketingSmsReceived: userAgreeMarketingTerm.includes(4),
      })
    );

    recommendCode ? router.push(`/signup/auth?recommendCode=${recommendCode}`) : router.push('/signup/auth');
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
          <Checkbox onChange={() => checkTermHandler(1)} isSelected={checkTermList.includes(1)} />
          <TextB2R {...textPaddingStyle}>[필수] 이용약관에 동의합니다.</TextB2R>
          <TextH6B {...moreTextStyle}>자세히</TextH6B>
        </FlexRow>
        <FlexRow padding="16px 0">
          <Checkbox onChange={() => checkTermHandler(2)} isSelected={checkTermList.includes(2)} />
          <TextB2R {...textPaddingStyle}>[필수] 개인정보처리방침에 동의합니다.</TextB2R>
          <TextH6B {...moreTextStyle}>자세히</TextH6B>
        </FlexRow>
        <FlexCol>
          <FlexRow>
            <Checkbox onChange={allCheckMarketingTermHandler} isSelected={isAllMarketinngChecked} />
            <TextB2R {...textPaddingStyle}>[선택] 마케팅 정보 수신에 동의합니다.</TextB2R>
          </FlexRow>
          <PaddingWrapper>
            <TextB3R color={theme.brandColor} padding="8px 0 16px 0">
              마케팅 정보 수신 동의 시 2,000원 할인 쿠폰 지급!
              <br /> (1인 최대 1회 지급)
            </TextB3R>
            <FlexRow>
              <FlexRow>
                <Checkbox onChange={() => checkTermHandler(3)} isSelected={checkTermList.includes(3)} />
                <TextB2R {...textPaddingStyle}>이메일</TextB2R>
              </FlexRow>
              <FlexRow padding="0 0 0 16px">
                <Checkbox onChange={() => checkTermHandler(4)} isSelected={checkTermList.includes(4)} />
                <TextB2R {...textPaddingStyle}>SNS</TextB2R>
              </FlexRow>
            </FlexRow>
          </PaddingWrapper>
        </FlexCol>
      </Wrapper>
      <BtnWrapper onClick={goToAuthTel}>
        <Button disabled={!isAllAgreed} height="100%" borderRadius="0">
          동의하고 가입하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

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
export default SignupPage;
