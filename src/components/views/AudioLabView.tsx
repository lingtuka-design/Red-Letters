import React, { useState, useEffect } from 'react';
import type { 
  AudioTake, 
  TeamMember 
} from '../../types';
import { 
  Mic2, 
  Play, 
  Pause, 
  Star, 
  CheckCircle 
} from 'lucide-react';

interface AudioLabViewProps {
  takes: AudioTake[];
  team: TeamMember[];
  onSelectTake: (takeId: string) => void;
}

export const AudioLabView: React.FC<AudioLabViewProps> = ({
  takes,
  onSelectTake
}) => {
  const [playingTakeId, setPlayingTakeId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [activeCharacterFilter, setActiveCharacterFilter] = useState<string>('all');

  // Simulated audio playback progress loop
  useEffect(() => {
    let interval: any;
    if (playingTakeId) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setPlayingTakeId(null);
            return 0;
          }
          return prev + 5;
        });
      }, 150);
    } else {
      setPlaybackProgress(0);
    }
    return () => clearInterval(interval);
  }, [playingTakeId]);

  const togglePlay = (takeId: string) => {
    if (playingTakeId === takeId) {
      setPlayingTakeId(null);
    } else {
      setPlayingTakeId(takeId);
      setPlaybackProgress(0);
    }
  };

  const characters = Array.from(new Set(takes.map(t => t.characterName)));
  const filteredTakes = activeCharacterFilter === 'all' 
    ? takes 
    : takes.filter(t => t.characterName === activeCharacterFilter);

  const foleyLibrary = [
    { name: 'Observatory Shutter Clunk', category: 'Mechanical', duration: '1.4s', icon: '⚙️' },
    { name: 'Cog Footsteps (Brass Mesh)', category: 'Foley', duration: '3.2s', icon: '🐾' },
    { name: 'Lumina Flora Harmonic Hum', category: 'Synthesizer', duration: '4.8s', icon: '✨' },
    { name: 'Highland Mountain Gale', category: 'Ambience', duration: '8.0s', icon: '💨' }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Top Bar */}
      <div className="h-16 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Mic2 className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-base font-semibold text-stone-900">
              Voiceover & Sound Lab
            </h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
            {takes.length} Audition Takes
          </span>
        </div>

        {/* Character Filter */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveCharacterFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCharacterFilter === 'all'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Tracks
          </button>
          {characters.map(char => (
            <button
              key={char}
              onClick={() => setActiveCharacterFilter(char)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCharacterFilter === char
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content (Split Audio Takes & Foley SFX) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
        {/* Dialogue Takes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Character Voice Lines & Audition Takes
            </h3>
            <span className="text-xs text-stone-500 font-sans">
              Lead Sound Designer: <strong className="text-stone-800">Maya Raman</strong>
            </span>
          </div>

          <div className="space-y-3">
            {filteredTakes.map((take) => {
              const isPlaying = playingTakeId === take.id;

              return (
                <div
                  key={take.id}
                  className={`p-4 md:p-5 rounded-2xl border transition-all ${
                    take.isSelected
                      ? 'bg-white border-amber-400 ring-2 ring-amber-100/60 shadow-xs'
                      : 'bg-white/80 border-[#e9e3d8] hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Character & Dialogue */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                          {take.characterName}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          Take #{take.takeNumber.toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500">{take.voiceActor}</span>

                        {take.isSelected && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>Master Mix Selected</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-serif italic text-stone-900 leading-snug">
                        "{take.lineText}"
                      </p>

                      {take.notes && (
                        <p className="text-xs text-amber-800/80 mt-1 font-sans">
                          Director Note: {take.notes}
                        </p>
                      )}
                    </div>

                    {/* Controls & Waveform */}
                    <div className="flex items-center space-x-4 shrink-0">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => togglePlay(take.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isPlaying
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      {/* Waveform Visualization */}
                      <div className="w-32 md:w-44 h-9 flex items-center space-x-1 px-2 rounded-lg bg-[#fcfaf6] border border-[#e9e3d8]">
                        {take.waveformData.map((amp, idx) => {
                          const isPast = isPlaying && (idx / take.waveformData.length) * 100 <= playbackProgress;

                          return (
                            <div
                              key={idx}
                              className={`w-1.5 rounded-full transition-all duration-150 ${
                                isPast
                                  ? 'bg-amber-600'
                                  : isPlaying
                                  ? 'bg-amber-300 animate-pulse'
                                  : 'bg-stone-300'
                              }`}
                              style={{ height: `${Math.max(amp * 0.35, 4)}px` }}
                            />
                          );
                        })}
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3.5 h-3.5 ${star <= take.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} 
                          />
                        ))}
                      </div>

                      {/* Select Button */}
                      {!take.isSelected && (
                        <button
                          onClick={() => onSelectTake(take.id)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          Choose Take
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Foley & Sound Design Elements */}
        <div className="pt-4 border-t border-[#e9e3d8]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
            Atmospheric Foley & Sound Effects Track
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {foleyLibrary.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#e9e3d8] flex items-center space-x-3 shadow-xs hover:border-amber-300 transition-colors"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-stone-800 leading-tight truncate">{item.name}</p>
                  <p className="text-[11px] text-stone-400 font-mono">{item.category} • {item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
