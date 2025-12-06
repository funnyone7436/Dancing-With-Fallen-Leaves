import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function BackgroundSphere() {
  const texture = useLoader(THREE.TextureLoader, '/frame_0017.png')

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(1, 1)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh
      scale={[-1, 1, 1]}
      rotation={[0, Math.PI / 2, 0]} // Rotate 45 degrees around Y axis
    >
      <sphereGeometry args={[1000, 80, 80]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}
