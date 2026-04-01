import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Cybernetic Horizon', artist: 'AI SynthGen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Neon Grid Runner', artist: 'AI SynthGen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Afterglow', artist: 'AI SynthGen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-gray-900/90 border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(244,114,182,0.15)] backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          <Music size={32} className="text-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-pink-400 font-bold text-lg truncate drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-purple-300/70 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-pink-400 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="text-gray-400 hover:text-pink-400 transition-colors hover:shadow-[0_0_10px_rgba(244,114,182,0.5)] rounded-full p-1"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-pink-500 text-white rounded-full hover:bg-pink-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(236,72,153,0.6)]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={playNext}
            className="text-gray-400 hover:text-pink-400 transition-colors hover:shadow-[0_0_10px_rgba(244,114,182,0.5)] rounded-full p-1"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
