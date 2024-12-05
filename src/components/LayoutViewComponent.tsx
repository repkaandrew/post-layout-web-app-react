import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PostLayoutOption} from '../models/post-layout-option.ts';
import {ObstructionData, ObstructionType} from '../models/post-layout-input.ts';
import * as THREE from 'three';
import {Color, Object3D} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

interface LayoutViewProps {
  layoutOptions: PostLayoutOption[];
  obstructions: ObstructionData[];
}

const obstructionColor: { [key in ObstructionType]: Color } = {
  [ObstructionType.PLACE_POST]: new Color('#80ff00'),
  [ObstructionType.TRY_TO_AVOID]: new Color('#ff8000'),
  [ObstructionType.MUST_AVOID]: new Color('#990000')
}

const LayoutViewComponent: React.FC<LayoutViewProps> = ({layoutOptions, obstructions}) => {
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const canvasRef = useRef(null);
  const {current: root} = useRef(new Object3D());
  const {current: scene} = useRef(new THREE.Scene());
  const {current: camera} = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const {current: engine} = useRef(new THREE.WebGLRenderer());

  const canvas = engine.domElement;

  // on component mount
  useEffect(() => {
    scene.add(root);
    engine.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    engine.localClippingEnabled = true;
    engine.shadowMap.enabled = false;
    engine.setClearColor(0xffffff);

    canvasRef.current.appendChild(canvas);

    scene.add(camera);

    // init camera controls
    const cameraControls = new OrbitControls(camera, canvas);
    const position = new THREE.Vector3(50, 50, 500);
    const lookAt = new THREE.Vector3(50, 24, 0);
    cameraControls.object.position.copy(position);
    cameraControls.target.copy(lookAt);
    cameraControls.update();

    scene.add(new THREE.AxesHelper(500));
    scene.add(new THREE.CameraHelper(camera));

    // init lights
    const light = new THREE.PointLight('#ffffff', 1);
    scene.add(light);
    light.position.set(0, 0, 900);

    // add ground
    const geometry = new THREE.PlaneGeometry(10000, 500);
    const material = new THREE.MeshBasicMaterial({color: '#78b464', side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // run
    const run = () => {
      engine.render(scene, camera);
      requestAnimationFrame(run);
    }

    run();

  }, []);

  // on component update
  useEffect(() => {
    disposeScene();
    assembleScene();
  }, [selectedOptionIdx, layoutOptions, obstructions]);

  const selectedOption = layoutOptions[selectedOptionIdx];
  const isPreviousOptionAvailable = selectedOptionIdx > 0;
  const isNextOptionAvailable = selectedOptionIdx < layoutOptions.length - 1;

  const addPost = useCallback(
    (position: number, size: number, index: number): void => {
    const geometry = new THREE.BoxGeometry(size, 48, size, 100, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: '#59473d'});
    const post = new THREE.Mesh(geometry, material);

    post.position.x = position;
    post.position.y = 24;
    post.name = `post-${index + 1}`;

    root.add(post);
  },
    [root]
  );

  const addObstruction = useCallback(
    (position: number, size: number, type: ObstructionType, index: number): void => {
      const geometry = new THREE.CylinderGeometry(size / 2, size / 2, 1, 100, 100);
      const material = new THREE.MeshPhongMaterial({color: obstructionColor[type]});
      const obstruction = new THREE.Mesh(geometry, material);

      obstruction.position.x = position;
      obstruction.position.y = 0.5;
      obstruction.name = `obstruction-${index + 1}`

      root.add(obstruction);
    },
    [root]
  );

  const assembleScene = (): void => {
    selectedOption?.postLocations.forEach((location, i) => addPost(location, 3.5, i));
    obstructions?.forEach((obstruction, i) => addObstruction(obstruction.location, obstruction.size, obstruction.type, i))
  }

  const disposeScene = useCallback(
    (): void => {
      root.children.forEach((child: any) => {
        child.traverse((object: any) => {
          if (object.isMesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }

            if (Array.isArray(object.material)) {
              (object.material as THREE.Material[]).forEach(material => material.dispose());
            } else {
              (object.material as THREE.Material).dispose();
            }
          }
        });

        child.parent.remove(child);
      });

      root.remove(...root.children);
    },
    [root]
  );

  return (
    <>
      <div className="options-selection-section">
        <button className="btn btn-light"
                disabled={!isPreviousOptionAvailable}
                onClick={() => setSelectedOptionIdx(selectedOptionIdx - 1)}>
          <span>&lArr;</span>
        </button>
        <button className="btn btn-light"
                disabled={!isNextOptionAvailable}
                onClick={() => setSelectedOptionIdx(selectedOptionIdx + 1)}>
          <span>&rArr;</span>
        </button>
      </div>
      <div id="canvas-container" ref={canvasRef}></div>
    </>
  );
}

export default LayoutViewComponent;
