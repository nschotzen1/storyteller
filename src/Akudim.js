// src/ThreeScene.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 100);

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 50, 100);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // Add the virtual screen (plane to receive shadows)
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, -200); // Position the screen behind the Aleph shapes
    plane.receiveShadow = true;
    scene.add(plane);

    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);

    // Function to create and add a rectangle to the scene
    const addRectangle = (x, y, z, width, height, depth) => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshPhongMaterial({ color: 0x0077ff, transparent: true, opacity: 0.7 });
      const rectangle = new THREE.Mesh(geometry, material);
      rectangle.position.set(x, y, z);
      rectangle.castShadow = true;
      scene.add(rectangle);
    };

    // Function to create an Aleph shape
    const createAleph = (startWidth, startHeight, depth, zOffset, levels, spacingFactor) => {
      const fibonacci = [startWidth, startHeight];
      for (let i = 2; i < levels; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
      }

      fibonacci.forEach((fib, index) => {
        const scale = fib / startHeight;
        const zPosition = zOffset - index * spacingFactor * scale; // Correctly use spacingFactor
        const aleph = [
          { y: 5 * scale, z: zPosition, widths: [5 * scale, 8 * scale], spaces: [6 * scale] },
          { y: 4 * scale, z: zPosition, widths: [5 * scale, 8 * scale], spaces: [6 * scale] },
          { y: 3 * scale, z: zPosition, widths: [8 * scale, 5 * scale], spaces: [6 * scale] },
          { y: 2 * scale, z: zPosition, widths: [8 * scale, 5 * scale], spaces: [6 * scale] },
          { y: 1 * scale, z: zPosition, widths: [8 * scale, 8 * scale], spaces: [3 * scale] },
          { y: 0 * scale, z: zPosition, widths: [5 * scale], spaces: [7 * scale, 7 * scale] },
          { y: -1 * scale, z: zPosition, widths: [8 * scale, 8 * scale], spaces: [3 * scale] },
          { y: -2 * scale, z: zPosition, widths: [5 * scale, 8 * scale], spaces: [6 * scale] },
          { y: -3 * scale, z: zPosition, widths: [5 * scale, 8 * scale], spaces: [6 * scale] },
          { y: -4 * scale, z: zPosition, widths: [8 * scale, 5 * scale], spaces: [6 * scale] },
          { y: -5 * scale, z: zPosition, widths: [8 * scale, 5 * scale], spaces: [6 * scale] },
        ];

        aleph.forEach(row => {
          let x = -(5 + 6 + 8) * scale / 2; // Center the Aleph shape
          row.widths.forEach((width, idx) => {
            if (row.spaces.length > 1) x += row.spaces[idx];
            addRectangle(x + width / 2, row.y, row.z, width, depth, depth);
            x += width;
            if (idx < row.spaces.length) {
              x += row.spaces[idx];
            }
          });
        });
      });
    };

    // Create Aleph shapes based on Fibonacci sequence with adjustable spacing
    const startWidth = 2;
    const startHeight = 3;
    const depth = 1.5;
    const zOffset = 0;
    const levels = 14;
    const spacingFactor = 4; // Adjust this value to control spacing

    createAleph(startWidth, startHeight, depth, zOffset, levels, spacingFactor);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeScene;
