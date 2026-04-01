import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 overflow-hidden flex flex-col relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="w-full p-6 flex items-center justify-center gap-3 border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
        <Gamepad2 className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" size={32} />
        <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Neon Snake & Synth
        </h1>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-6 z-10">
        <div className="flex-1 flex justify-center lg:justify-end w-full max-w-2xl">
          <SnakeGame />
        </div>
        <div className="flex-1 flex justify-center lg:justify-start w-full max-w-2xl">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
