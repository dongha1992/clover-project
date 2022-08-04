import cloneDeep from 'lodash-es/cloneDeep';
import { ISpotsDetail, Obj } from '@model/index';

interface IProps {
  spotList : ISpotsDetail[];
  sort: string;
  filter: string[];
};

const getFilteredSpotList = ({spotList, sort, filter }: IProps) => {
  try {
    let copiedSpotList = cloneDeep(spotList);
    const hasSpotFilter = filter && filter.filter((i) => i).length > 0;

    if (hasSpotFilter) {
      copiedSpotList = spotList.filter((spot: Obj)  => filter.every(filterItem => spot[filterItem]));
    }
    if (!sort) {
      return copiedSpotList;
    } else {
        switch (sort) {
          case '': 
              return spotList;
          case 'nearest':
            return copiedSpotList.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
              return a.distance - b.distance;
            });
          case 'frequency':
            return copiedSpotList.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
              return b.score! - a.score!;
            });
          case 'user':
            return copiedSpotList.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
              return b.userCount - a.userCount;
            });
          default: 
            return spotList;
        }
    }
  } catch (e) {
    console.error(e);
    return spotList;
  }
}

export default getFilteredSpotList;