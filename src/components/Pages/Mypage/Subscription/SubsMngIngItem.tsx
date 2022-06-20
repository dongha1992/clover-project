import { SubsLabel } from '@components/Pages/Subscription';
import { TextB2R, TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { SUBS_STATUS } from '@constants/subscription';
import useSubsNowDeliveryInfo from '@hooks/subscription/useSubsNowDeliveryInfo';
import useSubsSetProgress from '@hooks/subscription/useSubsSetProgress';
import { IGetOrders } from '@model/index';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import Image from 'next/image';
import router from 'next/router';
import styled from 'styled-components';
import SubsProgressBar from './ProgressBar';
interface IProps {
  item: IGetOrders;
}

const SubsMngIngItem = ({ item }: IProps) => {
  const cards = useSubsNowDeliveryInfo(item);
  const round = useSubsSetProgress(item);

  const goToSubsDetail = () => {
    router.push(`/subscription/${item.id}`);
  };
  return (
    <Container>
      <FlexBetween>
        <FlexRowStart>
          <TextH5B margin="0 8px 0 0">{SUBS_STATUS[item?.status]}</TextH5B>
          <SubsLabel
            subsPeriod={item?.subscriptionPeriod!}
            delivery={item?.delivery}
            deliveryDetail={item?.deliveryDetail!}
          />
        </FlexRowStart>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToSubsDetail}>
          구독상세 보기
        </TextH6B>
      </FlexBetween>
      <FlexRow padding="9px 0">
        <SVGIcon name="subscription" />{' '}
        <TextH5B padding="0 0 0 4px">
          배송 {`${cards[0]?.deliveryRound}`}회차{cards.length > 1 && ` 외 ${cards.length - 1}건`} -{' '}
          {getFormatDate(cards[0]?.deliveryDate)} 도착예정
        </TextH5B>
      </FlexRow>
      <FlexRowStart>
        <ImgBox>
          <Image
            src={IMAGE_S3_URL + item?.image.url}
            alt="상품이미지"
            width={'100%'}
            height={'100%'}
            layout="responsive"
          />
        </ImgBox>
        <InfoBox>
          <TextB2R padding="0 0 4px">간편하게 비건식단</TextB2R>
          <TextB3R className="date" color="#717171">
            <b>구독 {item?.subscriptionRound}회차</b> - {getFormatDate(item?.firstDeliveryDate)} ~{' '}
            {getFormatDate(item?.lastDeliveryDate)}
          </TextB3R>
        </InfoBox>
      </FlexRowStart>
      <ProgressBox>
        <SubsProgressBar length={item?.orderDeliveries.length} round={round} />
        {/* <FlexRow padding="8px 0 0">
            <SVGIcon name="exclamationMark" />
            <TextB3R color={theme.brandColor}>
              <b></b> 구독 식단이 종료되어 N월 N일 (목) 자동으로 구독 해지될 예정이에요.
            </TextB3R>
          </FlexRow> */}
      </ProgressBox>
    </Container>
  );
};
const Container = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #f2f2f2;
  padding-top: 24px;
  &:first-of-type {
    padding-top: 0;
  }
  &:last-of-type {
    border-bottom: none;
  }
`;
const ImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #dedede;
  overflow: hidden;
`;
const InfoBox = styled.div`
  .date {
    b {
      font-weight: bold;
    }
  }
`;
const ProgressBox = styled.div`
  padding-top: 16px;
  svg {
    margin-bottom: 3px;
  }
  b {
    font-weight: bold;
  }
`;
export default SubsMngIngItem;
