import React from 'react';
import { FlexBetween, FlexRow, theme, FlexCol } from '@styles/theme';
import { TextH6B, TextB3R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import BorderLine from '@components/Shared/BorderLine';
import styled from 'styled-components';

const ReviewInfo = ({ isShow, setIsShow }: any) => {
  return (
    <ReviewInfoWrapper onClick={() => setIsShow(!isShow)}>
      <FlexBetween>
        <FlexRow>
          <TextH6B color={theme.greyScale65}>후기 작성하고</TextH6B>
          <TextH6B padding="0 4px" color={theme.brandColor}>
            최대 3,000P
          </TextH6B>
          <TextH6B color={theme.greyScale65}>혜택받으세요!</TextH6B>
        </FlexRow>
        <div>
          <SVGIcon name={isShow ? 'triangleUp' : 'triangleDown'} />
        </div>
      </FlexBetween>
      {isShow && (
        <>
          <BorderLine height={1} margin="16px 0" />
          <FlexCol>
            <TextH6B color={theme.greyScale65}>[일반상품]</TextH6B>
            <TextB3R color={theme.greyScale65}>텍스트 후기: 100 포인트 / 사진후기: 300 포인트</TextB3R>
          </FlexCol>
          <FlexCol>
            <TextH6B color={theme.greyScale65}>[정기배송]</TextH6B>
            <TextB3R color={theme.greyScale65}>텍스트 후기: 1,000 포인트 / 사진 후기: 3,000 포인트</TextB3R>
          </FlexCol>
        </>
      )}
    </ReviewInfoWrapper>
  );
};

const ReviewInfoWrapper = styled.div`
  cursor: pointer;
  background-color: ${theme.greyScale3};
  padding: 16px;
  margin: 24px 0;
  border-radius: 8px;
`;

export default ReviewInfo;
