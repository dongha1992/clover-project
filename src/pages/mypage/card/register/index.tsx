import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import {
  textBody2,
  theme,
  homePadding,
  FlexCenter,
  FlexStart,
  FlexRow,
  fixedBottom,
  customInput,
} from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { Obj } from '@model/index';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { registerCard } from '@api/card';
import dynamic from 'next/dynamic';

const Checkbox = dynamic(() => import('@components/Shared/Checkbox'), {
  ssr: false,
});

interface ICardType {
  id: number;
  text: string;
  value: string;
}

const CARD_TYPE: ICardType[] = [
  {
    id: 1,
    text: '개인카드',
    value: 'PERSONAL',
  },
  {
    id: 2,
    text: '법인카드',
    value: 'CORPORATION',
  },
];

const CardRegisterPage = () => {
  const [selectedCardType, setSelectedCardType] = useState(1);
  const [card, setCard] = useState<Obj>({
    number1: '',
    number2: '',
    number3: '',
    number4: '',
  });
  const [password, setPassword] = useState<string>('');
  const [isTermCheck, setIsTermCheck] = useState(false);
  const [isMainCard, setIsMainCard] = useState(false);

  const firstNumberRef = useRef<HTMLInputElement>(null);
  const secondNumberRef = useRef<HTMLInputElement>(null);
  const thirdNumberRef = useRef<HTMLInputElement>(null);
  const fourthNumberRef = useRef<HTMLInputElement>(null);
  const expireRef = useRef<HTMLInputElement>(null);
  const corportaionRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const selectCardTypeHandler = (id: number) => {
    setSelectedCardType(id);
  };

  const cardNumberHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { name, value, maxLength } = e.target as HTMLInputElement;

    if (value.length > maxLength - 1) {
      focusNextInputHandler(name);
    }

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    setCard({
      ...card,
      [name]: value,
    });
  };

  const changePasswordHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let { value } = e.target as HTMLInputElement;

    if (value.length > 2) {
      value = value.slice(0, 2);
    }

    setPassword(value);
  };

  const focusNextInputHandler = (name: string) => {
    switch (name) {
      case 'number1': {
        return secondNumberRef && secondNumberRef.current?.focus();
      }
      case 'number2': {
        return thirdNumberRef && thirdNumberRef.current?.focus();
      }
      case 'number3': {
        return fourthNumberRef && fourthNumberRef.current?.focus();
      }
      default:
        return;
    }
  };

  const selectMainCardHandler = () => {
    dispatch(
      setAlert({
        alertMessage: '첫번째 카드 등록 시 대표 카드 설정은 필수입니다. ',
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
    setIsMainCard(!isMainCard);
  };

  const selectTermHandler = () => {
    setIsTermCheck(!isTermCheck);
  };

  const goToCardRegisterTerm = () => {
    router.push('/mypage/card/register/term');
  };

  const registerCardHandler = async () => {
    if (expireRef.current && nicknameRef.current) {
      const { number1, number2, number3, number4 } = card;
      const type = CARD_TYPE.find(
        (item: ICardType) => item.id === selectedCardType
      )?.value;

      const corporationNo =
        corportaionRef.current && corportaionRef.current.value;

      const name = nicknameRef.current.value;
      const expireMMYY = expireRef.current?.value;

      const expiredMM = expireMMYY.slice(0, 2);
      const expiredYY = expireMMYY.slice(
        expireMMYY.length - 2,
        expireMMYY.length
      );

      const disabledMsg =
        '사용할 수 없는 카드입니다.입력 내용을 다시 확인해주세요';

      const successMsg = '카드를 등록했습니다.';

      const cardData = {
        birthDate: '1992-05-22',
        corporationNo: corporationNo ? corporationNo : null,
        expiredMM,
        expiredYY,
        main: isMainCard,
        name,
        number: number1 + number2 + number3 + number4,
        password,
        type,
      };

      try {
        const { data } = await registerCard(cardData);

        if (data.code === 200) {
          dispatch(
            setAlert({
              alertMessage: successMsg,
              submitBtnText: '확인',
              onSubmit: () => router.push('/mypage/card'),
            })
          );
        }
      } catch (error) {
        console.error(error);
        dispatch(
          setAlert({
            alertMessage: disabledMsg,
            submitBtnText: '확인',
          })
        );
      }
    }
  };

  return (
    <Container>
      <FlexCenter padding="32px 0 0 0">
        <SVGIcon name="cardRegister" />
      </FlexCenter>
      <BorderLine height={1} margin="32px 0" />
      <SelectCardTypeWrapper>
        {CARD_TYPE.map((type: ICardType, index: number) => {
          const isSelected = type.id === selectedCardType;
          return (
            <FlexStart key={index}>
              <RadioButton
                isSelected={isSelected}
                onChange={() => selectCardTypeHandler(type.id)}
              />
              {isSelected ? (
                <TextH5B padding="0 0 0 8px">{type.text}</TextH5B>
              ) : (
                <TextB2R padding="0 0 0 8px">{type.text}</TextB2R>
              )}
            </FlexStart>
          );
        })}
      </SelectCardTypeWrapper>
      <CardNumberWrapper>
        <TextH5B padding="0 0 9px 0">카드번호</TextH5B>
        <CardInputWrapper>
          <CardInputGroup>
            <input
              type="number"
              placeholder="0000"
              id="number1"
              name="number1"
              onChange={cardNumberHandler}
              ref={firstNumberRef}
              maxLength={4}
              value={card['number1']}
            />
            <div className="firstDash" />
            <input
              type="number"
              placeholder="0000"
              id="number2"
              name="number2"
              onChange={cardNumberHandler}
              ref={secondNumberRef}
              maxLength={4}
              value={card['number2']}
            />
            <div className="secondDash" />
            <input
              type="password"
              placeholder="0000"
              id="number3"
              name="number3"
              onChange={cardNumberHandler}
              ref={thirdNumberRef}
              maxLength={4}
              value={card['number3']}
            />
            <div className="thirdDash" />
            <input
              type="password"
              placeholder="0000"
              id="number4"
              name="number4"
              onChange={cardNumberHandler}
              ref={fourthNumberRef}
              maxLength={4}
              value={card['number4']}
            />
          </CardInputGroup>
        </CardInputWrapper>
      </CardNumberWrapper>
      <ExpirationAndPasswordWrapper>
        <Expiration>
          <TextH5B padding="0 0 9px 0">유효기간</TextH5B>
          <TextInput ref={expireRef} placeholder="MMYY" />
        </Expiration>
        <Password>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>카드 비밀번호</TextH5B>
            <TextH5B color={theme.greyScale45} padding="0 0 0 4px">
              (선택)
            </TextH5B>
          </FlexRow>
          <CustomInputWrapper>
            <input
              type="number"
              name="passwordInput"
              placeholder="비밀번호 앞 두 자리"
              onChange={changePasswordHandler}
              value={password}
            />
          </CustomInputWrapper>
        </Password>
      </ExpirationAndPasswordWrapper>
      <CompanyRegistrationNumberWrapper>
        <TextH5B padding="0 0 9px 0">사업자 등록번호</TextH5B>
        <TextInput ref={corportaionRef} placeholder="0000" />
      </CompanyRegistrationNumberWrapper>
      <OtherNameOfCardWrapper>
        <TextH5B padding="0 0 9px 0">카드별명</TextH5B>
        <TextInput ref={nicknameRef} placeholder="카드별명" />
      </OtherNameOfCardWrapper>
      <FlexRow>
        <Checkbox isSelected={isMainCard} onChange={selectMainCardHandler} />
        <TextB2R padding="4px 0 0 8px">대표카드로 설정합니다.</TextB2R>
      </FlexRow>
      <BorderLine height={1} margin="24px 0" />
      <FlexRow>
        <Checkbox isSelected={isTermCheck} onChange={selectTermHandler} />
        <FlexRow padding="4px 4px 0 8px">
          <TextB2R>이용 약관에 동의합니다.</TextB2R>
          <TextH6B
            color={theme.greyScale65}
            textDecoration="underline"
            padding="0 0 0 4px"
            onClick={goToCardRegisterTerm}
          >
            자세히
          </TextH6B>
        </FlexRow>
      </FlexRow>
      <RegisterBtn onClick={registerCardHandler}>
        <Button height="100%">등록하기</Button>
      </RegisterBtn>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
  margin-bottom: 104px;
`;

const SelectCardTypeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CardNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
`;

const CardInputWrapper = styled.div`
  position: relative;
  border: 1px solid ${theme.greyScale15};
  width: 100%;
  height: 48px;
  border-radius: 8px;
`;

const CardInputGroup = styled.div`
  display: flex;
  align-self: center;
  height: 100%;
  width: 100%;
  > input {
    width: calc(100% / 4);
    ${customInput}
    ::placeholder {
      ${textBody2}
      position: absolute;
      color: ${({ theme }) => theme.greyScale45};
    }
  }
  > div {
    position: absolute;
    width: 4px;
    height: 1px;
    background-color: ${theme.greyScale45};
    bottom: 50%;
  }
  .firstDash {
    left: 23%;
  }
  .secondDash {
    left: 48%;
  }
  .thirdDash {
    left: 72%;
  }
`;

const CustomInputWrapper = styled.div`
  border: 1px solid ${theme.greyScale15};
  width: 100%;
  height: 48px;
  border-radius: 8px;

  > input {
    ${customInput}
    ::placeholder {
      ${textBody2}
      position: absolute;
      color: ${({ theme }) => theme.greyScale45};
    }
  }
`;

const ExpirationAndPasswordWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 24px;
`;
const Expiration = styled.div`
  padding-right: 16px;
  width: 100%;
`;

const Password = styled.div`
  width: 100%;
`;

const CompanyRegistrationNumberWrapper = styled.div`
  margin-bottom: 24px;
`;

const OtherNameOfCardWrapper = styled.div`
  margin-bottom: 24px;
`;

const RegisterBtn = styled.div`
  ${fixedBottom};
`;

export default CardRegisterPage;
