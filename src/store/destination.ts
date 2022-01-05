import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso } from '@model/index';

interface TProps {
  tempDestination: IJuso;
  userDestination: IJuso;
  tempLocation: IJuso;
  userLocation: IJuso;
  availableDestination: IAvailableDestination;
}
interface IAvailableDestination {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

const locationState = {
  roadAddr: null,
  roadAddrPart1: null,
  roadAddrPart2: null,
  jibunAddr: null,
  engAddr: null,
  zipNo: null,
  admCd: null,
  rnMgtSn: null,
  bdMgtSn: null,
  detBdNmList: null,
  bdNm: null,
  bdKdcd: null,
  siNm: null,
  sggNm: null,
  emdNm: null,
  liNm: null,
  rn: null,
  udrtYn: null,
  buldMnnm: null,
  buldSlno: null,
  mtYn: null,
  lnbrMnnm: null,
  lnbrSlno: null,
  emdNo: null,
};

const INITIAL_STATE: TProps = {
  tempDestination: {
    ...locationState,
  },
  userDestination: {
    ...locationState,
  },
  tempLocation: {
    ...locationState,
  },
  userLocation: {
    ...locationState,
  },
  availableDestination: {
    morning: false,
    quick: false,
    parcel: false,
  },
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    SET_DESTINATION: (state, action: PayloadAction<IJuso>) => {
      state.userDestination = action.payload;
    },
    SET_DESTINATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempDestination = action.payload;
    },
    SET_LOCATION: (state, action: PayloadAction<IJuso>) => {
      state.userLocation = action.payload;
    },
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },
    INIT_LOCATION_TEMP: (state, action: PayloadAction) => {
      state.tempLocation = locationState;
    },
    SET_AVAILABLE_DESTINAION: (
      state,
      action: PayloadAction<IAvailableDestination>
    ) => {
      state.availableDestination = action.payload;
    },
  },
});

export const {
  SET_DESTINATION,
  SET_DESTINATION_TEMP,
  SET_LOCATION,
  SET_LOCATION_TEMP,
  SET_AVAILABLE_DESTINAION,
  INIT_LOCATION_TEMP,
} = destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
