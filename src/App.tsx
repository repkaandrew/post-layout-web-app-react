import {useContext} from 'react'
import InputFormComponent from './components/InputFormComponent.tsx';
import './App.css'
import {PostLayoutInput} from './models/post-layout-input.ts';
import {calculatePostLayout} from './utils/api-utils.ts';
import MainViewComponent from './components/MainViewComponent.tsx';
import {ViewContext} from './context/ViewContext.ts';

function App() {
  const appCtx = useContext(ViewContext);

  const onInputSubmitted = async (input: PostLayoutInput) => {
    const calcRes = await calculatePostLayout(input);

    appCtx.refreshState({
      postSize: input.postSize,
      obstructions: input.obstructions,
      options: calcRes
    });
  }

  return (
    <>
      <header>
        <p className="title">Calculate post layout</p>
      </header>
      <main className={"main-container"}>
        <InputFormComponent onSubmit={onInputSubmitted}/>
        <MainViewComponent/>
      </main>
    </>
  )
}

export default App
