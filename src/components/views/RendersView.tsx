import React, { useState } from 'react';
import type { 
  RenderFile, 
  TeamMember 
} from '../../types';
import { 
  Video, 
  Play, 
  Pause, 
  MessageSquare, 
  Send
} from 'lucide-react';

interface RendersViewProps {
  renders: RenderFile[];
  team: TeamMember[];
  onAddFeedback: (renderId: string, authorId: string, timecodeSec: number, comment: string) => void;
}

export const RendersView: React.FC<RendersViewProps> = ({
  renders,
  team,
  onAddFeedback
}) => {
  const [selectedRenderId, setSelectedRenderId] = useState<string>(renders[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(1.5);
  const [commentText, setCommentText] = useState('');

  const currentRender = renders.find(r => r.id === selectedRenderId) || renders[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentRender) return;

    onAddFeedback(currentRender.id, 'user_sarah', Number(currentTimeSec.toFixed(1)), commentText.trim());
    setCommentText('');
  };

  const formatTimecode = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const remainingSec = Math.floor(sec % 60).toString().padStart(2, '0');
    const frames = Math.floor((sec % 1) * 24).toString().padStart(2, '0');
    return `00:${mins}:${remainingSec}:${frames}`;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Top Bar with Version Switcher */}
      <div className="h-16 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-base font-semibold text-stone-900">
              Video Renders & Daily Review
            </h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
            {currentRender?.resolution}
          </span>
        </div>

        {/* Versions Tabs */}
        <div className="flex items-center space-x-2">
          {renders.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRenderId(r.id);
                setCurrentTimeSec(1.0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedRenderId === r.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {r.shotCode} ({r.version})
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Center */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Left 2 Cols: Cinematic Player Canvas */}
        <div className="lg:col-span-2 p-6 flex flex-col justify-between overflow-y-auto">
          {currentRender ? (
            <div className="space-y-4">
              {/* Player Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-lg aspect-video flex items-center justify-center group">
                <img 
                  src={currentRender.posterUrl} 
                  alt={currentRender.fileName} 
                  className="w-full h-full object-cover"
                />

                {/* 2.39:1 Anamorphic Mask Overlay */}
                <div className="absolute inset-x-0 top-0 h-6 bg-black/90 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-black/90 pointer-events-none" />

                {/* Big Center Play Trigger */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-lg"
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                </button>

                {/* Overlay Top Bar */}
                <div className="absolute top-8 left-6 right-6 flex items-center justify-between text-xs text-white/80 pointer-events-none">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      {currentRender.shotCode}
                    </span>
                    <span className="font-mono bg-amber-600/80 px-2 py-0.5 rounded text-white backdrop-blur-md">
                      {currentRender.renderEngine}
                    </span>
                  </div>
                  <span className="font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    {currentRender.fps} FPS
                  </span>
                </div>

                {/* Current Timecode Display */}
                <div className="absolute bottom-8 left-6 font-mono text-xs text-amber-300 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md">
                  TC: {formatTimecode(currentTimeSec)} / {formatTimecode(currentRender.durationSec)}
                </div>
              </div>

              {/* Timecode Timeline Scrubber */}
              <div className="p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>00:00:00:00</span>
                  <span className="text-stone-900 font-semibold">{currentTimeSec.toFixed(1)}s</span>
                  <span>{currentRender.durationSec.toFixed(1)}s</span>
                </div>

                {/* Scrubber track with feedback pins */}
                <div className="relative py-2">
                  <input
                    type="range"
                    min="0"
                    max={currentRender.durationSec}
                    step="0.1"
                    value={currentTimeSec}
                    onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />

                  {/* Marker Pins */}
                  {currentRender.feedback.map((fb) => {
                    const pct = (fb.timecodeSec / currentRender.durationSec) * 100;
                    return (
                      <div
                        key={fb.id}
                        onClick={() => setCurrentTimeSec(fb.timecodeSec)}
                        title={`Note at ${fb.timecodeSec}s: ${fb.comment}`}
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white cursor-pointer hover:scale-125 transition-transform"
                        style={{ left: `${pct}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>No renders found.</div>
          )}
        </div>

        {/* Right 1 Col: Timecoded Feedback Notes */}
        <div className="border-t lg:border-t-0 lg:border-l border-[#e9e3d8] bg-white flex flex-col justify-between h-full">
          <div className="p-4 border-b border-[#e9e3d8] flex items-center justify-between bg-[#fcfaf6]">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Timecoded Director Notes ({currentRender?.feedback.length || 0})
              </h3>
            </div>
          </div>

          {/* Feedback Stream */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {currentRender?.feedback.map((fb) => {
              const author = team.find(m => m.id === fb.authorId);

              return (
                <div
                  key={fb.id}
                  onClick={() => setCurrentTimeSec(fb.timecodeSec)}
                  className="p-3 rounded-xl border border-stone-100 bg-[#fcfaf6] hover:border-amber-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        @{fb.timecodeSec.toFixed(1)}s
                      </span>
                      <span className="text-xs font-semibold text-stone-800">
                        {author?.name || 'Studio Member'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{fb.createdAt}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-snug">
                    {fb.comment}
                  </p>
                </div>
              );
            })}
          </div>

          {/* New Timecode Note Input */}
          <form onSubmit={handlePostComment} className="p-4 border-t border-[#e9e3d8] bg-[#fcfaf6] space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
              <span>Pinned timestamp:</span>
              <span className="font-bold text-amber-700">@{currentTimeSec.toFixed(1)}s</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add director note at timestamp..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#e9e3d8] bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                title="Post Timecoded Note"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
