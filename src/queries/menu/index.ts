import { IMenus } from '@model/index';

interface IProps {
  previous: any;
  id: number;
  likeCount: number;
  liked: boolean;
}
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
