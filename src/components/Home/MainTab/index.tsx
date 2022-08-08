import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import Image from '@components/Shared/Image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';

const TABS = [
  { title: '카테고리', link: '/category/all' },
  { title: 'HOT썸머 할인', link: '/promotion/detail', id: 1 },
  { title: '기획전', link: '/promotion' },
  { title: '이벤트·소식', link: '/event' },
];

const MainTab = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const goToPromotion = (path: string, id?: number) => {
    
    if(path === '/promotion/detail') {
      dispatch(SET_EVENT_TITLE('HOT썸머 할인!')); // 고정 기획전 타이틀
      router.push(`/promotion/detail/${id}`);
    } else {
      router.push(path);
    };
  };

  return (
    <Container>
      {TABS.map((item, index) => {
        return (
          <TabWrapper key={index} onClick={() => goToPromotion(item.link, item.id)}>
            <Image
              src="/menu/img_thumbnail_empty.jpg"
              height="80px"
              width="80px"
              className="rounded"
              alt='홈탭'
            />
            <TextB2R padding="12px 0" pointer>
              {item.title}
            </TextB2R>
          </TabWrapper>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 19px;
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  .rounded {
    border-radius: 50%;
  }
`;

export default MainTab;
