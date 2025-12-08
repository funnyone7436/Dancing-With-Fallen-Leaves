import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

import BackgroundSphere from './components/BackgroundSphere'
import FallingLeaves from './components/FallingLeaves'
import OrbitingModel from './components/OrbitingModel'

import BirdImagesOrbit from './components/BirdImagesOrbit'
import BirdImagesOrbit1 from './components/BirdImagesOrbit1'
import DogImagesOrbit from './components/DogImagesOrbit'
import SqImagesOrbit from './components/SqImagesOrbit'
import BuImagesOrbit from './components/BuImagesOrbit'
import RandomLeavesField from './components/RandomLeavesField'
import BfImagesOrbit from './components/BfImagesOrbit'

import CameraController from './components/CameraController'
import PoseMotionValueDetector from './components/PoseMotionValueDetector'
import AppUI from './components/AppUI'

const BASE = import.meta.env.BASE_URL || '/'

export default function App() {
  const [motionValue, setMotionValue] = useState(0)
  const [average, setAverage] = useState(0)
  const countRef = useRef(0)
  const sumRef = useRef(0)

  // Update running average
  useEffect(() => {
    sumRef.current += motionValue
    countRef.current += 1
    setAverage(sumRef.current / countRef.current)
  }, [motionValue])

  return (
    <>
      {/* UI for Score, Title, etc. */}
      <AppUI motionValue={motionValue} />

      {/* The MOTION DETECTOR */}
      <PoseMotionValueDetector
        onMotionValue={({ motionValue }) => setMotionValue(motionValue)}
        debug={false}   // set true to see webcam window
      />

      {/* 3D Scene */}
      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 0, 3]} />
        <CameraController speed={0.01} initialAngle={Math.PI / 2} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={5} />

        <Suspense fallback={null}>
          <BackgroundSphere />
          <FallingLeaves motionValue={motionValue} />
          <OrbitingModel radius={20} speed={0.2} height={1} />

          <BirdImagesOrbit radius={400} count={8} scale={12} />
          <BirdImagesOrbit1 radius={300} count={5} scale={12} />
          <DogImagesOrbit radius={500} count={1} scale={20} />
          <SqImagesOrbit radius={500} count={2} scale={16} />
          <BuImagesOrbit radius={500} count={1} scale={18} />

          <BfImagesOrbit
            radius={300}
            count={2}
            scale={20}
            sequences={[
              { path: `${BASE}r3f/gbf/gbf`, length: 14 }, 
              { path: `${BASE}r3f/bf/bf`, length: 14 },
              { path: `${BASE}r3f/rbf/rbf`, length: 14 },
              { path: `${BASE}r3f/bbf/bbf`, length: 14 }
            ]}
          />

          <RandomLeavesField center={[0, 200, 0]} radius={60} count={320} scale={10} />
        </Suspense>
      </Canvas>
    </>
  )
}
