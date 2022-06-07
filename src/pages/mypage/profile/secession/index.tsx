import { userSecessionApi } from '@api/user';
import Alert from '@components/Shared/Alert';
import BorderLine from '@components/Shared/BorderLine';
import { Button, RadioButton } from '@components/Shared/Button';
import Checkbox from '@components/Shared/Checkbox';
import { ModalFullScreen, ModalLayout } from '@components/Shared/Modal';
import { TextB2R, TextB3R, TextH2B, TextH5B, TextH6B } from '@components/Shared/Text';
import TextArea from '@components/Shared/TextArea';
import { SECESSION_EXPLAIN, SECESSION_REASON } from '@constants/mypage';
import { ISecessionRequest } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { fixedBottom, FlexRow } from '@styles/theme';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const SecessionPage = () => {
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isTextArea, setIsTextArea] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [answerDetail, setAnswerDetail] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // TODO : 회원 탈퇴가 api가 제대로 작동안함, 스웨거는 통과되는데 로컬에서 안되는 이슈있는 request body에 담아 보내는데 에러남
  const { mutate: mutateUserSecession } = useMutation((data: ISecessionRequest) => userSecessionApi(data), {
    onSuccess: (data) => {
      // TODO : Alet 메세지 padding 시안과 다름
      dispatch(
        SET_ALERT({
          alertMessage: '탈퇴가 정상적으로 처리되었습니다.',
          submitBtnText: '확인',
        })
      );
    },
    onError: () => {},
  });

  useEffect(() => {
    isSelected === '기타' ? setIsTextArea(true) : setIsTextArea(false);
    isSelected && isChecked ? setDisabled(false) : setDisabled(true);
  }, [isSelected, isChecked]);

  const eventHandler = (e: any) => {
    setAnswerDetail(e.target.value);
  };

  const onSecession = () => {
    if (!disabled) {
      const data = {
        answer: isSelected,
        answerDetail,
        question: '탈퇴 이유',
      };
      mutateUserSecession(data);
    }
  };

  return (
    <Container>
      <Section className="section1">
        <TextH2B padding="24px 0 32px">
          탈퇴하신다니 <br />
          너무 아쉬워요
        </TextH2B>
        <TextH5B padding="0 0 32px">
          프레시코드를 탈퇴하는 이유를 선택해주시면 <br />
          더욱 건강한 서비스를 위해 노력하겠습니다.
        </TextH5B>
        <ReasonBox>
          {SECESSION_REASON.map((item, index) => (
            <ReasonItem key={`reason-${index}`}>
              <RadioButton
                onChange={() => {
                  setIsSelected(item.text);
                }}
                isSelected={isSelected === item.text}
              />
              <TextB2R>{item.text}</TextB2R>
            </ReasonItem>
          ))}
        </ReasonBox>
        {isTextArea && (
          <TextArea
            height="76px"
            margin="16px 0 0"
            name="etc"
            placeholder="기타 다른 이유를 알려주세요ㅠㅠ"
            minLength={0}
            maxLength={100}
            rows={1}
            ref={textAreaRef}
            eventHandler={eventHandler}
          />
        )}
      </Section>
      <BorderLine height={8} />
      <Section>
        <TextH5B padding="24px 0 16px">탈퇴 시 유의사항을 확인해주세요.</TextH5B>
        <ExplainContainer>
          <ExplainBox>
            {SECESSION_EXPLAIN.map((text, index) => (
              <ExplainItem key={`explain-${index}`}>
                <TextB3R color="#717171">{text}</TextB3R>
              </ExplainItem>
            ))}
          </ExplainBox>
          <InfoBox>
            <InfoItem>
              <TextH6B color="#717171">보유 쿠폰</TextH6B>
              <TextH6B color="#35AD73">4개</TextH6B>
            </InfoItem>
            <InfoItem>
              <TextH6B color="#717171">보유 포인트</TextH6B>
              <TextH6B color="#35AD73">3,000P</TextH6B>
            </InfoItem>
          </InfoBox>
        </ExplainContainer>
        <FlexRow padding="16px 0 48px">
          <Checkbox
            isSelected={isChecked}
            onChange={() => {
              setIsChecked((prev) => !prev);
            }}
          />
          <TextB2R margin="3px 0 0 8px" color="#242424">
            회원탈퇴 안내를 모두 확인하였음에 동의합니다.
          </TextB2R>
        </FlexRow>
      </Section>
      <BtnWrapper>
        <Button
          height="100%"
          borderRadius="0"
          width="100%"
          className={disabled ? 'disabled' : ''}
          onClick={onSecession}
        >
          탈퇴하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div``;

const Section = styled.section`
  padding: 0 24px;
  &.section1 {
    padding-bottom: 16px;
  }
`;

const ReasonBox = styled.ul``;

const ReasonItem = styled.li`
  display: flex;
  align-items: center;
  height: 22px;
  margin-bottom: 16px;
  label {
    margin-right: 8px;
  }
  div {
    line-height: 1;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;
const ExplainContainer = styled.article`
  padding: 17px 0;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
`;

const ExplainBox = styled.ul`
  padding-bottom: 16px;
`;

const ExplainItem = styled.li`
  padding-left: 19px;
  position: relative;
  margin-bottom: 4px;
  &::after {
    content: '';
    position: absolute;
    background-color: #717171;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    top: 7px;
    left: 8px;
  }
  &:last-child {
    margin-bottom: 0;
  }
  > div {
    word-break: keep-all;
  }
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoItem = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  width: 48%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}

  .disabled {
    background-color: #f2f2f2;
    color: #c8c8c8;
  }
`;
export default SecessionPage;
