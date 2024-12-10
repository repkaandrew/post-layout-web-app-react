import {ViewContext, ViewContextData} from "./ViewContext"
import {PropsWithChildren, ReactNode, Reducer, useReducer} from 'react';

export interface ViewContextAction<T> {
  type: string;
  payload: T;
}

export enum ActionType {
  SET_OPTION = 'SET_OPTION',
  REBUILD = 'REBUILD'
}

export interface ViewContextChangeOptionData {
  optionIdx: number;
}

export interface ViewContextRebuildData {
  state: ViewContextData;
}

const viewContextReducer: Reducer<ViewContextData, ViewContextAction<any>> = (state, action): ViewContextData => {
  switch (action.type) {
    case ActionType.SET_OPTION: {
      const payload = action.payload as ViewContextChangeOptionData;
      return {
        ...state,
        selectedOptionIdx: payload.optionIdx
      };
    }
    case ActionType.REBUILD: {
      const rebuildData = action.payload as ViewContextRebuildData;
      return {
        ...rebuildData.state
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const ViewContextProvider = ({children}: PropsWithChildren): ReactNode => {
  const [state, dispatch] = useReducer(viewContextReducer, ViewContextData.empty());

  const setOption = (idx: number): void =>
    dispatch({
      type: ActionType.SET_OPTION,
      payload: {
        optionIdx: idx
      }
    });

  const refreshState = ({postSize, options, obstructions}: Partial<ViewContextData>): void =>
    dispatch({
      type: ActionType.REBUILD,
      payload: {
        state: new ViewContextData({
          options,
          obstructions,
          postSize
        })
      }
    });

  return (
    <ViewContext.Provider value={{
      ...state,
      setOption,
      refreshState
    }}>
      {children}
    </ViewContext.Provider>
  )
}

export default ViewContextProvider;
