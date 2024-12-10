import {PostLayoutOption} from '../models/post-layout-option.ts';
import {ObstructionData} from '../models/post-layout-input.ts';
import {Context, createContext} from 'react';

export class ViewContextData {
  postSize: number;
  selectedOptionIdx: number;
  options: PostLayoutOption[];
  obstructions: ObstructionData[];
  setOption: (idx: number) => void;
  refreshState: (state: Partial<ViewContextData>) => void;

  constructor({options, obstructions, postSize}: Partial<ViewContextData>) {
    this.options = options ?? [];
    this.obstructions = obstructions ?? [];
    this.selectedOptionIdx = options?.length > 0 ? 0 : -1;
    this.postSize = postSize ?? 3.5;
    this.setOption = null;
    this.refreshState = null;
  }

  static empty(): ViewContextData {
    return new ViewContextData({});
  }
}

export const ViewContext: Context<ViewContextData> = createContext(ViewContextData.empty());
