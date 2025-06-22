import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BlockType = 'hero' | 'twoColumn' | 'imageGrid';

export interface HeroBlockData {
  heading: string;
  subtitle: string;
  cta: string;
}

export interface TwoColumnRowData {
  heading: string;
  subtitle: string;
  cta: string;
  imageUrl: string;
}

export interface ImageGridData {
  images: string[];
}

export type BlockData = HeroBlockData | TwoColumnRowData | ImageGridData;

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
}

export interface LayoutState {
  blocks: Block[];
}

const initialState: LayoutState = {
  blocks: [],
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addBlock: (state, action: PayloadAction<Block>) => {
      state.blocks.push(action.payload);
    },
    setBlocks: (state, action: PayloadAction<Block[]>) => {
      state.blocks = action.payload;
    },
    reorderBlocks: (state, action: PayloadAction<Block[]>) => {
      state.blocks = action.payload;
    },
  },
});

export const { addBlock, setBlocks, reorderBlocks } = layoutSlice.actions;
export default layoutSlice.reducer;
