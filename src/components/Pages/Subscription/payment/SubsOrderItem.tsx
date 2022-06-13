import { TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { FlexRow, FlexRowStart } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import Image from 'next/image';
import styled from 'styled-components';
import SubsLabel from '../SubsLabel';

interface IProps {
  deliveryType: string; // 새벽, 택배, 스팟
  deliveryDetail?: string; // 점심, 저녁
  subscriptionPeriod: string; // 구독 기간
  name: string;
  menuImage: string;
  price?: number;
}

const SubsOrderItem = ({ deliveryType, deliveryDetail, subscriptionPeriod, name, menuImage, price }: IProps) => {
  return (
    <SubsOrderContainer>
      <FlexRowStart>
        <ImgBox>
          <Image src={IMAGE_S3_URL + menuImage} alt="상품이미지" width={'100%'} height={'100%'} layout="responsive" />
        </ImgBox>
        <InfoBox>
          <div className="labelBox">
            <FlexRow padding="0 0 4px 0">
              <SubsLabel subsPeriod={subscriptionPeriod} delivery={deliveryType} deliveryDetail={deliveryDetail!} />
            </FlexRow>
          </div>
          <TextB3R>{name}</TextB3R>
          {price && <TextH5B padding="2px 0 0 0">{getFormatPrice(String(price))}원</TextH5B>}
        </InfoBox>
      </FlexRowStart>
    </SubsOrderContainer>
  );
};
const SubsOrderContainer = styled.div``;
const ImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #dedede;
  overflow: hidden;
`;
const InfoBox = styled.div`
  .labelBox {
  }
`;

export default SubsOrderItem;
