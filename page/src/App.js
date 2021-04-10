import './index.css';
import React , { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, extend, useThree, useLoader, DoubleSide  } from 'react-three-fiber';
import * as THREE from 'three/src/Three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useTransition, animated } from '@react-spring/three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';

extend({OrbitControls})
const Controls = () => {
  const orbitRef = useRef();
  const {camera, gl} = useThree();

  useFrame(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
    args={[camera, gl.domElement]}
    ref={orbitRef}
    />
  )
} 

const Plane = () => {

  const spacetexture = useLoader(TextureLoader, '/bigspace.jpg');
  const earthtexture = useLoader(TextureLoader, '/earth.jpg');
  const ref = useRef();
  const vertices = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]
  useFrame(() => {
    ref.current.rotation.y  += 0.001
  })

  return(
  <group ref={ref}>
  <mesh position={[0, 0, 0]} scale={[25, 25, 25]}>
   <sphereBufferGeometry args={[1, 32, 32]} attach="geometry"/>
    <meshPhysicalMaterial metalness={0.1} map={earthtexture} attach="material" DoubleSide={true}/>
  </mesh>
  <mesh position={[0, 0, 0]} scale={[400, 400, 400]}>
  <sphereBufferGeometry args={[1, 64, 64]} attach="geometry"/>
    <meshBasicMaterial map={spacetexture} attach="material" side={THREE.DoubleSide}/>
  </mesh>
  </group>  
  )}




function App() {
  return (
  <Canvas shadowMap camera={{ position: [0,0,100], fov: 40 }}>
    <spotLight position={[0,0,100]} penumbra={1}/>
    <Suspense fallback={null}>
    <Plane/>
    <Controls/>
    </Suspense>
  </Canvas>
  );
}

export default App;