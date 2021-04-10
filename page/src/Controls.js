import React , { useRef } from 'react';
import { useFrame, extend, useThree } from 'react-three-fiber';


const Controls = () => {
    extend({OrbitControls})
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

export default Controls