import React, { useEffect } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B, TextH5B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';

interface IProps {
  title?: string;
};

const SpotRegisterHeader = ({ title }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();


  const goBack = (): void => {
    router.back();
  };

  const clickTemporarySave = (): void => {
    const TitleMsg = `필수 정보를 모두 입력해야\n신청이 완료됩니다.`;
    const SubMsg = `[마이페이지>스팟 관리]에서\n업데이트할 수 있어요.`;
    dispatch(
      setAlert({
        alertMessage: TitleMsg,
        alertSubMessage: SubMsg,
        onSubmit: () => {},
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <TextH5B onClick={clickTemporarySave} pointer>임시저장</TextH5B>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: auto;
  left: calc(50%);
  background-color: white;
  z-index: 100000;
  height: 56px;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;


export default React.memo(SpotRegisterHeader);
