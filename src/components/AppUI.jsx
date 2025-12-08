import React, { useEffect, useState, useRef } from 'react'
import { loadAudioAndBeats, getAudio } from '../utils/AudioManager'

// Adjust this to make scoring faster or slower
const SCORE_MULTIPLIER = 0.2

// NEW CONFIGURATION: Define the desired frame rate for the scoring loop
const GAME_LOOP_FPS = 1; // Set to 30 FPS (or 10 FPS if you want it much slower)
const FRAME_DELAY_MS = 1000 / GAME_LOOP_FPS;

// Constants for Visual Feedback
const BASE_FONT_SIZE = 16 
const MAX_FONT_INCREASE = 24 
const MOTION_SCALE_FACTOR = 0.05 

function isAudioPlaying(audio) {
  if (!audio) return false
  return (
    !audio.ended
  )
}


export default function AppUI({ motionValue }) {
  const [score, setScore] = useState(0)
  
  // We use refs for values that change constantly to avoid re-running the effect
  const scoreRef = useRef(0)
  const audioStarted = useRef(false)
  const motionValRef = useRef(0) // Stores latest motionValue

  // 1. Keep motionValRef updated instantly when prop changes
  useEffect(() => {
    motionValRef.current = motionValue
  }, [motionValue])

  // 2. Setup Audio
  useEffect(() => {
    const setup = async () => {
      // NOTE: This assumes '../utils/AudioManager' is available.
      if (typeof loadAudioAndBeats === 'function') {
         await loadAudioAndBeats()
      } else {
         console.warn("loadAudioAndBeats not available. Skipping audio setup.")
      }
    }
    setup()
  }, [])

  // 3. Lower-frequency Game Loop (Now using setTimeout instead of rAF)
  useEffect(() => {
    let timerId = null // Changed from rAF to timerId
    const audio = getAudio()

    const loop = () => {
      // Logic to start audio on first movement
      if (motionValRef.current > 0 && !audioStarted.current) {
        const activeAudio = getAudio()
        if (activeAudio) {
          activeAudio.play().catch(e => console.log(e))
          audioStarted.current = true
        }
      }

      // Logic to calculate score
      if (audioStarted.current) {
        // Only add points if moving
        if (motionValRef.current > 0) {
          // Score is calculated based on motion intensity (0-100) and multiplier
          scoreRef.current += (motionValRef.current * SCORE_MULTIPLIER)
		  const playing = isAudioPlaying(audio)
		  if (playing) {
			  setScore(Math.floor(scoreRef.current))
			}
          
        }
      }

      // MODIFIED: Use setTimeout for a fixed, lower frame rate
      timerId = setTimeout(loop, FRAME_DELAY_MS)
    }

    loop()

    // MODIFIED: Use clearTimeout for cleanup
    return () => clearTimeout(timerId)
  }, []) // Empty dependency array ensures loop runs continuously without resetting

  // Calculate dynamic font size based on motionValue
  const dynamicFontSize = BASE_FONT_SIZE;

  return (
    <>
      {/* Top-left: Score */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '8px',
        borderRadius: '8px',
        fontSize: `${dynamicFontSize}px`, 
        transition: 'font-size 0.1s ease-out', 
        zIndex: 1000
      }}>
        <div>Score: {score}</div>
      </div>

      {/* Bottom-center: Title */}
      <div style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 1000
      }}>
        Dancing with Fallen Leaves
      </div>

      {/* Bottom-right: Tagline + code link */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div>🔐 No worries, just fun!</div>
        <a href="https://github.com/funnyone7436/Dancing-With-Fallen-Leaves" target="_blank" style={{ color: '#61dafb' }}>🔍 View the full source on GitHub</a>
      </div>
    </>
  )
}