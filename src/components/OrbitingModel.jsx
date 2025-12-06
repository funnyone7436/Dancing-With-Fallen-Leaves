// src/components/OrbitingModel.jsx
import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function OrbitingModel() {
  const ref = useRef()
  const { scene, animations } = useGLTF('/glb/bf_yellow.glb')
  const { actions, mixer } = useAnimations(animations, ref)

  // Play model animations
  useEffect(() => {
    if (actions && animations.length > 0) {
      animations.forEach((clip) => {
        actions[clip.name]?.reset().fadeIn(0.5).play()
      })
    }
  }, [actions, animations])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    const radius = 50
    const center = [0, 0, 0]

    const speed = 0.04 // lower = slower, try 0.2 or 0.1 for slow orbit
	const angle =  t * speed

	const x = center[0] + radius * Math.cos(angle)
	const z = center[2] + radius * Math.sin(angle)
    const y = Math.sin(t * 2) * 1 - 8 //up-down float

    if (ref.current) {
       ref.current.position.set(x, y, z)

  // Face camera
	   ref.current.lookAt(state.camera.position)
    }
    mixer?.update(delta)
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.8}
    />
  )
}
