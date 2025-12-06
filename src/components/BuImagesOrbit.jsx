// src/components/BirdAnimationOrbit.jsx
import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function BuAnimationOrbit({ radius = 200, count = 12 * 6, scale = 1 }) {
  const groupRef = useRef()
  const { camera } = useThree()

  // Load animation frames
  const frames = useLoader(
    THREE.TextureLoader,
    Array.from({ length: 8 }, (_, i) => `/r3f/bu/bu${i + 1}.png`)
  )

  // Ensure proper encoding
  frames.forEach((frame) => {
    frame.encoding = THREE.sRGBEncoding
  })

  // Initialize birds
  const birds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI/2
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
      const angle = birds[i].angle - time * 0.04
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      const y = -25

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
