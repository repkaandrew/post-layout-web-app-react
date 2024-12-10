import React, {useContext} from 'react';
import {ViewContext} from '../context/ViewContext.ts';
import PostsLayoutViewComponent from './PostsLayoutViewComponent.tsx';
import {PostLayoutDescription, PostLayoutOption} from '../models/post-layout-option.ts';

const MainViewComponent: React.FC = () => {
  const {options, obstructions, selectedOptionIdx, postSize, setOption} = useContext(ViewContext);

  const previousOptionAvailable = selectedOptionIdx > 0;
  const nextOptionAvailable = selectedOptionIdx < options.length - 1;
  const selectedOption = options[selectedOptionIdx];

  return (
    <>
      <div className={"view-service-container"}>
        <div className="options-selection-section">
          <button className="btn btn-light"
                  disabled={!previousOptionAvailable}
                  onClick={() => setOption(selectedOptionIdx - 1)}>
            <span>&lArr;</span>
          </button>
          <button className="btn btn-light"
                  disabled={!nextOptionAvailable}
                  onClick={() => setOption(selectedOptionIdx + 1)}>
            <span>&rArr;</span>
          </button>
        </div>
        {selectedOptionIdx >= 0 &&
            <div className="layout-description">
                <p>{createDescription(selectedOption.description, selectedOptionIdx)}</p>
                <p>Center to center: {JSON.stringify(calcCenterToCenterLength(selectedOption))}</p>
            </div>
        }
      </div>
      <PostsLayoutViewComponent
        postSize={postSize}
        option={selectedOption}
        obstructions={obstructions}>
      </PostsLayoutViewComponent>
    </>
  );
}

const createDescription = (description: PostLayoutDescription, idx: number): string => {
  return `Option ${idx + 1}: 
     even layout: ${description.evenLayout};
     extra posts: ${description.additionalPosts};
     try avoid: ${description.postsFallOnTryToAvoid};
     must avoid: ${description.postsFallOnMustAvoid}`;
}

const calcCenterToCenterLength = (selectedOption: PostLayoutOption): number[] => {
  const locations = selectedOption.postLocations;
  const c2c = [];

  for (let i = 1; i < locations.length; i++) {
    c2c.push(Math.round((locations[i] - locations[i - 1]) * 10) / 10);
  }

  return c2c;
}

export default MainViewComponent;
