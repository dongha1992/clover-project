import { deleteSpotLike, postSpotLike } from "@api/spot";
import { useMutation, useQueryClient } from "react-query";

export const useOnLike = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (id: number) => {
      const req = await postSpotLike(id);
      if (req.status === 200) {
        return req;
      }
    },
    {
      onMutate: async (id) => {
        const state = true;

        // 나가는 refatch를 취소 시킴
        queryClient.cancelQueries(['spotLike', id]);
        queryClient.cancelQueries(['spotList', 'new']);
        queryClient.cancelQueries(['spotList', 'station']);
        queryClient.cancelQueries(['spotList', 'event']);

        // 현재 like 상태 prevLikeStatus에 저장
        const prevLikeStatus = queryClient.getQueryData(['spotLike', id]);
        const prevNewSpotList: any = queryClient.getQueryData(['spotList', 'new']);
        const prevStationSpotList: any = queryClient.getQueryData(['spotList', 'station']);
        const prevEventSpotList: any = queryClient.getQueryData(['spotList', 'event']);

        // 좋아요 카운터 변경
        let newSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'new']),
        };
        let stationSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'station']),
        };
        let eventSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'event']),
        };

        const editNewSpots = newSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount += 1;
          }
          return item;
        });

        const editStationSpots = stationSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount += 1;
          }
          return item;
        });

        const editEventSpots = eventSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount += 1;
          }
          return item;
        });

        newSpotList = { ...newSpotList, spots: [...editNewSpots] };
        stationSpotList = { ...stationSpotList, spots: [...editStationSpots] };
        eventSpotList = { ...eventSpotList, spots: [...editEventSpots] };

        // 미리 UI에 좋아요 on&off 상태와 좋아요 카운터 적용 시켜 놓음
        queryClient.setQueryData(['spotLike', id], state);
        queryClient.setQueryData(['spotList', 'new'], newSpotList);
        queryClient.setQueryData(['spotList', 'station'], stationSpotList);
        queryClient.setQueryData(['spotList', 'event'], eventSpotList);

        // 에러가 나면 이전 상태값을 context로 전달합니다.
        return {
          prevLikeStatus,
          prevNewSpotList,
          prevStationSpotList,
          prevEventSpotList,
        };
      },
      onSettled: (result, error, id) => {
        // onSettled는 요청이 성공이든 실패든 실행되는 부분입니다. invalidateQueries로
        // query키를 날려서 강제로 리프레쉬 시킵니다.
        queryClient.invalidateQueries(['spotLike', id]);
        queryClient.invalidateQueries('spotList');
      },
      onError: (err, value, context: any) => {
        console.log('에러 떴습니다. onLike', err);
        queryClient.setQueryData(['spotLike', value], context.prevLikeStatus);
        queryClient.setQueryData(['spotList', 'new'], context.prevNewSpotList);
        queryClient.setQueryData(['spotList', 'station'], context.prevStationSpotList);
        queryClient.setQueryData(['spotList', 'event'], context.prevEventSpotList);
      },
    }
  );
  return mutate
}

export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (id: number) => {
      console.log('deleteLike');
      const req = await deleteSpotLike(id);
      if (req.status === 200) {
        return req;
      }
    },
    {
      onMutate: async (id) => {
        const state = false;

        // 나가는 refatch를 취소 시킴
        queryClient.cancelQueries(['spotLike', id]);
        queryClient.cancelQueries(['spotList', 'new']);
        queryClient.cancelQueries(['spotList', 'station']);
        queryClient.cancelQueries(['spotList', 'event']);

        // 현재 like 상태 prevLikeStatus에 저장
        const prevLikeStatus = queryClient.getQueryData(['spotLike', id]);
        const prevNewSpotList: any = queryClient.getQueryData(['spotList', 'new']);
        const prevStationSpotList: any = queryClient.getQueryData(['spotList', 'station']);
        const prevEventSpotList: any = queryClient.getQueryData(['spotList', 'event']);

        // 좋아요 카운터 변경
        let newSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'new']),
        };
        let stationSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'station']),
        };
        let eventSpotList: any = {
          ...queryClient.getQueryData(['spotList', 'event']),
        };

        const editNewSpots = newSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount -= 1;
          }
          return item;
        });

        const editStationSpots = stationSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount -= 1;
          }
          return item;
        });

        const editEventSpots = eventSpotList.spots.map((item: any) => {
          if (item.id === id) {
            item.likeCount -= 1;
          }
          return item;
        });

        newSpotList = { ...newSpotList, spots: [...editNewSpots] };
        stationSpotList = { ...stationSpotList, spots: [...editStationSpots] };
        eventSpotList = { ...eventSpotList, spots: [...editEventSpots] };

        // 미리 UI에 좋아요 on&off 상태와 좋아요 카운터 적용 시켜 놓음
        queryClient.setQueryData(['spotLike', id], state);
        queryClient.setQueryData(['spotList', 'new'], newSpotList);
        queryClient.setQueryData(['spotList', 'station'], stationSpotList);
        queryClient.setQueryData(['spotList', 'event'], eventSpotList);
        // queryClient.setQueryData(['spotList'], spotList);

        // 에러가 나면 이전 상태값을 context로 전달합니다.
        return {
          prevLikeStatus,
          prevNewSpotList,
          prevStationSpotList,
          prevEventSpotList,
        };
      },
      onSettled: (result, error, id) => {
        // onSettled는 요청이 성공이든 실패든 실행되는 부분입니다. invalidateQueries로
        // query키를 날려서 강제로 리프레쉬 시킵니다.
        queryClient.invalidateQueries(['spotLike', id]);
        queryClient.invalidateQueries('spotList');

      },
      onError: (err, value, context: any) => {

        // 에러가 나면 context로 넘어온 이전 상태값을 사용합니다.
        queryClient.setQueryData(['spotLike', value], context.prevLikeStatus);
        queryClient.setQueryData(['spotList', 'new'], context.prevNewSpotList);
        queryClient.setQueryData(['spotList', 'station'], context.prevStationSpotList);
        queryClient.setQueryData(['spotList', 'event'], context.prevEventSpotList);
      },
    }
  );
  return mutate
}