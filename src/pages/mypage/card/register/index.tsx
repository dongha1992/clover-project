import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { textBody2, theme, homePadding, FlexCenter, FlexStart, FlexRow, fixedBottom, customInput } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import { TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { IRegisterCard } from '@model/index';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { registerCard, getMainCardLists } from '@api/card';
import dynamic from 'next/dynamic';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import BirthDate from '@components/BirthDate';
import { IBirthdayObj } from '@pages/signup/optional';
import { getFormatTime } from '@utils/destination';

const Checkbox = dynamic(() => import('@components/Shared/Checkbox'), {
  ssr: false,
});

interface ICardNumber {
  number1: string;
  number2: string;
  number3: string;
  number4: string;
}
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
  const [card, setCard] = useState<ICardNumber>({
    number1: '',
    number2: '',
    number3: '',
    number4: '',
  });
  const [password, setPassword] = useState<string>('');
  const [expireDate, setExpireDate] = useState<string>('');
  const [birthDayObj, setBirthdayObj] = useState<IBirthdayObj>({
    year: 0,
    month: 0,
    day: 0,
  });
  const [isTermCheck, setIsTermCheck] = useState(false);
  const [isMainCard, setIsMainCard] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const firstNumberRef = useRef<HTMLInputElement>(null);
  const secondNumberRef = useRef<HTMLInputElement>(null);
  const thirdNumberRef = useRef<HTMLInputElement>(null);
  const fourthNumberRef = useRef<HTMLInputElement>(null);
  const corportaionRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const { isOrder, orderId, isSubscription } = router.query;
  const isFromOrder = isOrder === 'true';

  const isCorporationCard = selectedCardType === 2;

  const queryClient = useQueryClient();

  const disabledMsg = '사용할 수 없는 카드입니다.입력 내용을 다시 확인해주세요';
  const successMsg = '카드를 등록했습니다.';

  const { data: hasMainCard } = useQuery(
    'getMainCard',
    async () => {
      const { data } = await getMainCardLists();
      if (!data.data) {
        setIsMainCard(true);
        return false;
      } else {
        return true;
      }
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: mutateAddCard } = useMutation(
    async (reqBody: IRegisterCard) => {
      return registerCard(reqBody);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCardList');
      },
    }
  );

  const selectCardTypeHandler = useCallback(
    (id: number) => {
      setSelectedCardType(id);
    },
    [selectedCardType]
  );

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

  const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { value } = e.target as HTMLInputElement;

    if (value.length > 2) {
      value = value.slice(0, 2);
    }

    setPassword(value);
  };

  const changeExpireDateHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { value } = e.target as HTMLInputElement;

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    setExpireDate(value);
  };

  const changeBirthdayHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { value, name } = e.target as HTMLInputElement;

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setBirthdayObj({ ...birthDayObj, [name]: Number(value) });
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
    if (!hasMainCard) {
      dispatch(
        SET_ALERT({
          alertMessage: '첫번째 카드 등록 시 대표 카드 설정은 필수입니다. ',
          submitBtnText: '확인',
          closeBtnText: '취소',
        })
      );
      setIsMainCard(true);
      return;
    }

    setIsMainCard(!isMainCard);
  };

  const selectTermHandler = () => {
    setIsTermCheck(!isTermCheck);
  };

  const goToCardRegisterTerm = () => {
    router.push('/mypage/card/register/term');
  };

  const registerCardHandler = async () => {
    if (nicknameRef.current) {
      const { number1, number2, number3, number4 } = card;
      const type = CARD_TYPE.find((item: ICardType) => item.id === selectedCardType)?.value || '';
      const corporationNo = corportaionRef?.current && corportaionRef?.current.value;
      const name = nicknameRef.current.value;

      // 필수조건 작성하기 전까지 버튼 비활성화
      if (!isDisabled) return;

      /* TODO: 에러 내용 추가 / 벨리데이트 다시  */
      if (isCorporationCard) {
        if (expireDate.length < 4) {
          return alert('유효기간을 입력해주세요.');
        }
        if (!corporationNo?.length) {
          return alert('사업등록 번호를 입력해주세요.');
        }

        if (!name.length) {
          return alert('카드별명을 설정해주세요.');
        }
      } else {
        if (expireDate.length < 4) {
          return alert('유효기간을 입력해주세요.');
        }

        if (password.length !== 2) {
          return alert('카드비밀번호를 입력해주세요.');
        }

        if (!birthDayObj.day || !birthDayObj.month || !birthDayObj.year) {
          return alert('생년월일을 다시 입력해주세요.');
        }

        if (!name.length) {
          return alert('카드별명을 설정해주세요.');
        }
        if (!isTermCheck) {
          return alert('이용약관에 동의해주세요.');
        }
      }

      const expiredMM = expireDate.slice(0, 2);
      const expiredYY = expireDate.slice(expireDate.length - 2, expireDate.length);
      const birthDate = `${birthDayObj.year}-${getFormatTime(birthDayObj.month)}-${getFormatTime(birthDayObj.day)}`;

      const cardData = {
        password,
        type,
        name,
        expiredMM,
        expiredYY,
        birthDate: birthDate ? birthDate : null,
        corporationNo: corporationNo ? corporationNo : null,
        main: isMainCard,
        number: number1 + number2 + number3 + number4,
      };

      try {
        const { data } = await mutateAddCard(cardData);
        if (data.code === 200) {
          dispatch(
            SET_ALERT({
              alertMessage: successMsg,
              submitBtnText: '확인',
              onSubmit: () => {
                if (isFromOrder && orderId && isSubscription) {
                  router.push({ pathname: `/subscription/${orderId}` });
                } else if (isFromOrder && isSubscription) {
                  router.push({ pathname: '/order', query: { isSubscription } });
                } else if (isFromOrder) {
                  router.push({ pathname: '/order' });
                } else {
                  router.push({ pathname: '/mypage/card', query: { isOrder: isFromOrder } });
                }
              },
            })
          );
        }
      } catch (error) {
        dispatch(
          SET_ALERT({
            alertMessage: disabledMsg,
            submitBtnText: '확인',
          })
        );
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const { number1, number2, number3, number4 } = card;
    if (isCorporationCard) {
      if (number1 && number2 && number3 && number4 && expireDate && isTermCheck) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      if (number1 && number2 && number3 && number4 && expireDate && password && birthDayObj && isTermCheck) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [card, expireDate, password, birthDayObj, isTermCheck]);

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
              <RadioButton isSelected={isSelected} onChange={() => selectCardTypeHandler(type.id)} />
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
          <CustomInputWrapper>
            <input
              type="number"
              name="expireDateInput"
              placeholder="MMYY"
              onChange={changeExpireDateHandler}
              value={expireDate}
            />
          </CustomInputWrapper>
        </Expiration>
        <Password>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>카드 비밀번호</TextH5B>
            {isCorporationCard && (
              <TextH5B color={theme.greyScale45} padding="0 0 0 4px">
                (선택)
              </TextH5B>
            )}
          </FlexRow>
          <CustomInputWrapper>
            <input
              type="password"
              name="passwordInput"
              placeholder="비밀번호 앞 두 자리"
              onChange={changePasswordHandler}
              value={password}
            />
          </CustomInputWrapper>
        </Password>
      </ExpirationAndPasswordWrapper>
      {isCorporationCard ? (
        <CompanyRegistrationNumberWrapper>
          <TextH5B padding="0 0 9px 0">사업자 등록번호</TextH5B>
          <TextInput ref={corportaionRef} placeholder="0000" />
        </CompanyRegistrationNumberWrapper>
      ) : (
        <BirthdayWrapper>
          <TextH5B padding="0 0 9px 0">생년월일</TextH5B>
          <BirthDate onChange={changeBirthdayHandler} selected={birthDayObj} />
        </BirthdayWrapper>
      )}
      <OtherNameOfCardWrapper>
        <TextH5B padding="0 0 9px 0">카드별명</TextH5B>
        <TextInput ref={nicknameRef} placeholder="카드별명" />
      </OtherNameOfCardWrapper>
      <FlexRow>
        <Checkbox isSelected={isMainCard} onChange={selectMainCardHandler} />
        <TextB2R padding="4px 0 0 8px" pointer onClick={selectMainCardHandler}>
          대표카드로 설정합니다.
        </TextB2R>
      </FlexRow>
      <BorderLine height={1} margin="24px 0" />
      <FlexRow>
        <Checkbox isSelected={isTermCheck} onChange={selectTermHandler} />
        <FlexRow padding="4px 4px 0 8px">
          <TextB2R onClick={selectTermHandler} pointer>
            이용 약관에 동의합니다.
          </TextB2R>
          <TextH6B
            pointer
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
        <Button height="100%" width="100%" borderRadius="0" disabled={!isDisabled}>
          등록하기
        </Button>
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
      padding-top: 3px;
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
      padding-top: 3px;
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

const BirthdayWrapper = styled.div`
  margin-bottom: 24px;
`;

const OtherNameOfCardWrapper = styled.div`
  margin-bottom: 24px;
`;

const RegisterBtn = styled.div`
  ${fixedBottom};
`;

export default CardRegisterPage;
