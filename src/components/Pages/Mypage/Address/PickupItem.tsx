import React, { useCallback } from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexRow, homePadding } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { IDestinationsResponse } from '@model/index';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import 'dayjs/locale/ko';
dayjs.locale('ko');

interface IProps {
  item: IDestinationsResponse;
  goToCart: (item: IDestinationsResponse) => void;
  goToEdit: ({ id, spotPickupId }: { id: number; spotPickupId: number }) => void;
}

const now = dayjs();

const PickupItem = ({ item, goToCart, goToEdit }: IProps) => {
  const { spotPickup, main, location, name, receiverName, receiverTel } = item;
  const { me } = useSelector(userForm);
  const mapper: Obj = {
    PRIVATE: {
      name: '프라이빗',
      backgroundColor: theme.brandColor5P,
      color: theme.brandColor,
    },
    // PUBLIC: { name: '퍼블릭', backgroundColor: theme.greyScale6, color: theme.greyScale45 },
    TRIAL: { name: '트라이얼', backgroundColor: theme.greyScale6, color: theme.greyScale45 },
    CAFE: { name: '카페', backgroundColor: theme.greyScale6, color: theme.greyScale45 },
  };

  // 운영 종료 예정 혹은 종료 구하기
  const closedDate = item?.spotPickup?.spot.closedDate;
  const dDay = now.diff(dayjs(item?.spotPickup?.spot.closedDate), 'day');
  const closedOperation = dDay > 0 || item?.spotPickup?.spot.isClosed;
  const closedSoonOperation = dDay >= -14;

  const renderSpotMsg = useCallback(() => {
    switch (true) {
      case closedOperation: {
        return (
          <FlexRow margin="0 0 16px 0">
            <SVGIcon name="exclamationMark" />
            <TextB3R margin="0 0 0 4px" padding="2px 0 0 0" color={theme.brandColor}>
              운영 종료된 프코스팟이에요
            </TextB3R>
          </FlexRow>
        );
      }
      case closedSoonOperation: {
        if (closedDate) {
          return (
            <FlexRow margin="0 0 16px 0">
              <SVGIcon name="exclamationMark" />
              <TextB3R margin="0 0 0 4px" padding="1px 0 0 0" color={theme.brandColor}>
                운영 종료 예정인 프코스팟이에요
              </TextB3R>
            </FlexRow>
          );
        }
      }
      default: {
        return (
          <FlexRow padding="4px 0 0 0">
            <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
              픽업
            </TextH6B>
            <TextB3R
              color={theme.greyScale65}
            >{`${spotPickup?.spot.pickupStartTime}-${spotPickup?.spot.pickupEndTime}`}</TextB3R>
          </FlexRow>
        );
      }
    }
  }, []);

  return (
    <Container>
      <FlexCol>
        <FlexBetween>
          <FlexRow>
            <TextH5B padding="0 8px 0 0">{name}</TextH5B>
            {spotPickup?.spot.isTrial ? (
              <Tag margin="0 4px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale65}>
                트라이얼
              </Tag>
            ) : spotPickup?.spot.type === 'PRIVATE' ? (
              <Tag margin="0 4px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
                프라이빗
              </Tag>
            ) : null}
            {main && (
              <Tag backgroundColor={theme.greyScale6} color={theme.greyScale65}>
                기본 프코스팟
              </Tag>
            )}
          </FlexRow>
          <TextH6B
            pointer
            color={theme.greyScale65}
            textDecoration="underline"
            onClick={() => goToEdit({ id: item?.id!, spotPickupId: item?.spotPickup?.id! })}
          >
            편집
          </TextH6B>
        </FlexBetween>
        <TextB3R padding="4px 0 4px 0">{location?.address}</TextB3R>
        {receiverName && receiverTel && (
          <FlexRow padding="0 0 0 0">
            <TextB3R color={theme.greyScale65} padding="">
              {receiverName}
            </TextB3R>
            <Col />
            <TextB3R color={theme.greyScale65}>{receiverTel}</TextB3R>
          </FlexRow>
        )}
      </FlexCol>
      {renderSpotMsg()}
      <Button
        onClick={() => {
          if (closedOperation) return;
          goToCart(item);
        }}
        backgroundColor={theme.white}
        border
        color={theme.black}
        margin="16px 0 24px 0"
        disabled={closedOperation}
      >
        주문하기
      </Button>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const Col = styled.div`
  width: 1px;
  height: 16px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: ${({ theme }) => theme.greyScale6};
`;

export default React.memo(PickupItem);
