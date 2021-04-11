import './index.css';
import React , { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, extend, useThree, useLoader} from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { useSpring, animated } from '@react-spring/three'
import Select from './Comps/Select'
import { 
  CubeTextureLoader,
  RGBFormat, 
  WebGLCubeRenderTarget,
  LinearMipmapLinearFilter,
  CubeCamera,
} from "three";

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

const SkyBox =()=> {
  
  // grab the scene with useThree hook
  const {scene} = useThree()
  // instantiate a 6 sided cube texture
  const loader = new CubeTextureLoader()
  // load texture to loader
  const texture = loader.load([
    "/bkg1_right.png",
    "/bkg1_left.png",
    "/bkg1_top.png",
    "/bkg1_bot.png",
    "/bkg1_front.png",
    "/bkg1_back.png",
  ])
  // set scene background to texture
  scene.background = texture
  // have to return something cuz react so we return null
  return null
}



const Sphere = () => {

  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ani = useSpring({
      color: hovered ? "orange": "black",
      scale: active ? [4,4,4] : [1,1,1],
  })


  const {scene, gl} = useThree()
  const cubeRenderTarget = new WebGLCubeRenderTarget(256)
  const cubeCam = new CubeCamera(1, 1000, cubeRenderTarget)
  cubeCam.position.set(-100, -40, 0)
  scene.add(cubeCam)
  console.log(cubeCam)
  useFrame(()=> cubeCam.update(gl, scene))
  
  return<mesh
    visible position={[-100, -40, 0]}
    rotation={[0,0,0]} castShadow>
   <sphereGeometry args={[25, 256, 256]} attach="geometry"/>
   <meshBasicMaterial
        attach="material"
        color="white"
        roughness={0.1}
        metalness={1}
        envMap={cubeCam.renderTarget.texture}
      />
  </mesh>

  }

  const Ring = () => {
    const ringRef = useRef();
    const holotexture = useLoader(TextureLoader, '/hologram.jpg');
    useFrame(() => {
      ringRef.current.rotation.z  += 0.01
    })
    return(
    <group>
    <Select position={[-83,-10,-7]} />
    <Select position={[-66.3,-40,-9.5]}/>
    <Select position={[-80,-68,-3]}/>
    <mesh ref={ringRef} position={[-100, -40, 0]} rotation={[-0.1,0.3,0]} scale={[10, 10, 10]}>
    <ringGeometry args={[3,4,64]} attach="geometry"/>
     <meshPhysicalMaterial transparent opacity={0.7} metalness={0.8} clearcoat={0.8} map={holotexture} attach="material"/>
     
   </mesh>
   </group>
    )}






export default function App() {
  
  return (
  <Canvas shadowMap camera={{ position: [0,0,200], fov: 50 }} >
    <Suspense fallback={null}>
    <ambientLight/>
    <SkyBox/>
    <spotLight position={[0,0,200]} penumbra={1}/>
    <Sphere/>
    <Ring/>
    <Controls/>
    </Suspense>
  </Canvas>
  );
}

