// src/components/BeatVisualizer.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { loadAudioAndBeats, getAudio, getBeats } from '../utils/AudioManager'

export default function BeatVisualizer({ onBeat }) {
  const ballRef = useRef()
  const [ready, setReady] = useState(false)
  const [beatIndex, setBeatIndex] = useState(0)
  const velocity = useRef(0)

  useEffect(() => {
    const setup = async () => {
      const { audio } = await loadAudioAndBeats()

      const onClick = () => {
        audio.play()
        window.removeEventListener('click', onClick)
      }
      window.addEventListener('click', onClick)

      setReady(true)
    }

    setup()
  }, [])

  useFrame((state, delta) => {
    if (!ready) return

    const audio = getAudio()
    const beats = getBeats()
    const currentTime = audio.currentTime

    if (beatIndex < beats.length && currentTime >= beats[beatIndex].time) {
      const strength = beats[beatIndex].strength
      velocity.current = Math.min(strength * 0.8, 1.5)

      if (onBeat) onBeat(beats[beatIndex])

      setBeatIndex((i) => i + 1)
    }

    velocity.current -= 9.8 * delta

    const y = Math.max(0, (ballRef.current?.position.y ?? 0) + velocity.current)

    const angle = currentTime * 0.5
    const radius = 10
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

  })

  return null
}
