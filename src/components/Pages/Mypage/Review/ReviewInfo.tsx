import React from 'react';
import { FlexBetween, FlexRow, theme, FlexCol, LiCircle3 } from '@styles/theme';
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
          <TextH6B color={theme.greyScale65}>[일반 후기]</TextH6B>
          <ul>
            <LiCircle3 top={7} left={8} color={'#717171'}>
              <TextB3R color={theme.greyScale65}>텍스트 후기: 100P</TextB3R>
            </LiCircle3>
            <LiCircle3 top={7} left={8} color={'#717171'}>
              <TextB3R color={theme.greyScale65}>사진후기: 300P</TextB3R>
            </LiCircle3>
          </ul>
          <TextH6B padding="20px 0 0" color={theme.greyScale65}>
            [구독 후기]
          </TextH6B>
          <ul>
            <LiCircle3 top={7} left={8} color={'#717171'}>
              <TextB3R color={theme.greyScale65}>매 회차 배송완료 후 작성 가능해요. (최대 3,000P 적립)</TextB3R>
            </LiCircle3>
            <LiCircle3 top={7} left={8} color={'#717171'}>
              <TextB3R color={theme.greyScale65}>텍스트 후기: 한 회차 배송에 포함된 상품의 갯수 x 100P</TextB3R>
            </LiCircle3>
            <LiCircle3 top={7} left={8} color={'#717171'}>
              <TextB3R color={theme.greyScale65}>사진 후기: 한 회차 배송에 포함된 상품의 갯수 x 300P</TextB3R>
            </LiCircle3>
          </ul>
        </>
      )}
    </ReviewInfoWrapper>
  );
};

const ReviewInfoWrapper = styled.div`
  cursor: pointer;
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
`;

export default ReviewInfo;
