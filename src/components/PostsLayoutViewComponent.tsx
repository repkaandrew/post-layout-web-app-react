import React, {useCallback, useEffect, useRef} from 'react';
import {PostLayoutOption} from '../models/post-layout-option.ts';
import {ObstructionData, ObstructionType} from '../models/post-layout-input.ts';
import * as THREE from 'three';
import {Color, Object3D} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

interface LayoutViewProps {
  postSize?: number;
  option?: PostLayoutOption;
  obstructions: ObstructionData[];
}

const obstructionColor: { [key in ObstructionType]: Color } = {
  [ObstructionType.PLACE_POST]: new Color('#80ff00'),
  [ObstructionType.TRY_TO_AVOID]: new Color('#ff8000'),
  [ObstructionType.MUST_AVOID]: new Color('#990000')
}

const PostsLayoutViewComponent: React.FC<LayoutViewProps> = ({postSize, option, obstructions}) => {
  const canvasRef = useRef<HTMLDivElement>();
  const {current: root} = useRef(new Object3D());
  const {current: scene} = useRef(new THREE.Scene());
  const {current: engine} = useRef(new THREE.WebGLRenderer());
  const {current: camera} = useRef(new THREE.PerspectiveCamera(60, 1, 0.1, 5000));

  const canvas = engine.domElement;

  // on component mount
  useEffect(() => {
    scene.add(root);
    engine.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    engine.localClippingEnabled = true;
    engine.shadowMap.enabled = false;
    engine.setClearColor('#ffffff');

    canvasRef.current.appendChild(canvas);

    scene.add(camera);

    // init camera controls
    const cameraControls = new OrbitControls(camera, canvas);
    const position = new THREE.Vector3(50, 50, 500);
    const lookAt = new THREE.Vector3(50, 24, 0);
    cameraControls.object.position.copy(position);
    cameraControls.target.copy(lookAt);
    cameraControls.update();

    if (import.meta.env.DEV) {
      scene.add(new THREE.AxesHelper(500));
      scene.add(new THREE.CameraHelper(camera));
    }

    // init lights
    scene.add(new THREE.AmbientLight('#404040'));

    // add ground
    const geometry = new THREE.PlaneGeometry(10000, 500);
    const material = new THREE.MeshBasicMaterial({color: '#527746', side: THREE.DoubleSide});
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
  }, [option, obstructions]);

  const addPost = useCallback(
    (position: number, size: number, index: number): void => {
      const geometry = new THREE.BoxGeometry(size, 48, size, 100, 100, 100);
      const material = new THREE.MeshPhongMaterial({color: '#4b3f3c'});
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
    option?.postLocations.forEach((location, i) => addPost(location, postSize, i));
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
    <div id="canvas-container" ref={canvasRef}></div>
  );
}

export default PostsLayoutViewComponent;
