import { IMenus } from '@model/index';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { getMenuDetailApi, getMenuDetailReviewApi } from '@api/menu';
import { useInfinite } from '@queries/useInfinite';
interface IProps {
  previous: any;
  id: number;
  likeCount: number;
  liked: boolean;
}

export const useMenuDetail = (key: QueryKey, menuId: number, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await getMenuDetailApi(menuId);
      return data?.data;
    },
    options
  );

export const onMenuLikes = ({ previous, id, likeCount, liked }: IProps) => {
  return previous?.map((preItem: IMenus) => {
    let prevLiked, prevLikeCount;
    if (preItem.id === id) {
      if (liked) {
        prevLiked = false;
        if (likeCount > 0) {
          prevLikeCount = likeCount - 1;
        } else {
          prevLikeCount = 0;
        }
      } else {
        prevLiked = true;
        prevLikeCount = likeCount + 1;
      }
      return { ...preItem, liked: prevLiked, likeCount: prevLikeCount };
    } else {
      return preItem;
    }
  });
};

export const useInfiniteMenuReviews = ({ id, page, size }: { id: number; size: number; page: number }) => {
  const fetchDatas = async ({ pageParam = 1 }) => {
    const { data } = await getMenuDetailReviewApi({ id, page: pageParam, size });

    return {
      result: data.data.menuReviews,
      nextPage: pageParam + 1,
      totalPage: data.data.pagination.totalPage,
    };
  };

  return useInfinite('infinite', fetchDatas);
};
