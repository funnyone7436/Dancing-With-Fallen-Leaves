// src/utils/AudioManager.js
let audio = null
let beats = []

export async function loadAudioAndBeats() {	
	const BASE = import.meta.env.BASE_URL   // "/" locally, "/Dancing-With-Fallen-Leaves/" on GH Pages

	if (!audio) {
		audio = new Audio(`${BASE}r3f/music/fallleaves.mp3`)

		await fetch(`${BASE}r3f/music/fallleaves_beat_energy_strength_with_keyframe.json`)
		  .then(res => res.json())
		  .then(data => {
			beats = data.beats
		  })
	  }
  return { audio, beats }
}

export function getAudio() {
  return audio
}

export function getBeats() {
  return beats
}
