// src/components/RandomLeavesField.jsx
import React, { useMemo, useRef } from 'react'
import { useLoader, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function RandomLeavesField({
  center = [0, 0, 0],
  radius = 100,
  count = 100,
  scale = 8,
}) {
  const groupRef = useRef()
  const { camera } = useThree()

  const textures = useLoader(
    THREE.TextureLoader,
    Array.from({ length: 23 }, (_, i) => `${base}r3f/leave_color/leave_color_${i + 1}.png`)
  )

  const leaves = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * radius
      const x = center[0] + r * Math.cos(angle)
      const z = center[2] + r * Math.sin(angle)
      const y = center[1] + (Math.random() - 0.5) * 10
      const texture = textures[Math.floor(Math.random() * textures.length)]
      return { position: [x, y, z], texture }
    })
  }, [count, radius, center, textures])

  // Make all leaves face the camera
  useFrame(() => {
    groupRef.current?.children.forEach((leaf) => {
      leaf.lookAt(camera.position)
    })
  })

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, i) => (
        <mesh key={i} position={leaf.position}>
          <planeGeometry args={[scale, scale]} />
          <meshBasicMaterial
            map={leaf.texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
