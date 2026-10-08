import React from 'react';
import type { 
  Project, 
  Shot, 
  ScriptScene, 
  StoryboardFrame, 
  AudioTake, 
  RenderFile, 
  ProjectModule 
} from '../../types';
import { 
  ScrollText, 
  Film, 
  Kanban, 
  Mic2, 
  Video, 
  ArrowRight, 
  Calendar 
} from 'lucide-react';

interface ProjectHubViewProps {
  project: Project;
  shots: Shot[];
  scenes: ScriptScene[];
  storyboards: StoryboardFrame[];
  audioTakes: AudioTake[];
  renders: RenderFile[];
  onOpenModule: (module: ProjectModule) => void;
}

export const ProjectHubView: React.FC<ProjectHubViewProps> = ({
  project,
  shots,
  scenes,
  storyboards,
  audioTakes,
  renders,
  onOpenModule
}) => {
  const approvedShots = shots.filter(s => s.stage === 'Approved').length;
  const inProgressShots = shots.filter(s => s.stage !== 'Approved' && s.stage !== 'Script').length;
  const totalFrames = shots.reduce((acc, s) => acc + (s.endFrame - s.startFrame + 1), 0);
  const totalDurationSec = (totalFrames / project.fps).toFixed(1);
  const completionPct = shots.length > 0 ? Math.round((approvedShots / shots.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Project Banner & Metadata */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e9e3d8] bg-gradient-to-br from-white via-[#fcfaf6] to-[#f6efe3] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
              {project.status}
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.fps} FPS
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.aspectRatio}
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.resolution}
            </span>
            <span className="flex items-center text-xs text-stone-600 font-medium ml-2">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
              Target: {project.deadline}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6">
            {project.synopsis}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/80 border border-[#e9e3d8]/80 backdrop-blur-xs">
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Progress</span>
              <span className="text-lg font-mono font-bold text-amber-800">{completionPct}%</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Approved</span>
              <span className="text-lg font-mono font-bold text-emerald-700">{approvedShots} / {shots.length}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Cut Time</span>
              <span className="text-lg font-mono font-bold text-stone-800">{totalDurationSec}s</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Total Frames</span>
              <span className="text-lg font-mono font-bold text-stone-800">{totalFrames} f</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      </div>

      {/* Section Header */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-stone-900 mb-1">
          Production Pipeline Modules
        </h2>
        <p className="text-xs text-stone-500">
          Click any card below to open its dedicated studio canvas
        </p>
      </div>

      {/* 5 Production Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Screenplay & Script Card */}
        <div 
          onClick={() => onOpenModule('script')}
          className="bg-white rounded-2xl border border-[#e9e3d8] p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <ScrollText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                {scenes.length} Scenes
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
              Screenplay & Script
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Screenplay formatting with sluglines, character dialogue, parentheticals, and scene beat timing.
            </p>

            <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] space-y-1.5 font-mono text-[11px] text-stone-600 mb-4">
              <div className="truncate font-semibold text-stone-800">
                {scenes[0]?.slugline || 'SCENE BREAKDOWN'}
              </div>
              <div className="truncate text-stone-500 text-[10px]">
                {scenes[0]?.elements.find(e => e.type === 'dialogue')?.text || 'Dialogue beats locked'}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open Screenplay Editor</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Storyboard Studio Card */}
        <div 
          onClick={() => onOpenModule('storyboard')}
          className="bg-white rounded-2xl border border-[#e9e3d8] p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Film className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                {storyboards.length} Frames
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
              Storyboard Studio
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Visual frame cards, camera movement directions, duration counters, audio cues, and fullscreen Lightbox.
            </p>

            {/* Thumbnail Snippet */}
            {storyboards[0] && (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-[#e9e3d8] mb-4 bg-stone-900">
                <img 
                  src={storyboards[0].imageUrl} 
                  alt="Storyboard preview" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                  Shot {storyboards[0].shotNumber} • {storyboards[0].cameraMovement}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open Storyboard Sequencer</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 3. Animation Shots Card */}
        <div 
          onClick={() => onOpenModule('shots')}
          className="bg-white rounded-2xl border border-[#e9e3d8] p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Kanban className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                {approvedShots}/{shots.length} Approved
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
              Animation Shots
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              7-Stage production tracking: Layout → Keyframe → In-Between → Color & FX → Composite → Approved.
            </p>

            <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] mb-4 space-y-2">
              <div className="flex justify-between text-[11px] text-stone-600 font-medium">
                <span>Production Board</span>
                <span className="font-mono text-amber-800">{inProgressShots} in progress</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open Shots Board & Table</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4. Voice & Audio Lab Card */}
        <div 
          onClick={() => onOpenModule('audio')}
          className="bg-white rounded-2xl border border-[#e9e3d8] p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Mic2 className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                {audioTakes.length} Takes
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
              Voice & Audio Lab
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Character voice takes auditioning, dynamic waveform player, 5-star rating, and atmospheric Foley library.
            </p>

            <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] mb-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-xs font-bold">
                ♪
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-stone-800 truncate">
                  {audioTakes[0]?.characterName || 'Voice Tracks'}
                </p>
                <p className="text-[10px] text-stone-400 truncate">
                  "{audioTakes[0]?.lineText || 'Master dialogue mix'}"
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open Audio Lab</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 5. Video Renders & Review Card */}
        <div 
          onClick={() => onOpenModule('renders')}
          className="bg-white rounded-2xl border border-[#e9e3d8] p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Video className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200 font-medium">
                {renders[0]?.version || 'v03 Cut'}
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
              Renders & Review
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              2.39:1 Anamorphic video player, timecode scrub bar (`00:00:00:00`), and timecoded director comment pins.
            </p>

            <div className="p-3 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] mb-4 flex items-center justify-between text-xs text-stone-600">
              <span className="font-mono font-medium">{renders[0]?.fileName || 'AURA_Master.mp4'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono">
                {renders[0]?.resolution.split(' ')[0] || '4K'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open Renders & Review Suite</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
