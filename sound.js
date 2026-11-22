// Audio through Star's SDK only. Music is a synthesized chiptune loop (no
// audio file needed). Music and SFX are gated by separate prefs and volumes.
import { createStarAudio } from '/star-sdk/audio.js';
import { prefs } from './settings.js';

const MUSIC_ID = 'bgm.arcade';

// 32 eighth notes (8 s) in a bright, bouncy phrase. Frequencies in Hz.
const MELODY = [
  523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 783.99, 659.25,
  440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 659.25,
  698.46, 880.0, 1046.5, 880.0, 783.99, 698.46, 659.25, 587.33,
  392.0, 493.88, 587.33, 783.99, 1046.5, 783.99, 659.25, 523.25,
];

const MUSIC_DEF = {
  synth: { waveform: 'square', frequency: MELODY, duration: 8, volume: 10, envelope: 'sustained' },
  group: 'music',
};

const audio = createStarAudio();
let unlocked = false;
let loading = null;

function applyVolumes() {
  audio.setSfxVolume(prefs.sfxVol);
  audio.setMusicVolume(prefs.musicVol);
}

function ensureMusicLoaded() {
  if (!loading) {
    loading = Promise.resolve(audio.preload({ [MUSIC_ID]: MUSIC_DEF })).catch((err) => {
      console.warn('[sound] music failed to load', err);
      loading = null;
    });
  }
  return loading;
}

function syncMusic() {
  if (!unlocked) return; // browsers need a user gesture before audio may start
  if (!prefs.musicOn) {
    audio.music.stop(0.3);
    return;
  }
  ensureMusicLoaded().then(() => {
    if (prefs.musicOn) {
      Promise.resolve(audio.music.crossfadeTo(MUSIC_ID, { duration: 0.8, loop: true })).catch(() => {});
    }
  });
}

export const sound = {
  // Call from a real user gesture (first pointer or key press).
  unlock() {
    if (unlocked) return;
    unlocked = true;
    applyVolumes();
    syncMusic();
  },
  // Re-apply after a settings change.
  apply() {
    applyVolumes();
    syncMusic();
  },
  sfx(name) {
    if (!unlocked || !prefs.sfxOn) return;
    audio.play(name);
  },
};
