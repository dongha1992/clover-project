import { deleteSpotLike, postSpotLike } from "@api/spot";
import { useMutation, useQueryClient } from "react-query";

// 프코스팟 메인 페이지 좋아요 버튼
export const useOnLike = (id: number, liked: boolean) => {
  const KEYS = ['POPULAR', 'NEW', 'EVENT'];
  const queryClient = useQueryClient();
  const spots: any = [];

  const deepClone = (obj: any) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    };
    const result: any = Array.isArray(obj) ? [] : {};
    for (let key of Object.keys(obj)) {
      result[key] = deepClone(obj[key]);
    };
    return result;
  };

  const toggleLike = async () => {
    try {
      if(liked) {
        await deleteSpotLike(id);
      } else {
        await postSpotLike(id);
      }
    } catch (e) {
      console.error(e);
    };
  };

  const { mutate } = useMutation(toggleLike, {
    onMutate: async () => {
      for (const i of KEYS ) {
        await queryClient.cancelQueries(['spotList', i]);
      }
      // console.log('Item', `id: ${list.id}, name: ${list.name}, liked: ${list.liked}`);
      for(const key of KEYS) {
        const prevSpots = queryClient.getQueryData(['spotList', key]);
        spots.push(prevSpots);

        if(prevSpots) {
          const editSpots: any = deepClone(prevSpots);
          queryClient.setQueryData(['spotList', key], {
            ...editSpots,
            spots: editSpots.spots.map((i: { id: number; liked: boolean; likeCount: number; }) => {
              if (i.id === id) {
                if (i.liked) {
                  i.liked = false;
                  if (i.likeCount > 0) {
                    i.likeCount -= 1;
                  } else {
                    i.likeCount = 0;
                  }
                } else {
                  i.liked = true;
                  i.likeCount += 1;
                }
              };
              return i;
            }),
          });
        }
      }
      return spots;
    },
    onError: (context: any) => {
      for (const key of KEYS) {
        queryClient.setQueryData(['spotList', key], context[key]);
      }
    },
    onSettled: () => {}
  });
  return mutate;
};
