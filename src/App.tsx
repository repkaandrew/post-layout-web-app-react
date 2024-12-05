import {useState} from 'react'
import InputFormComponent from './components/InputFormComponent.tsx';
import './App.css'
import {ObstructionData, PostLayoutInput} from './models/post-layout-input.ts';
import {PostLayoutOption} from './models/post-layout-option.ts';
import {calculatePostLayout} from './utils/api-utils.ts';
import LayoutViewComponent from './components/LayoutViewComponent.tsx';

interface RenderData {
  obstructions: ObstructionData[];
  layoutOptions: PostLayoutOption[];
}

function App() {
  const [renderData, setRenderData] = useState<RenderData>({
    obstructions: [],
    layoutOptions: []
  })

  const onInputSubmitted = async (input: PostLayoutInput) => {
    const calcRes = await calculatePostLayout(input);
    setRenderData({
      obstructions: input.obstructions,
      layoutOptions: calcRes
    });
  }

  return (
    <>
      <header>
        <p className="title">Calculate post layout</p>
      </header>
      <main className={"main-container"}>
        <InputFormComponent onSubmit={onInputSubmitted}/>
        <LayoutViewComponent {...renderData}/>
      </main>
    </>
  )
}

export default App
