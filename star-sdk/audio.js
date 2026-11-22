const effects = {
  click: [660, 0.04],
  pickup: [880, 0.12],
  success: [1046.5, 0.24],
  hurt: [220, 0.2],
};

export function createStarAudio() {
  let context;
  let musicVolume = 1;
  let sfxVolume = 1;
  let definitions = {};
  let currentMusic = null;

  function getContext() {
    if (!context) context = new AudioContext();
    return context;
  }

  function stopTrack(track) {
    track.active = false;
    clearTimeout(track.timer);
    track.gain.disconnect();
  }

  function playCycle(track, loop) {
    if (!track.active) return;

    const { synth, duration } = track.definition;
    const frequencies = Array.isArray(synth.frequency) ? synth.frequency : [synth.frequency];
    const noteDuration = duration / frequencies.length;
    const start = getContext().currentTime + 0.02;

    frequencies.forEach((frequency, index) => {
      const noteStart = start + index * noteDuration;
      const oscillator = getContext().createOscillator();
      const envelope = getContext().createGain();
      oscillator.type = synth.waveform || 'square';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      envelope.gain.setValueAtTime(0.0001, noteStart);
      envelope.gain.linearRampToValueAtTime(0.12, noteStart + 0.01);
      envelope.gain.setValueAtTime(0.12, noteStart + noteDuration * 0.8);
      envelope.gain.linearRampToValueAtTime(0.0001, noteStart + noteDuration * 0.95);
      oscillator.connect(envelope);
      envelope.connect(track.gain);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + noteDuration);
      oscillator.addEventListener('ended', () => {
        oscillator.disconnect();
        envelope.disconnect();
      }, { once: true });
    });

    track.timer = setTimeout(() => {
      if (loop) playCycle(track, true);
      else {
        if (currentMusic === track) currentMusic = null;
        stopTrack(track);
      }
    }, duration * 1000);
  }

  function fadeTrack(track, duration) {
    const audioContext = getContext();
    track.gain.gain.cancelScheduledValues(audioContext.currentTime);
    track.gain.gain.setValueAtTime(track.gain.gain.value, audioContext.currentTime);
    track.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    setTimeout(() => stopTrack(track), duration * 1000 + 50);
  }

  return {
    setSfxVolume(value) {
      sfxVolume = value;
    },
    setMusicVolume(value) {
      musicVolume = value;
      if (currentMusic) {
        currentMusic.gain.gain.setTargetAtTime(
          musicVolume * (currentMusic.definition.synth.volume / 100),
          getContext().currentTime,
          0.02,
        );
      }
    },
    preload(items) {
      definitions = { ...definitions, ...items };
      return Promise.resolve();
    },
    play(name) {
      const [frequency, duration] = effects[name] || [440, 0.08];
      const audioContext = getContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(sfxVolume * 0.12, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
      oscillator.addEventListener('ended', () => {
        oscillator.disconnect();
        gain.disconnect();
      }, { once: true });
    },
    music: {
      stop(duration = 0) {
        if (!currentMusic) return;
        const track = currentMusic;
        currentMusic = null;
        if (duration > 0) fadeTrack(track, duration);
        else stopTrack(track);
      },
      crossfadeTo(id, { duration = 0, loop = true } = {}) {
        const definition = definitions[id];
        if (!definition) return Promise.reject(new Error(`Unknown music track: ${id}`));

        if (currentMusic) {
          fadeTrack(currentMusic, duration);
        }

        const audioContext = getContext();
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.connect(audioContext.destination);
        const track = { active: true, definition, gain, timer: null };
        currentMusic = track;
        gain.gain.linearRampToValueAtTime(
          musicVolume * (definition.synth.volume / 100),
          audioContext.currentTime + duration,
        );
        playCycle(track, loop);
        return Promise.resolve();
      },
    },
  };
}
