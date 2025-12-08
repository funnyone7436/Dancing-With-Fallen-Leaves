// src/components/BirdAnimationOrbit.jsx
import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL || '/'
export default function BirdAnimationOrbit1({ radius = 200, count = 12 * 6, scale = 1 }) {
  const groupRef = useRef()
  const { camera } = useThree()

  // Load animation frames
  const frames = useLoader(
    THREE.TextureLoader,
    Array.from({ length: 6 }, (_, i) => `${BASE}r3f/bird1/bird1_${i + 1}.png`)
  )

  // Ensure proper encoding
  frames.forEach((frame) => {
    frame.encoding = THREE.sRGBEncoding
  })

  // Initialize birds
  const birds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        angle,
        textureIndex: i % frames.length,
        frameDelay: Math.floor(Math.random() * 5),
      }
    })
  }, [count, frames.length])

  const frameStates = useRef(
    birds.map(({ textureIndex }) => ({
      current: textureIndex,
      timer: 0,
    }))
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.children.forEach((bird, i) => {
      const angle = birds[i].angle - time * 0.06
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      const y = 90

      bird.position.set(x, y, z)
      bird.lookAt(camera.position)

      const anim = frameStates.current[i]
      anim.timer += 1
      if (anim.timer > 5) {
        anim.current = (anim.current + 1) % frames.length
        bird.material.map = frames[anim.current]
        anim.timer = 0
      }
    })
  })

  return (
    <group ref={groupRef}>
      {birds.map((bird, i) => (
        <mesh key={i}>
          <planeGeometry args={[scale, scale]} />
          <meshBasicMaterial
            map={frames[bird.textureIndex]} // ✅ assign initial frame per bird
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
