import { TextH3B, TextH6B } from '@components/Shared/Text';
import { ScrollHorizonList, theme } from '@styles/theme';
import styled from 'styled-components';
import { SubsCardItem } from '@components/Pages/Subscription';
import { IGetOrders } from '@model/index';
import router from 'next/router';
interface IProps {
  subsList: IGetOrders[];
}

const MySubsList = ({ subsList }: IProps) => {
  const goToSubsMng = () => {
    router.push('/mypage/subscription');
  };

  return (
    <MySubsBox>
      <Head>
        <TextH3B>내 구독 ({subsList.length})</TextH3B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToSubsMng}>
          구독 관리
        </TextH6B>
      </Head>
      <ScrollHorizonList style={{ backgroundColor: theme.greyScale3 }}>
        <ListContainer>
          {subsList.map((item: IGetOrders, index: number) => (
            <SubsCardItem key={index} item={item} />
          ))}
        </ListContainer>
      </ScrollHorizonList>
    </MySubsBox>
  );
};
const MySubsBox = styled.div`
  padding-bottom: 56px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 16px;
`;

const ListContainer = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${theme.greyScale3};
`;

export default MySubsList;
