import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TImageViewer = {
  images: string[];
  startIndex: number;
  isShow: boolean;
};

const initialState: TImageViewer = {
  images: [],
  startIndex: 0,
  isShow: false
};

export const imageViewerSlice = createSlice({
  name: 'imageViewer',
  initialState,
  reducers: {
    showImageViewer: (state, action: PayloadAction<TImageViewer>) => {
      const { images, startIndex, isShow } = action.payload;
      return { images, startIndex, isShow };
    },
    hideImageViewer: () => {
      return initialState;
    },
  },
});

export const { showImageViewer, hideImageViewer } = imageViewerSlice.actions;
export const imageViewerSelector = (state: AppState) => state.imageViewer;
export default imageViewerSlice.reducer;
