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
} from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { Obj } from '@model/index';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';

const CARD_TYPE = [
  {
    id: 1,
    text: '개인카드',
    value: 'personal',
  },
  {
    id: 2,
    text: '법인카드',
    value: 'company',
  },
];

/*TODO: 카드 번호 ref로 관리해도 되낭 */

const CardRegisterPage = () => {
  const [selectedCardType, setSelectedCardType] = useState(1);
  const [card, setCard] = useState<Obj>({
    number1: '',
    number2: '',
    number3: '',
    number4: '',
  });

  const firstNumberRef = useRef<HTMLInputElement>(null);
  const secondNumberRef = useRef<HTMLInputElement>(null);
  const thirdNumberRef = useRef<HTMLInputElement>(null);
  const fourthNumberRef = useRef<HTMLInputElement>(null);

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

  const selectCheckboxHandler = () => {};

  const goToCardRegisterTerm = () => {
    router.push('/mypage/card/register/term');
  };

  const registerCardHandler = () => {
    const disabledMsg =
      '사용할 수 없는 카드입니다.입력 내용을 다시 확인해주세요';

    const successMsg = '카드를 등록했습니다.';
    dispatch(
      setAlert({
        alertMessage: disabledMsg,
        onSubmit: () => {},
        submitBtnText: '확인',
      })
    );
  };

  return (
    <Container>
      <FlexCenter padding="32px 0 0 0">
        <SVGIcon name="cardRegister" />
      </FlexCenter>
      <BorderLine height={1} margin="32px 0" />
      <SelectCardTypeWrapper>
        {CARD_TYPE.map((type, index) => {
          const isSelected = type.id === selectedCardType;
          return (
            <FlexStart key={index}>
              <RadioButton
                isSelected
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
              type="number"
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
              type="number"
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
          <TextInput />
        </Expiration>
        <Password>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>카드 비밀번호</TextH5B>
            <TextH5B color={theme.greyScale45} padding="0 0 0 4px">
              (선택)
            </TextH5B>
          </FlexRow>
          <TextInput />
        </Password>
      </ExpirationAndPasswordWrapper>
      <CompanyRegistrationNumberWrapper>
        <TextH5B padding="0 0 9px 0">사업자 등록번호</TextH5B>
        <TextInput />
      </CompanyRegistrationNumberWrapper>
      <OtherNameOfCardWrapper>
        <TextH5B padding="0 0 9px 0">카드별명</TextH5B>
        <TextInput />
      </OtherNameOfCardWrapper>
      <FlexRow>
        <Checkbox isSelected onChange={selectCheckboxHandler} />
        <TextB2R padding="0 0 0 8px">대표카드로 설정합니다.</TextB2R>
      </FlexRow>
      <BorderLine height={1} margin="24px 0" />
      <FlexRow>
        <Checkbox isSelected onChange={selectCheckboxHandler} />
        <FlexRow padding="0 4px 0 8px">
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
        <Button>등록하기</Button>
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
    border: none;
    padding: 12px 20px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border-radius: 8px;
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
