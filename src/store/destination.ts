import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso, IRegisterDestination } from '@model/index';
import { TLocationType } from '@utils/checkDestinationHelper';
import { availabilityDestination } from '@api/destination';

interface IAvailableDestination {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
  spot: boolean;
}

export interface IDestination {
  name: string;
  location: {
    addressDetail: string;
    address: string | null;
    dong: string | null;
    zipCode: string | null;
  };
  main: boolean;
  delivery?: string;
  deliveryMessage?: string;
  receiverName?: string;
  receiverTel?: string;
  deliveryMessageType?: string;
  id?: number;
  deliveryTime?: string;
}

interface TProps {
  userDestination: IDestination | null;
  tempLocation: IJuso;
  userTempDestination: IDestination | null;
  userLocation: IJuso;
  availableDestination: IAvailableDestination;
  destinationStatus: string;
  userDestinationStatus: string;
  locationStatus: TLocationType;
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
  detailJuso: null,
};

// const destinationState = {
//   addressDetail: '',
//   name: '',
//   address: '',
//   delivery: '',
//   deliveryMessage: '',
//   dong: '',
//   main: false,
//   receiverName: '',
//   receiverTel: '',
//   zipCode: '',
//   deliveryMessageType: '',
// };

// const tempDestinationState = {
// name: '',
// location: {
//   addressDetail: '',
//   address: '',
//   dong: '',
//   zipCode: '',
// },
// main: false,
// deliveryMessage: '',
// receiverName: '',
// receiverTel: '',
// };

const INITIAL_STATE: TProps = {
  userDestination: null,
  userTempDestination: null,
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
    spot: false,
  },
  locationStatus: '',
  destinationStatus: '',
  userDestinationStatus: '',
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    // 배송지 검색 후
    SET_DESTINATION: (state, action: PayloadAction<IDestination | null>) => {
      state.userDestination = action.payload;
    },
    INIT_DESTINATION: (state, action: PayloadAction) => {
      state.userDestination = null;
    },

    SET_TEMP_DESTINATION: (state, action: PayloadAction<IDestination | null>) => {
      state.userTempDestination = action.payload;
    },

    INIT_TEMP_DESTINATION: (state, action: PayloadAction) => {
      state.userTempDestination = null;
    },
    SET_LOCATION: (state, action: PayloadAction<IJuso>) => {
      state.userLocation = action.payload;
    },
    // 유저 위치 정보 획득
    SET_LOCATION_STATUS: (state, action: PayloadAction<TLocationType>) => {
      state.locationStatus = action.payload;
    },
    // 위치 검색 후 획득 위치 (위치 설정 전)
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },
    INIT_LOCATION_TEMP: (state, action: PayloadAction) => {
      state.tempLocation = locationState;
    },
    SET_AVAILABLE_DESTINATION: (state, action: PayloadAction<IAvailableDestination>) => {
      state.availableDestination = action.payload;
    },
    INIT_AVAILABLE_DESTINATION: (state, action: PayloadAction) => {
      state.availableDestination = { morning: false, quick: false, parcel: false, spot: false };
    },
    // 배송지 체크 api
    SET_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.destinationStatus = action.payload;
    },

    INIT_DESTINATION_STATUS: (state, action: PayloadAction) => {
      state.destinationStatus = '';
    },
    // 유저가 선택한 배송방법
    SET_USER_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.userDestinationStatus = action.payload;
    },
    INIT_USER_DESTINATION_STATUS: (state, action: PayloadAction) => {
      state.userDestinationStatus = '';
    },
  },
});

export const {
  SET_DESTINATION,
  INIT_DESTINATION,
  SET_TEMP_DESTINATION,
  INIT_TEMP_DESTINATION,
  SET_LOCATION,
  SET_LOCATION_TEMP,
  SET_LOCATION_STATUS,
  SET_AVAILABLE_DESTINATION,
  INIT_AVAILABLE_DESTINATION,
  INIT_LOCATION_TEMP,
  SET_DESTINATION_STATUS,
  INIT_DESTINATION_STATUS,
  SET_USER_DESTINATION_STATUS,
  INIT_USER_DESTINATION_STATUS,
} = destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
