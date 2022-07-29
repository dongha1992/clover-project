import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { TextH6B, TextH3B } from '@components/Shared/Text';
import { theme, homePadding } from '@styles/theme';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';

const CONTENTS = [
  {
    id: 1, 
    title: '메인 콘텐츠 일반기획전!!', 
    img: '/banner/img_home_contents_event.png', 
    subs: false,
    edit: true,
  },
  {
    id: 2, 
    title: '메인 콘텐트 구독기획전!!', 
    img: '/banner/img_home_contents_event_2.png', 
    subs: true,
    edit: false,
  },
];

// 기획전
const PromotionPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(INIT_EVENT_TITLE());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToDetail = (title: string, subs: boolean, id: number, edit: boolean) => {
    dispatch(SET_EVENT_TITLE(title));
    router.push({
      pathname : '/promotion/detail',
      query: {
        id: id,
        subs: subs,
        edit_feed: edit,
      },
    });  
  };

  return (
    <Container>
      {
        CONTENTS.map((item, idx) => {
          return (
            <PromotionWrapper key={idx}>
              <FlexSpace>
                <TextH3B padding='24px 0'>{item.title}</TextH3B>
                <TextH6B 
                  onClick={() => goToDetail(item.title, item.subs, item.id, item.edit)}
                  color={theme.greyScale65} 
                  textDecoration='underline' 
                  pointer
                >더보기</TextH6B>
              </FlexSpace>
              <Image
                src={`${process.env.IMAGE_S3_URL}${item.img}`}
                height="300px"
                width="512px"
                layout="responsive"
                alt="기획전"
              />
            </PromotionWrapper>
          )
        })
      }
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const PromotionWrapper = styled.div`
  width: 100%;
  padding-bottom: 9px;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  ${homePadding}
  align-items: center;
`;


export default PromotionPage;